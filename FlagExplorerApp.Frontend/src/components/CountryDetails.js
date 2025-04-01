import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, Box, CircularProgress, Alert } from '@mui/material';
import api from './utils/api';
import logger from '../utils/logger';

const CountryDetails = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCountries = async () => {
            logger.info('Fetching countries for country details');
            try {
                const response = await api.get('/api/countries');
                setCountries(response.data);
                logger.info(`Successfully fetched ${response.data.length} countries`);
                setLoading(false);
            } catch (err) {
                const errorMessage = err.response?.data || 'Failed to fetch countries.';
                logger.error(`Error fetching countries: ${errorMessage}`);
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

    const handleCountryChange = (event) => {
        const country = countries.find(c => c.name === event.target.value);
        setSelectedCountry(country);
        logger.info(`Selected country: ${country.name}`);
    };

    if (loading) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading countries...
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
                Country Explorer
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="country-select-label">Select Country</InputLabel>
                <Select
                    labelId="country-select-label"
                    id="country-select"
                    value={selectedCountry ? selectedCountry.name : ''}
                    label="Select Country"
                    onChange={handleCountryChange}
                >
                    {countries.map((country) => (
                        <MenuItem key={country.name} value={country.name}>
                            {country.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {selectedCountry && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h5">{selectedCountry.name}</Typography>
                    <Typography>Capital: {selectedCountry.capital}</Typography>
                    <Typography>Region: {selectedCountry.region}</Typography>
                    <Typography>Population: {selectedCountry.population.toLocaleString()}</Typography>
                    <Box sx={{ mt: 2 }}>
                        <img
                            src={selectedCountry.flag}
                            alt={`${selectedCountry.name} flag`}
                            style={{ width: '200px', height: 'auto' }}
                        />
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default CountryDetails;