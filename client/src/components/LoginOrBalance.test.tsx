/*import { render, waitFor } from '@testing-library/react';
import axios, { AxiosError } from 'axios';
import LoginOrBalance from './LoginOrBalance';

jest.mock('axios');

const mockAxios = axios.get as jest.Mock;


test('Display loading message while waiting for balance to load', async () => {
    const { getByText, queryByText } = render(<LoginOrBalance />);

    /*expect(getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
        expect(queryByText(/Loading.../i)).not.toBeInTheDocument();       
    });
});

test('Displays error message if player data cannot be loaded', async () => {
    mockAxios.mockRejectedValueOnce(new AxiosError());
    
    const { getByText } = render(<LoginOrBalance />);

    await waitFor(() => {
        expect(getByText(/Error displaying balance/i)).toBeInTheDocument();
    });
});*/