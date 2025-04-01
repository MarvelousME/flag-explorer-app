import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardMedia, CardContent, CircularProgress, Alert } from '@mui/material';
import api from '../Utils/api';
import logger from '../Utils/logger';

const FlagGrid = () => {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCountries = async () => {
            logger.info('Fetching countries for flag grid');
            try {
                const response = await api.get('/api/countries');
                setCountries(response.data);
                logger.info(`Successfully fetched ${response.data.length} countries for flag grid`);
                setLoading(false);
            } catch (err) {
                const errorMessage = err.response?.data || 'Failed to fetch countries.';
                logger.error(`Error fetching countries for flag grid: ${errorMessage}`);
                setError(errorMessage);
                setLoading(false);
                if (err.response?.status === 401) {
                    logger.warn('Unauthorized access, redirecting to login');
                    navigate('/login');
                }
            }
        };

        fetchCountries();
    }, [navigate]);

    if (loading) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading flags...
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
                Flag Grid
            </Typography>
            <Grid container spacing={2}>
                {countries.map((country) => (
                    <Grid item xs={12} sm={6} md={4} key={country.name}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={country.flag}
                                alt={`${country.name} flag`}
                            />
                            <CardContent>
                                <Typography variant="h6">{country.name}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default FlagGrid;