import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';
import axios from 'axios';

jest.mock('axios');

test('renders dashboard with chart', async () => {
    axios.get.mockResolvedValue({ data: [{ name: 'Test', flag: 'test.png' }] });

    render(<Dashboard />);
    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalledWith('https://localhost:5001/countries', expect.any(Object));
});