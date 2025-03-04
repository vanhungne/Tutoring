import {useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Paper, Container } from '@mui/material';
import { School, Person } from '@mui/icons-material';
import { motion } from 'framer-motion';
import requests from '../../../Utils/requests.js';
import toast from 'react-hot-toast';

const RoleSelection = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [ setLoading] = useState(false);

    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const avatar = searchParams.get('avatar');
    const phone = searchParams.get('phone');

    const handleRoleSelect = async (roleId) => {
        try {
            setLoading(true);
         await requests.post(`GoogleAuth/select-role-user?email=${email}&name=${name}&avatar=${avatar}&phone=${phone}`, roleId);

            // if (response.data.token) {
            //     localStorage.setItem('currentUser', JSON.stringify({
            //         accessToken: response.data.token
            //     }));
                toast.success('Account watting system');
                navigate(roleId === 1 ? '/' : '/watting');
            // }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h3" align="center" gutterBottom sx={{
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        backgroundClip: 'text',
                        textFillColor: 'transparent',
                        mb: 4
                    }}>
                        Choose Your Role
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Paper
                                elevation={3}
                                onClick={() => handleRoleSelect(1)}
                                sx={{
                                    p: 4,
                                    width: 280,
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        bgcolor: '#f5f5f5',
                                        transform: 'translateY(-5px)'
                                    }
                                }}
                            >
                                <Person sx={{ fontSize: 60, color: '#2196F3', mb: 2 }} />
                                <Typography variant="h5" gutterBottom fontWeight="bold">
                                    Student
                                </Typography>
                                <Typography color="text.secondary">
                                    Join as a student to learn from expert tutors
                                </Typography>
                            </Paper>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Paper
                                elevation={3}
                                onClick={() => handleRoleSelect(2)}
                                sx={{
                                    p: 4,
                                    width: 280,
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        bgcolor: '#f5f5f5',
                                        transform: 'translateY(-5px)'
                                    }
                                }}
                            >
                                <School sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
                                <Typography variant="h5" gutterBottom fontWeight="bold">
                                    Tutor
                                </Typography>
                                <Typography color="text.secondary">
                                    Share your knowledge and teach students
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Box>
                </motion.div>
            </Box>
        </Container>
    );
};

export default RoleSelection;