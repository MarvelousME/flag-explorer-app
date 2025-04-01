import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import api from './utils/api';
import logger from '../utils/logger';

const AuditLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuditLogs = async () => {
            logger.info('Fetching audit logs');
            try {
                const response = await api.get('/Audit');
                setLogs(response.data);
                logger.info(`Successfully fetched ${response.data.length} audit logs`);
                setLoading(false);
            } catch (err) {
                const errorMessage = err.response?.data || 'Failed to fetch audit logs.';
                logger.error(`Error fetching audit logs: ${errorMessage}`);
                setError(errorMessage);
                setLoading(false);
                if (err.response?.status === 401) {
                    logger.warn('Unauthorized access, redirecting to login');
                    navigate('/login');
                }
            }
        };

        fetchAuditLogs();
    }, [navigate]);

    if (loading) {
        return (
            <Container sx={{ mt: 8, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading audit logs...
                </Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 8 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Audit Logs
            </Typography>
            {logs.length === 0 ? (
                <Typography>No audit logs available.</Typography>
            ) : (
                <List>
                    {logs.map((log) => (
                        <ListItem key={log.id} sx={{ borderBottom: '1px solid #ddd' }}>
                            <ListItemText
                                primary={`Action: ${log.action}`}
                                secondary={`Performed by ${log.username} on ${new Date(log.timestamp).toLocaleString()}`}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Container>
    );
};

export default AuditLog;