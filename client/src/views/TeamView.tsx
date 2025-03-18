import { useState, useEffect } from 'react';
import { Player } from '../Types.ts';
import { getTeamPlayers } from '../api/teamPlayersApi.ts';
import PlayerCard from '../components/PlayerCard.tsx';
import toast from 'react-hot-toast';

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
        }).catch((error) => {
            console.error('Could not get team', error);
            toast.error('Could not get team')
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    return (
        <div className="flex flex-col items-center px-10">
            <h1 className="h1 p-5">
                {loading ? "Loading..." : (teamPlayers ? "Team" : "Error loading team")}
            </h1>
            <div className="flex flex-row gap-4 flex-wrap">
                {teamPlayers && teamPlayers.map((player) => (
                    <PlayerCard key={player.id} player={player}></PlayerCard>
                ))}
            </div>
        </div>
    );
};

export default TeamView;
