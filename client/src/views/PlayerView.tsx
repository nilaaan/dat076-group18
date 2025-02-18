import { useState, useEffect } from 'react';
import { Player } from '../Types.ts';
import { getPlayer } from '../api/playerApi.ts';
import PlayerCard from '../components/PlayerCard.tsx';

/**
 * Data Flow:
 * Frontend sends GET request to /team/players
 * - Frontend displays loading message while
 * Backend responds with the list of players on the user's team
 * - Error: frontend display error message
 * - Success: frontend displays the list of players on the team
*/

const PlayerView = () => {
    const [currPlayer, setPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currId, setId] = useState<string | null>(null);

    useEffect(() => {
        if (!currId) return; // Prevents calling getPlayer with null

        setLoading(false);
        getPlayer(currId)
            .then((data) => {
                setPlayer(data);
            })
            .catch(() => {
                setPlayer(null);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [currId]); // Re-run when currId changes

    if (loading) return (
        <select onChange={(e) => setId(e.target.value)} defaultValue="">
            <option value="" disabled>Select a player</option>
            <option value="1">Player 1</option>
            <option value="2">Player 2</option>
            <option value="3">Player 3</option>
            <option value="4">Player 4</option>
        </select>
    );

    if (!currPlayer) return <h1>Error loading player</h1>;

    return (
        <div>
            <h1>Player</h1>
            <PlayerCard key={currPlayer.id} name={currPlayer.name} price={currPlayer.price}></PlayerCard>
        </div>
    );
};

export default PlayerView;
