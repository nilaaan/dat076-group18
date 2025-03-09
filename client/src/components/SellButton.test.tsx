import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import SellButton from './SellButton';
import axios, { AxiosError } from 'axios';
import { AuthProvider } from './AuthProvider';
import { getSession } from '../api/tempAuthAPI';
    
jest.mock('axios');
jest.mock('../api/tempAuthAPI', () => ({
    getSession: jest.fn()
}))
const mockAxios = axios.post as jest.Mock;
const mockGetSession = getSession as jest.Mock;

describe("SellButton", () => {
    beforeEach(() => {
        mockGetSession.mockResolvedValue({
            loggedIn: true,
            user: { username: 'testUser' }
        });
    });

    test('Renders the sell button', async () => {
        await act(async () => {
            render(<AuthProvider><SellButton playerId={1} /></AuthProvider>);
        });
        const button = screen.getByRole('button', { name: "Sell" });
        expect(button).toBeInTheDocument();
    });

    test("requests server with sell action when button is clicked", async () => {
        await act(async () => {
            render(<AuthProvider><SellButton playerId={1} /></AuthProvider>);
        });
        const button = screen.getByRole('button', { name: "Sell" });

        await act(() => {
            fireEvent.click(button);
        });
        
        expect(mockAxios).toHaveBeenCalledWith("http://localhost:8080/team/1", { action: "sell" });
    });

    test("displays correct success text after button is clicked if the sell request was successfully made", async () => {
        mockAxios.mockResolvedValueOnce({});

        await act(async () => {
            render(<AuthProvider><SellButton playerId={1} /></AuthProvider>);
        });
        const button = screen.getByRole('button', { name: "Sell" });

        await act(() => {
            fireEvent.click(button);
        });

        await waitFor(() => {
            expect(screen.getByText("Sold")).toBeInTheDocument();
        });
    });

    test("displays error message if some unexcpected error occurred with the request", async () => {
        mockAxios.mockRejectedValueOnce(new AxiosError());

        await act(async () => {
            render(<AuthProvider><SellButton playerId={1} /></AuthProvider>);
        });
        const button = screen.getByRole('button', { name: "Sell" });

        await act(() => {
            fireEvent.click(button);
        });

        await waitFor(() => {
            expect(screen.getByText("An unexpected error occurred")).toBeInTheDocument();
        });
    });

    test("displays specific error message if player cannot be sold because of the current model state", async () => {
        mockAxios.mockResolvedValueOnce({ data: "Player cannot be found" });

        await act(async () => {
            render(<AuthProvider><SellButton playerId={1} /></AuthProvider>);
        });
        const button = screen.getByRole('button', { name: "Sell" });

        await act(() => {
            fireEvent.click(button);
        });

        await waitFor(() => {
            expect(screen.getByText("Player cannot be found")).toBeInTheDocument();
        });
    }); 
}); 