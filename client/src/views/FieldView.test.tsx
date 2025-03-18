import { act, render, screen, waitFor } from '@testing-library/react';
import FieldView from './FieldView';
import { AuthProvider } from '../components/AuthProvider';
import { getSession } from '../api/tempAuthAPI';
import { Player } from '../Types';
import { isGameSession } from '../api/gamesessionApi';
import { getTeamPlayers } from '../api/teamPlayersApi';

jest.mock('../api/tempAuthAPI', () => ({
    getSession: jest.fn()
}));
jest.mock('../api/gamesessionApi', () => ({
    startGameSession: jest.fn(),
    isGameSession: jest.fn(),
    isGameSessionFinished: jest.fn(),
    isMatchesInProgress: jest.fn(),
    getCurrentRound: jest.fn(),
    getLeaderboard: jest.fn(),
    getGamesessionUsernames: jest.fn(),
    updateGameState: jest.fn(),
}));
jest.mock('../api/teamPlayersApi', () => ({
    getTeamPlayers: jest.fn()
}));
const mockGetSession = getSession as jest.Mock;
const mockIsGameSession = isGameSession as jest.Mock;
const mockGetTeamPlayers = getTeamPlayers as jest.Mock;

describe('FieldView', () => {
    beforeEach(() => {
        mockGetSession.mockResolvedValue({
            loggedIn: true,
            user: {
                username: 'testUser'
            }
        });
        mockIsGameSession.mockResolvedValue(true);
    });

    test('Renders correct number of player slots (11)', async () => {
        mockGetTeamPlayers.mockResolvedValueOnce([]);
        
        await act(async () => {
            render(<AuthProvider><FieldView /></AuthProvider>);
        });
        const playerSlots = screen.getAllByTestId(/player-slot-/);
        expect(playerSlots.length).toBe(11);
    });

    test('All player names from the team should be displayed', async () => {
        const mockTeamPlayers: Player[] = [
            {
                id: 0,
                name: 'Player 0',
                position: 'Forward',
                number: 0,
                club: 'Club 0',
                price: 0,
                available: true,
                points: 0,
                image: ''
            },
            {
                id: 1,
                name: 'Player 1',
                position: 'Midfielder',
                number: 1,
                club: 'Club 1',
                price: 0,
                available: true,
                points: 0,
                image: ''
            }
        ];

        mockGetTeamPlayers.mockResolvedValueOnce(mockTeamPlayers);

        await act(async () => {
            render(<AuthProvider><FieldView /></AuthProvider>);
        });

        await waitFor(() => {
            const playerSlots = screen.getAllByTestId(/player-slot-/);            
            expect(playerSlots[0]).toHaveTextContent(mockTeamPlayers[0].name);
            expect(playerSlots[1]).toHaveTextContent(mockTeamPlayers[1].name);
        })
    });

    test('All 11 player slots should be empty (display "Buy Player") when the team is empty', async () => {
        mockGetTeamPlayers.mockResolvedValueOnce([]);

        await act(async () => {
            render(<AuthProvider><FieldView /></AuthProvider>);
        });

        await waitFor(() => {
            expect(screen.getAllByText('Buy player')).toHaveLength(11)
        })
    });
})