import { render, waitFor } from '@testing-library/react';
import PlayerView from './PlayerView';
import { getPlayers } from '../api/playerApi';
import { Player } from '../Types';

jest.mock('../api/playerApi', () => {
    getPlayers: jest.fn()
});
const mockGetPlayers = getPlayers as jest.Mock;

describe('PlayerView', () => {
    test('Displays all player names', async () => {
        const mockPlayers: Player[] = [
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

        mockGetPlayers.mockResolvedValueOnce(mockPlayers);

        const { getByText } = render(<PlayerView />);
    
        await waitFor(() => {          
            expect(getByText(mockPlayers[0].name)).toBeInTheDocument();
            expect(getByText(mockPlayers[1].name)).toBeInTheDocument();
        });
    });
})

