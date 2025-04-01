import { render, screen } from '@testing-library/react';
import FlagGrid from '../components/FlagGrid';
import axios from 'axios';

jest.mock('axios');

test('renders flag grid with countries', async () => {
    const mockCountries = [{ name: 'Test', flag: 'test.png' }];
    axios.get.mockResolvedValue({ data: mockCountries });

    render(<FlagGrid onSelectCountry={() => {}} />);
    expect(await screen.findByText('Test')).toBeInTheDocument();
});