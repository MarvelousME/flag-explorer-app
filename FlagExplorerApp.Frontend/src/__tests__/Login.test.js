import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../components/Login';
import { AuthProvider } from '../AuthContext';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

test('renders login form and submits correctly', async () => {
    axios.post.mockResolvedValue({ data: { token: 'mock-token' } });

    render(
        <AuthProvider>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/login/i));

    expect(axios.post).toHaveBeenCalledWith('https://localhost:5001/auth/login', {
        username: 'testuser',
        password: 'password123'
    });
});