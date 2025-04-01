import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import api from '../Utils/api';
import logger from '../Utils/logger';
import { useAuth } from '../AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [countryData, setCountryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCountries = async () => {
            logger.info('Fetching countries for dashboard pie chart');
            try {
                const response = await api.get('/api/countries');
                const countries = response.data;

                // Group countries by region
                const regionCounts = countries.reduce((acc, country) => {
                    const region = country.region || 'Unknown';
                    acc[region] = (acc[region] || 0) + 1;
                    return acc;
                }, {});

                // Format data for pie chart
                const chartData = Object.keys(regionCounts).map(region => ({
                    name: region,
                    value: regionCounts[region]
                }));

                setCountryData(chartData);
                logger.info(`Successfully fetched ${countries.length} countries for dashboard`);
                setLoading(false);
            } catch (err) {
                const errorMessage = err.response?.data || 'Failed to fetch countries for dashboard.';
                logger.error(`Error fetching countries for dashboard: ${errorMessage}`);
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

    logger.info(`Rendering Dashboard for user: ${user?.username}`);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

    if (loading) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading dashboard...
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
                Welcome to Flag Explorer, {user?.username}!
            </Typography>
            <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                    Use the navigation bar to explore countries, manage users, permissions, audit logs, or update your profile.
                </Typography>
            </Box>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Countries by Region
                </Typography>
                {countryData.length > 0 ? (
                    <PieChart width={400} height={400}>
                        <Pie
                            data={countryData}
                            cx={200}
                            cy={200}
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label
                        >
                            {countryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                ) : (
                    <Typography>No data available for the chart.</Typography>
                )}
            </Box>
        </Container>
    );
};

export default Dashboard;