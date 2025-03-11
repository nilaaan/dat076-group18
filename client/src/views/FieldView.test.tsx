import { act, render, screen } from '@testing-library/react';
//import axios, { AxiosError } from 'axios';
import FieldView from './FieldView';
import { AuthProvider } from '../components/AuthProvider';
import { getSession } from '../api/tempAuthAPI';

//jest.mock('axios');
//const axiosMock = axios.get as jest.Mock;

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
    })
})