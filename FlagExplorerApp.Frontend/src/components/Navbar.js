import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../AuthContext';
import logger from '../utils/logger';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logger.info(`User ${user?.username} logged out via navbar`);
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenu}
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {isAuthenticated ? (
                        <>
                            <MenuItem onClick={handleClose} component={Link} to="/dashboard">
                                Dashboard
                            </MenuItem>
                            <MenuItem onClick={handleClose} component={Link} to="/users">
                                Manage Users
                            </MenuItem>
                            <MenuItem onClick={handleClose} component={Link} to="/permissions">
                                Manage Permissions
                            </MenuItem>
                            <MenuItem onClick={handleClose} component={Link} to="/countries">
                                Country Explorer
                            </MenuItem>
                            <MenuItem onClick={handleClose} component={Link} to="/flags">
                                Flag Grid
                            </MenuItem>
                            <MenuItem onClick={handleClose} component={Link} to="/audit">
                                Audit Logs
                            </MenuItem>
                            <MenuItem onClick={handleClose} component={Link} to="/profile">
                                Profile
                            </MenuItem>
                        </>
                    ) : (
                        <>
                            <MenuItem onClick={handleClose} component={Link} to="/login">
                                Login
                            </MenuItem>
                            <MenuItem onClick={handleClose} component={Link} to="/register">
                                Register
                            </MenuItem>
                        </>
                    )}
                </Menu>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Flag Explorer
                </Typography>
                {isAuthenticated && (
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;