import { render, fireEvent, waitFor, 
    act} from '@testing-library/react';
    import { screen } from '@testing-library/dom';
    import SellButton from './SellButton';
    import axios, { AxiosError } from 'axios';
    
    jest.mock('axios');
    const mockAxios = axios.post as jest.Mock;
    
    
    describe("SellButton", () => {
        test('Renders the sell button', () => {
            render(<SellButton playerId={1} />);
            const button = screen.getByRole('button', { name: "Sell" });
            expect(button).toBeInTheDocument();
        });
    
        test("requests server with sell action when button is clicked", async () => {
            render(<SellButton playerId={1}/>);
            const button = screen.getByRole('button', { name: "Sell" });
    
            await act(() => {
                fireEvent.click(button);
            });
           
            expect(mockAxios).toHaveBeenCalledWith("http://localhost:8080/team/1", { action: "sell" });
        });
    
        test("displays correct success text after button is clicked if the sell request was successfully made", async () => {
            mockAxios.mockResolvedValueOnce({});
    
            render(<SellButton playerId={1} />);
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
    
            render(<SellButton playerId={1}/>);
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
    
            render(<SellButton playerId={1} />);
            const button = screen.getByRole('button', { name: "Sell" });
    
            await act(() => {
                fireEvent.click(button);
            });
    
            await waitFor(() => {
                expect(screen.getByText("Player cannot be found")).toBeInTheDocument();
            });
        }); 
    }); 