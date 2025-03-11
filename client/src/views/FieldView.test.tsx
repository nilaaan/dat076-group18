import { act, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import FieldView from './FieldView';
import { AuthProvider } from '../components/AuthProvider';
import { getSession } from '../api/tempAuthAPI';

jest.mock('axios');
const axiosMock = axios.get as jest.Mock;

jest.mock('../api/tempAuthAPI', () => ({
    getSession: jest.fn()
}));
const mockGetSession = getSession as jest.Mock;

describe('FieldView', () => {
    beforeEach(() => {
        mockGetSession.mockResolvedValue({
            loggedIn: true,
            user: {
                username: 'testUser'
            }
        });
    });

    test('Renders correct number of player slots (11)', async () => {
        await act(async () => {
            render(<AuthProvider><FieldView /></AuthProvider>);
        });
        const playerSlots = screen.getAllByTestId(/player-slot-/);
        expect(playerSlots.length).toBe(11);
    });

    test('All player names from the team should be displayed', async () => {
        const mockTeamPlayers = [
            {
                id: 0,
                name: 'Player 0',
                position: 'Forward',
                number: 0,
                club: 'Club 0',
                price: 0,
                available: true,
                points: 0
            },
            {
                id: 1,
                name: 'Player 1',
                position: 'Midfielder',
                number: 1,
                club: 'Club 1',
                price: 0,
                available: true,
                points: 0
            }
        ];

        axiosMock.mockResolvedValueOnce({ data: mockTeamPlayers });

        await act(async () => {
            render(<AuthProvider><FieldView /></AuthProvider>);
        });

        await waitFor(() => {
            expect(screen.getByText(mockTeamPlayers[0].name)).toBeInTheDocument();
            expect(screen.getByText(mockTeamPlayers[1].name)).toBeInTheDocument();
        })
    });

    test('Display loading text while team loads', async () => {
        axiosMock.mockResolvedValueOnce({ data: [] });

        act(() => {
            render(<AuthProvider><FieldView /></AuthProvider>);
        });

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
        });
    })
})