import { render, fireEvent, waitFor, 
act} from '@testing-library/react';
import { screen } from '@testing-library/dom';
import BuyButton from './BuyButton';
import axios, { AxiosError } from 'axios';
import { AuthProvider } from './AuthProvider';
import { getSession } from '../api/tempAuthAPI';


jest.mock('axios');
jest.mock('../api/tempAuthAPI', () => ({
    getSession: jest.fn()
}))
const mockAxios = axios.post as jest.Mock;
const mockGetSession = getSession as jest.Mock;

describe("BuyButton", () => {
    beforeEach(() => {
        mockGetSession.mockResolvedValue({
            loggedIn: true,
            user: { username: 'testUser' }
        });
    });

    test('Renders the buy button', async () => {
        await act(async () => {
            render(<AuthProvider><BuyButton playerId={1} completed={false} /></AuthProvider>);
        });
        const button = screen.getByRole('button', { name: "Buy" });
        expect(button).toBeInTheDocument();
    });

    test("requests server with buy action when button is clicked", async () => {
        await act(async () => {
            render(<AuthProvider><BuyButton playerId={1} completed={false} /></AuthProvider>);
        });
        
        const button = screen.getByRole('button', { name: "Buy" });

        await act(() => {
            fireEvent.click(button);
        });
       
        expect(mockAxios).toHaveBeenCalledWith("http://localhost:8080/team/1", { action: "buy" });
    });

    test("displays correct success text after button is clicked if the buy request was successfully made", async () => {
        mockAxios.mockResolvedValueOnce({});

        await act(async () => {
            render(<AuthProvider><BuyButton playerId={1} completed={false} /></AuthProvider>);
        });
        const button = screen.getByRole('button', { name: "Buy" });

        await act(() => {
            fireEvent.click(button);
        });

        await waitFor(() => {
            expect(screen.getByText("Bought")).toBeInTheDocument();
        });
    });

    test("displays error message if some unexcpected error occurred with the request", async () => {
        const consoleSpy = jest.spyOn(console, 'error');

        mockAxios.mockRejectedValueOnce(new AxiosError());

        await act(async () => {
            render(<AuthProvider><BuyButton playerId={1} completed={false} /></AuthProvider>);
        });
        const button = screen.getByRole('button', { name: "Buy" });

        await act(() => {
            fireEvent.click(button);
        });

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith("Could not complete action Error: An unexpected error occurred");
        });
    });

    test("displays specific error message if player cannot be bought because of the current model state", async () => {
        const consoleSpy = jest.spyOn(console, 'error');
        
        mockAxios.mockResolvedValueOnce({ data: "Player unavailable, too expensive, already bought, or not found" });

        await act(async () => {
            render(<AuthProvider><BuyButton playerId={1} completed={false} /></AuthProvider>);
        });
        const button = screen.getByRole('button', { name: "Buy" });

        await act(() => {
            fireEvent.click(button);
        });

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith("Could not complete action Error: Player unavailable, too expensive, already bought, or not found");
        });
    }); 
}); 
