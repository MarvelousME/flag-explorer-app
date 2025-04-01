import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../AuthContext';
import { BrowserRouter } from 'react-router-dom';

test('renders navbar with links when logged in', () => {
    const mockUser = { role: 'Admin', permissions: ['ViewDashboard', 'ViewCountries', 'ViewUsers', 'ViewAudit', 'ManagePermissions', 'ViewProfile'] };
    render(
        <AuthProvider value={{ user: mockUser, login: jest.fn(), logout: jest.fn() }}>
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        </AuthProvider>
    );

    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/country explorer/i)).toBeInTheDocument();
    expect(screen.getByText(/manage/i)).toBeInTheDocument();
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
});