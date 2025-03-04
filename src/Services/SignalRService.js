import * as signalR from '@microsoft/signalr';
import { toast } from 'react-hot-toast';
import store from '../stores';
import { addMessage, updateRoomUnreadStatus } from '../stores/slices/chatSlice';
import { jwtDecode } from 'jwt-decode';

class SignalRService {
  constructor() {
    this.connection = null;
    this.messageCallbacks = new Set();
    this.typingCallbacks = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.isConnecting = false;
    this.currentRoomId = null;
    this.currentToken = null;
    this.processedMessageIds = new Set();
  }
  getUsernameFromToken(token) {
    try {
      const decodedToken = jwtDecode(token);
      return (
        decodedToken.sub ||
        decodedToken.unique_name ||
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] ||
        null
      );
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }

  }
  async startConnection(token) {
    if (this.isConnecting) {
      console.log("Connection attempt already in progress");
      return;
    }

    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log("Connection already established");
      return;
    }

    this.isConnecting = true;
    this.currentToken = token;

    try {
      if (this.connection) {
        await this.stopConnection();
      }

      console.log("Starting new SignalR connection...");
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`https://localhost:7184/chatHub?access_token=${token}`)
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount >= this.maxReconnectAttempts) {
              console.log("Max reconnection attempts reached");
              return null;
            }
            const delay = Math.min(
              1000 * Math.pow(2, retryContext.previousRetryCount),
              30000
            );
            console.log(`Reconnecting in ${delay}ms...`);
            return delay;
          },
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.setupEventHandlers();

      console.log("Attempting to start connection...");
      await this.connection.start();
      console.log("SignalR Connected successfully");
      this.reconnectAttempts = 0;

      if (this.currentRoomId) {
        console.log("Auto-rejoining room:", this.currentRoomId);
        await this.joinRoom(this.currentRoomId);
      }

      return true;
    } catch (err) {
      console.error("SignalR Connection Error:", err);
      this.handleConnectionError(err);
      return false;
    } finally {
      this.isConnecting = false;
    }
  }

  setupEventHandlers() {
    if (!this.connection) return;

    this.connection.on("ReceiveMessage", (message) => {
      // Check if we've already processed this message
      if (this.processedMessageIds.has(message.id)) {
        console.log("Duplicate message detected, ignoring:", message.id);
        return;
      }

      // Add message ID to processed set
      this.processedMessageIds.add(message.id);

      console.log("Message received:", message);

      // Get current username from token
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const decodedToken = jwtDecode(currentUser.accessToken);
      const currentUsername =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      if (message.username !== currentUsername) {
        store.dispatch(addMessage(message));
        store.dispatch(
          updateRoomUnreadStatus({
            roomId: message.roomId,
            hasUnread: message.roomId !== this.currentRoomId,
          })
        );
      }

      // Optional: Clean up old message IDs after some time
      setTimeout(() => {
        this.processedMessageIds.delete(message.id);
      }, 60000); // Clean up after 1 minute
    });

    this.connection.on("UserTyping", (username, isTyping) => {
      console.log("Typing status received:", username, isTyping);
      this.typingCallbacks.forEach((callback) => callback(username, isTyping));
    });

    this.connection.onreconnecting((error) => {
      console.log("Connection lost. Attempting to reconnect...", error);
      toast.warning("Connection lost. Attempting to reconnect...");
    });

    this.connection.onreconnected(async (connectionId) => {
      console.log("Reconnected successfully. ConnectionId:", connectionId);
      toast.success("Reconnected successfully");

      if (this.currentRoomId) {
        try {
          await this.joinRoom(this.currentRoomId);
        } catch (err) {
          console.error('Failed to rejoin room after reconnection:', err);
        }
      }
    });

    this.connection.onclose(async (error) => {
      console.log("Connection closed:", error);

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(
          `Attempting to reconnect... (Attempt ${this.reconnectAttempts})`
        );
        await this.refreshConnection();
      } else {
        console.log(
          "Max reconnection attempts reached. Please refresh the page."
        );
        toast.error("Connection lost. Please refresh the page.");
      }
    });
  }

  async joinRoom(roomId) {
    if (
      !this.connection ||
      this.connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.log("Connection not ready. Attempting to connect...");
      const connected = await this.startConnection(this.currentToken);
      if (!connected) {
        throw new Error("Failed to establish connection");
      }
    }

    try {
      console.log("Joining room:", roomId);
      await this.connection.invoke("JoinRoom", roomId);
      this.currentRoomId = roomId;
      store.dispatch(
        updateRoomUnreadStatus({
          roomId,
          hasUnread: false,
        })
      );
      console.log("Successfully joined room:", roomId);
    } catch (err) {
      console.error("Error joining room:", err);
      this.handleConnectionError(err);
      throw err;
    }
  }

  async leaveRoom(roomId) {
    if (
      !this.connection ||
      this.connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.log("No active connection to leave room");
      return;
    }

    try {
      console.log("Leaving room:", roomId);
      await this.connection.invoke("LeaveRoom", roomId);
      this.currentRoomId = null;
      console.log("Successfully left room:", roomId);
    } catch (err) {
      console.error("Error leaving room:", err);
      this.handleConnectionError(err);
    }
  }

  async sendMessage(content, roomId) {
    if (
      !this.connection ||
      this.connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.log("Connection not ready. Attempting to connect...");
      const connected = await this.startConnection(this.currentToken);
      if (!connected) {
        throw new Error("Failed to establish connection");
      }
    }

    try {
      console.log("Sending message to room:", roomId);
      await this.connection.invoke("SendMessage", content, roomId);

      // Get current username from token for local message
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const decodedToken = jwtDecode(currentUser.accessToken);
      const username =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      const localMessage = {
        content,
        roomId,
        username,
        dateSent: new Date().toISOString(),
      };
      store.dispatch(addMessage(localMessage));

      console.log("Message sent successfully");
    } catch (err) {
      console.error("Error sending message:", err);
      this.handleConnectionError(err);
      throw err;
    }
  }

  async sendTypingStatus(roomId, isTyping) {
    if (
      !this.connection ||
      this.connection.state !== signalR.HubConnectionState.Connected
    ) {
      return;
    }

    try {
      await this.connection.invoke("SendTypingStatus", roomId, isTyping);
    } catch (err) {
      console.error("Error sending typing status:", err);
      // Silent fail for typing status
    }
  }

  async refreshConnection() {
    console.log("Refreshing connection...");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser?.accessToken) {
      console.error("No authentication token available");
      toast.error("Authentication failed. Please log in again.");
      return false;
    }

    this.currentToken = currentUser.accessToken;
    return this.startConnection(this.currentToken);
  }

  handleConnectionError(error) {
    if (
      error.message.includes("Authorization has been denied") ||
      error.message.includes("User not authenticated")
    ) {
      console.log(
        "Authentication error detected. Attempting to refresh connection..."
      );
      this.refreshConnection();
    } else {
      toast.error("Connection error occurred. Please try again.");
    }
  }

  onReceiveMessage(callback) {
    this.messageCallbacks.add(callback);
    return () => this.messageCallbacks.delete(callback);
  }

  onUserTyping(callback) {
    this.typingCallbacks.add(callback);
    return () => this.typingCallbacks.delete(callback);
  }

  async stopConnection() {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log("SignalR connection stopped");
      } catch (err) {
        console.error("Error stopping SignalR connection:", err);
      } finally {
        this.connection = null;
        this.messageCallbacks.clear();
        this.typingCallbacks.clear();
        this.reconnectAttempts = 0;
        this.currentRoomId = null;
        this.currentToken = null;
        this.isConnecting = false;
        this.processedMessageIds.clear(); // Clear processed message IDs
      }
    }
  }
  async updateLastSeen(roomId) {
    if (
        !this.connection ||
        this.connection.state !== signalR.HubConnectionState.Connected
    ) {
      console.log("Connection not ready. Cannot update last seen status.");
      return;
    }

    try {
      console.log("Updating last seen for room:", roomId);
      await this.connection.invoke("UpdateLastSeen", roomId);
      console.log("Last seen updated successfully");
    } catch (err) {
      console.error("Error updating last seen:", err);
      this.handleConnectionError(err);
    }
  }
}


export const signalRService = new SignalRService();
