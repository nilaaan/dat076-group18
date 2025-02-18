import { render, waitFor } from '@testing-library/react';
import axios, { AxiosError } from 'axios';
import TeamView from './TeamView';

jest.mock('axios');

const axiosMock = axios.get as jest.Mock;

test('Display loading message while waiting for team player data and remove it when loaded', async () => {
    axiosMock.mockResolvedValueOnce({ data: [] });
    
    const { getByText, queryByText } = render(<TeamView />);

    expect(getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
        expect(queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
});

test('Display error message if team players cannot be loaded', async () => {
    axiosMock.mockRejectedValueOnce(new AxiosError());
    
    const { getByText } = render(<TeamView />);

    await waitFor(() => {
        expect(getByText(/Error loading team/i)).toBeInTheDocument();
    });
});

test('Player names should be shown after team players are loaded', async () => {
    const mockTeamPlayers = [
        {
            id: 0,
            name: "Mock player 1"
        }
    ];

    axiosMock.mockResolvedValueOnce({ data: mockTeamPlayers });
    
    const { getByText } = render(<TeamView />);

    await waitFor(() => {
        expect(getByText(mockTeamPlayers[0].name)).toBeInTheDocument();
    });
});