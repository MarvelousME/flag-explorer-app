import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import api from '../Utils/api';
import logger from '../Utils/logger';
import { useAuth } from '../AuthContext';

const Profile = () => {
    const { user } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            logger.info(`Fetching profile for user: ${user?.username}`);
            try {
                const response = await api.get('/api/users/profile');
                setUsername(response.data.username);
                setEmail(response.data.email || '');
                logger.info(`Successfully fetched profile for user: ${user?.username}`);
                setLoading(false);
            } catch (err) {
                const errorMessage = err.response?.data || 'Failed to fetch profile.';
                logger.error(`Error fetching profile: ${errorMessage}`);
                setError(errorMessage);
                setLoading(false);
                if (err.response?.status === 401) {
                    logger.warn('Unauthorized access, redirecting to login');
                    navigate('/login');
                }
            }
        };

        fetchProfile();
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        logger.info(`Updating profile for user: ${username}`);
        try {
            await api.put('/api/users/profile', { username, email });
            logger.info(`Successfully updated profile for user: ${username}`);
            setSuccess('Profile updated successfully!');
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.data || 'Failed to update profile.';
            logger.error(`Error updating profile: ${errorMessage}`);
            setError(errorMessage);
            setSuccess(null);
        }
    };

    if (loading) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading profile...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Profile
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Update Profile
                </Button>
            </Box>
        </Container>
    );
};

export default Profile;