import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import toast from 'react-hot-toast';

class VideoCallService {
    constructor() {
        this.connection = null;
        this.peerConnection = null;
        this.localStream = null;
        this.remoteStream = null;
        this.currentRoomId = null;
        this.configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                {
                    urls: 'turn:numb.viagenie.ca',
                    username: 'webrtc@live.com',
                    credential: 'muazkh'
                }
            ]
        };
    }

    async startConnection(token) {
        if (this.connection?.state === 'Connected') return;

        try {
            this.connection = new HubConnectionBuilder()
                .withUrl(`https://localhost:7184/videocallhub`, {
                    accessTokenFactory: () => token
                })
                .configureLogging(LogLevel.Debug)
                .withAutomaticReconnect()
                .build();

            console.log('Starting VideoCallHub connection...');
            await this.connection.start();
            console.log('VideoCallHub Connected successfully');
            this.setupSignalRHandlers();
        } catch (error) {
            console.error('Error starting VideoCallHub connection:', error);
            toast.error('Failed to connect to video call service');
            throw error;
        }
    }

    setupSignalRHandlers() {
        this.connection.on("IncomingCall", (callData) => {
            console.log('Incoming call:', callData);
            if (this.onIncomingCall) {
                this.onIncomingCall(callData);
            }
        });

        this.connection.on("CallAccepted", async (data) => {
            try {
                console.log('Call accepted:', data);
                if (!this.peerConnection) {
                    await this.setupPeerConnection();
                }
                if (this.onCallAccepted) {
                    this.onCallAccepted(data);
                }
                await this.createAndSendOffer(this.currentRoomId);
            } catch (error) {
                console.error('Error handling call acceptance:', error);
                toast.error('Failed to establish connection');
            }
        });

        this.connection.on("CallRejected", (data) => {
            console.log('Call rejected:', data);
            if (this.onCallRejected) {
                this.onCallRejected(data);
            }
            this.cleanup();
        });

        this.connection.on("CallEnded", (data) => {
            console.log('Call ended:', data);
            if (this.onCallEnded) {
                this.onCallEnded(data);
            }
            this.cleanup();
        });

        this.connection.on("ReceiveOffer", async (data) => {
            try {
                console.log('Received offer:', data);
                const { fromUsername, offer } = data;
                if (!this.peerConnection) {
                    await this.setupPeerConnection();
                }
                const parsedOffer = JSON.parse(offer);
                await this.peerConnection.setRemoteDescription(new RTCSessionDescription(parsedOffer));
                const answer = await this.peerConnection.createAnswer();
                await this.peerConnection.setLocalDescription(answer);

                // Send answer with the updated method signature
                await this.connection.invoke("SendAnswer", {
                    roomId: this.currentRoomId,
                    answer: JSON.stringify(answer)
                });
            } catch (error) {
                console.error('Error handling offer:', error);
                toast.error('Failed to process video call offer');
            }
        });

        this.connection.on("ReceiveAnswer", async (data) => {
            try {
                console.log('Received answer:', data);
                const { fromUsername, answer } = data;
                if (!this.peerConnection) {
                    console.error('No peer connection available');
                    return;
                }
                const parsedAnswer = JSON.parse(answer);
                await this.peerConnection.setRemoteDescription(new RTCSessionDescription(parsedAnswer));
            } catch (error) {
                console.error('Error handling answer:', error);
                toast.error('Failed to establish video connection');
            }
        });

        this.connection.on("ReceiveIceCandidate", async (data) => {
            try {
                console.log('Received ICE candidate:', data);
                const { fromUsername, iceCandidate } = data;
                if (!this.peerConnection) {
                    console.error('No peer connection available');
                    return;
                }
                if (this.peerConnection.remoteDescription) {
                    const candidate = JSON.parse(iceCandidate);
                    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                }
            } catch (error) {
                console.error('Error handling ICE candidate:', error);
            }
        });
    }

    async initiateCall(roomId) {
        try {
            console.log('Initiating call in room:', roomId);
            this.currentRoomId = roomId;
            await this.setupPeerConnection();
            await this.connection.invoke("InitiateVideoCall", roomId);
        } catch (error) {
            console.error('Error initiating call:', error);
            toast.error('Failed to start video call');
            this.cleanup();
            throw error;
        }
    }

    async acceptCall(roomId, callerUsername) {
        try {
            console.log('Accepting call from:', callerUsername, 'in room:', roomId);
            this.currentRoomId = roomId;
            await this.setupPeerConnection();
            await this.connection.invoke("AcceptCall", roomId, callerUsername);
        } catch (error) {
            console.error('Error accepting call:', error);
            toast.error('Failed to accept video call');
            this.cleanup();
            throw error;
        }
    }

    async rejectCall(roomId, callerUsername) {
        try {
            console.log('Rejecting call from:', callerUsername);
            await this.connection.invoke("RejectCall", roomId, callerUsername);
        } catch (error) {
            console.error('Error rejecting call:', error);
            toast.error('Failed to reject call');
            throw error;
        }
    }

    async endCall(roomId) {
        try {
            console.log('Ending call in room:', roomId);
            await this.connection.invoke("EndCall", roomId);
            this.cleanup();
        } catch (error) {
            console.error('Error ending call:', error);
            toast.error('Failed to end call');
            throw error;
        }
    }

    async createAndSendOffer(roomId) {
        try {
            if (!this.peerConnection) {
                throw new Error('Peer connection not initialized');
            }

            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);

            // Use an object for parameters instead of separate parameters
            await this.connection.invoke("SendOffer", {
                roomId: roomId,
                offer: JSON.stringify(offer)
            }).catch(err => console.error("Error creating/sending offer:", err));
        } catch (error) {
            console.error('Error creating/sending offer:', error);
            throw error;
        }
    }

    async setupPeerConnection() {
        console.log('Setting up peer connection...');
        if (this.peerConnection) {
            this.peerConnection.close();
        }

        this.peerConnection = new RTCPeerConnection(this.configuration);

        try {
            console.log('Requesting media access...');
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            console.log('Media access granted');

            this.localStream.getTracks().forEach(track => {
                console.log('Adding track to peer connection:', track.kind);
                this.peerConnection.addTrack(track, this.localStream);
            });

            if (this.onLocalStreamUpdate) {
                this.onLocalStreamUpdate(this.localStream);
            }

            this.peerConnection.ontrack = (event) => {
                console.log('Received remote track:', event.track.kind);
                this.remoteStream = event.streams[0];
                if (this.onRemoteStreamUpdate) {
                    this.onRemoteStreamUpdate(this.remoteStream);
                }
            };

            this.peerConnection.onicecandidate = async (event) => {
                if (event.candidate) {
                    console.log('New ICE candidate:', event.candidate);
                    try {
                        // Use an object for parameters instead of separate parameters
                        await this.connection.invoke(
                            "SendIceCandidate",
                            {
                                roomId: this.currentRoomId,
                                iceCandidate: JSON.stringify(event.candidate)
                            }
                        );
                    } catch (error) {
                        console.error('Error sending ICE candidate:', error);
                    }
                }
            };

            this.peerConnection.oniceconnectionstatechange = () => {
                console.log('ICE Connection State:', this.peerConnection.iceConnectionState);
                if (this.peerConnection.iceConnectionState === 'disconnected' ||
                    this.peerConnection.iceConnectionState === 'failed') {
                    toast.error('Video connection lost. Please try again.');
                    this.cleanup();
                }
            };

            console.log('Peer connection setup complete');
        } catch (error) {
            console.error('Error accessing media devices:', error);
            toast.error('Could not access camera or microphone');
            throw error;
        }
    }

    cleanup() {
        console.log('Cleaning up VideoCallService');
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                track.stop();
                console.log('Stopped track:', track.kind);
            });
            this.localStream = null;
        }

        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }

        this.currentRoomId = null;
        this.remoteStream = null;
    }

    async stopConnection() {
        this.cleanup();
        if (this.connection) {
            try {
                await this.connection.stop();
                this.connection = null;
                console.log('VideoCallHub Disconnected');
            } catch (error) {
                console.error('Error stopping VideoCallHub connection:', error);
            }
        }
    }
}

export const videoCallService = new VideoCallService();