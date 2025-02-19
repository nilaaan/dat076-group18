import { render, waitFor } from '@testing-library/react';
import BalanceView from './BalanceView';
import axios, { AxiosError } from 'axios';

jest.mock('axios');

const mockAxios = axios.get as jest.Mock;


test('Display loading message while waiting for balance to load', async () => {
    
    const { getByText, queryByText } = render(<BalanceView />);

    expect(getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
        expect(queryByText(/Loading.../i)).not.toBeInTheDocument();       
    });
});

test('Displays error message if player data cannot be loaded', async () => {
    mockAxios.mockRejectedValueOnce(new AxiosError());
    
    const { getByText } = render(<BalanceView />);

    await waitFor(() => {
        expect(getByText(/Error displaying balance/i)).toBeInTheDocument();
    });
});