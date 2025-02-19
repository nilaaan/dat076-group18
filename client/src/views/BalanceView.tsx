import { useState, useEffect } from 'react';

import { getTeamBalance } from '../api/teamPlayersApi.ts';


/**
 * Data Flow:
 * Frontend sends GET request to /team/players
 * - Frontend displays loading message while
 * Backend responds with the list of players on the user's team
 * - Error: frontend display error message
 * - Success: frontend displays the list of players on the team
*/

const BalanceView = () => {
    const [teamBalance, setTeamBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        getTeamBalance().then((data: { number: number }) => {
            console.log('API data: ', data)
            setTeamBalance(data.number);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <h1>Loading...</h1>
    }
    if (!teamBalance){
        return <h1>Error displaying balance.</h1>
    }

    return (
        <>
            <h1>Team Balance</h1>
        
            <h2>Balance: {teamBalance}</h2>

        </>
    );
};

export default BalanceView;
