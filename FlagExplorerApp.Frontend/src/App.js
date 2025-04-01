import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ManagePermissions from './components/ManagePermissions';
import ManageUsers from './components/ManageUsers';
import CountryDetails from './components/CountryDetails';
import FlagGrid from './components/FlagGrid';
import AuditLog from './components/AuditLog';
import Profile from './components/Profile';

function App() {
    return (
        <Router>
            <AuthProvider>
                <CssBaseline />
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/permissions" element={<ManagePermissions />} />
                    <Route path="/users" element={<ManageUsers />} />
                    <Route path="/countries" element={<CountryDetails />} />
                    <Route path="/flags" element={<FlagGrid />} />
                    <Route path="/audit" element={<AuditLog />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/" element={<Login />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;