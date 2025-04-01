import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Alert } from '@mui/material';
import api from '../Utils/api';
import logger from '../Utils/logger';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            logger.info('Fetching users');
            try {
                const response = await api.get('/api/users');
                setUsers(response.data);
                logger.info(`Successfully fetched ${response.data.length} users`);
                setLoading(false);
            } catch (err) {
                const errorMessage = err.response?.data || 'Failed to fetch users.';
                logger.error(`Error fetching users: ${errorMessage}`);
                setError(errorMessage);
                setLoading(false);
                if (err.response?.status === 401) {
                    logger.warn('Unauthorized access, redirecting to login');
                    navigate('/login');
                }
            }
        };

        fetchUsers();
    }, [navigate]);

    const handleDelete = async (id) => {
        logger.info(`Attempting to delete user with ID: ${id}`);
        try {
            await api.delete(`/api/users/${id}`);
            setUsers(users.filter(user => user.id !== id));
            logger.info(`Successfully deleted user with ID: ${id}`);
        } catch (err) {
            const errorMessage = err.response?.data || 'Failed to delete user.';
            logger.error(`Error deleting user: ${errorMessage}`);
            setError(errorMessage);
        }
    };

    if (loading) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading users...
                </Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Manage Users
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ManageUsers;