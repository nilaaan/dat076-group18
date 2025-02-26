import { render, fireEvent, waitFor, 
act} from '@testing-library/react';
import { screen } from '@testing-library/dom';
import BuyButton from './BuyButton';
import axios, { AxiosError } from 'axios';

jest.mock('axios');
const mockAxios = axios.post as jest.Mock;


describe("BuyButton", () => {
    test('Renders the buy button', () => {
        render(<BuyButton playerId={1} completed={false} />);
        const button = screen.getByRole('button', { name: "Buy" });
        expect(button).toBeInTheDocument();
    });

    test("requests server with buy action when button is clicked", async () => {
        render(<BuyButton playerId={1} completed={false} />);
        const button = screen.getByRole('button', { name: "Buy" });

        await act(() => {
            fireEvent.click(button);
        });
       
        expect(mockAxios).toHaveBeenCalledWith("http://localhost:8080/team/1", { action: "buy" });
    });

    test("displays correct success text after button is clicked if the buy request was successfully made", async () => {
        mockAxios.mockResolvedValueOnce({});

        render(<BuyButton playerId={1} completed={false} />);
        const button = screen.getByRole('button', { name: "Buy" });

        await act(() => {
            fireEvent.click(button);
        });

        await waitFor(() => {
            expect(screen.getByText("Bought")).toBeInTheDocument();
        });
    });

    test("displays error message if some unexcpected error occurred with the request", async () => {
        mockAxios.mockRejectedValueOnce(new AxiosError());

        render(<BuyButton playerId={1} completed={false} />);
        const button = screen.getByRole('button', { name: "Buy" });

        await act(() => {
            fireEvent.click(button);
        });

        await waitFor(() => {
            expect(screen.getByText("An unexpected error occurred")).toBeInTheDocument();
        });
    });

    test("displays specific error message if player cannot be bought because of the current model state", async () => {
        mockAxios.mockResolvedValueOnce({ data: "Player unavailable, too expensive, already bought, or not found" });

        render(<BuyButton playerId={1} completed={false} />);
        const button = screen.getByRole('button', { name: "Buy" });

        await act(() => {
            fireEvent.click(button);
        });

        await waitFor(() => {
            expect(screen.getByText("Player unavailable, too expensive, already bought, or not found")).toBeInTheDocument();
        });
    }); 
}); 
