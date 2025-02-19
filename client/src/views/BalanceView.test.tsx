import { render, waitFor } from '@testing-library/react';
import BalanceView from './BalanceView';


test('Displays loading before displaying Team Balance.', async () => {
    
    const { getByText, queryByText } = render(<BalanceView />);

    expect(getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {

        expect(getByText(/Team Balance/i)).toBeInTheDocument(); 
        expect(queryByText(/Loading.../i)).not.toBeInTheDocument();       
    });
});