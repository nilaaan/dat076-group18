import { useState, useEffect } from 'react';
import { Player } from '../Types.ts';
import { getTeamPlayers } from '../api/teamPlayersApi.ts';

/**
 * Data Flow:
 * Frontend sends GET request to /team/players
 * Back end responds with the list of players on the user's team
 * Frontend displays the list of players on the team
*/

const TeamView = () => {
    const [teamPlayers, setTeamPlayers] = useState<Player[] | null>(null);

    useEffect(() => {
        getTeamPlayers().then((data) => {
            console.log(data);
            setTeamPlayers(data);
        });
    }, []);

    if (!teamPlayers) {
        return <h1>Error loading team</h1>;
    }

    return (
        <div>
            <h1>Team</h1>
            {teamPlayers.map((player) => (
                <p key={player.id}>{player.name}</p>
            ))}
        </div>
    );
};

export default TeamView;

