import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logger from './Utils/logger';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            setUser({ username: localStorage.getItem('username') || 'User' });
            logger.info('User is authenticated on app load');
        } else {
            logger.info('No token found, user is not authenticated');
        }
    }, []);

    const login = (token, username) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        setIsAuthenticated(true);
        setUser({ username });
        logger.info(`User ${username} logged in successfully`);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        setUser(null);
        logger.info('User logged out');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);