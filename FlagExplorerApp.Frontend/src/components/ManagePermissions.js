import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Button } from '@mui/material';
import api from '../Utils/api';
import logger from '../Utils/logger';

const ManagePermissions = () => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPermissions = async () => {
            logger.info('Fetching permissions');
            try {
                const response = await api.get('/api/permissions');
                setPermissions(response.data);
                logger.info(`Successfully fetched ${response.data.length} permissions`);
                setLoading(false);
            } catch (err) {
                const errorMessage = err.response?.data || 'Failed to fetch permissions.';
                logger.error(`Error fetching permissions: ${errorMessage}`);
                setError(errorMessage);
                setLoading(false);
                if (err.response?.status === 401) {
                    logger.warn('Unauthorized access, redirecting to login');
                    navigate('/login');
                }
            }
        };

        fetchPermissions();
    }, [navigate]);

    const handleAssignPermission = async (userId, permissionId) => {
        logger.info(`Assigning permission ${permissionId} to user ${userId}`);
        try {
            await api.post('/api/permissions/assign', { userId, permissionId });
            logger.info(`Successfully assigned permission ${permissionId} to user ${userId}`);
            // Refresh permissions
            const response = await api.get('/api/permissions');
            setPermissions(response.data);
        } catch (err) {
            const errorMessage = err.response?.data || 'Failed to assign permission.';
            logger.error(`Error assigning permission: ${errorMessage}`);
            setError(errorMessage);
        }
    };

    if (loading) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading permissions...
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
                Manage Permissions
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Permission</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {permissions.map((perm) => (
                            <TableRow key={`${perm.userId}-${perm.permissionId}`}>
                                <TableCell>{perm.username}</TableCell>
                                <TableCell>{perm.permissionName}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleAssignPermission(perm.userId, perm.permissionId)}
                                    >
                                        Assign
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

export default ManagePermissions;