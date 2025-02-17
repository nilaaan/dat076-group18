import { useState, useEffect } from 'react';
import { Player } from '../Types.ts';
import { getTeamPlayers } from '../api/teamPlayersApi.ts';
import PlayerCard from '../components/PlayerCard.tsx';

/**
 * Data Flow:
 * Frontend sends GET request to /team/players
 * - Frontend displays loading message while
 * Backend responds with the list of players on the user's team
 * - Error: frontend display error message
 * - Success: frontend displays the list of players on the team
*/

const TeamView = () => {
    const [teamPlayers, setTeamPlayers] = useState<Player[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        getTeamPlayers().then((data) => {
            setTeamPlayers(data);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <h1>Loading...</h1>
    }
    if (!teamPlayers) {
        return <h1>Error loading team</h1>
    }

    return (
        <>
            <h1>Team</h1>
            {teamPlayers && teamPlayers.map((player) => (
                <PlayerCard key={player.id} name={player.name} price={player.price}></PlayerCard>
            ))}
        </>
    );
};

export default TeamView;
