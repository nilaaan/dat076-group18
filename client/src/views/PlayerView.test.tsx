import { render, waitFor, fireEvent } from '@testing-library/react';
import axios, { AxiosError } from 'axios';
import PlayerView from './PlayerView';

jest.mock('axios');

const mockAxios = axios.get as jest.Mock;

test('Displays ChoiceBox initially', async () => {
    
    const { getByText} = render(<PlayerView />);

    await waitFor(() => {
        expect(getByText(/Select a player/i)).toBeInTheDocument();
    });
});

test('Displays error message if player data cannot be loaded', async () => {
    mockAxios.mockRejectedValueOnce(new AxiosError());
    
    const { getByRole, getByText } = render(<PlayerView />);

    fireEvent.change(getByRole('combobox'), { target: { value: '1' } });

    await waitFor(() => {
        expect(getByText(/Error loading player/i)).toBeInTheDocument();
    });
});

test('Displays player information when data is successfully loaded', async () => {
    const mockPlayer = {
        id: '1',
        name: 'Mock Player',
        price: 10,
        position: 'Forward',
        number: 9,
        club: 'Mock Club',
        points: 20,
    };

    mockAxios.mockResolvedValueOnce({ data: mockPlayer });

    const { getByRole, getByText } = render(<PlayerView />);

    fireEvent.change(getByRole('combobox'), { target: { value: '1' } });

    await waitFor(() => {
        expect(getByText(/Mock Player/i)).toBeInTheDocument();
        expect(getByText(/Mock Club/i)).toBeInTheDocument();

    });
});
