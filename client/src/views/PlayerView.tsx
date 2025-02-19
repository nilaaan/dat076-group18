import { useState, useEffect } from 'react';
import { Player } from '../Types.ts';
import { getPlayer } from '../api/playerApi.ts';
import PlayerCardAdditional from '../components/PlayerCardAdditional.tsx';
import ChoiceBox from '../components/DemoChoiceBox.tsx';

/**
 * Data Flow:
 * Frontend sends GET request to /players
 * - Frontend displays id selection while loading.
 * Backend responds with the player with selected id.
 * - Error: frontend display error message
 * - Success: frontend displays the player with selected id.
*/

const PlayerView = () => {
    const [currPlayer, setPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currId, setId] = useState<string | null>(null);

    useEffect(() => {
        if (!currId) return; 

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

    }, [currId]); 

    if (loading) return (
        
        <ChoiceBox func={setId}/>
        
    );

    if (!currPlayer) return <h1>Error loading player</h1>;

    return (
        <div>
            <ChoiceBox func={setId}/>
            <h1>Player</h1>
            <PlayerCardAdditional key={currPlayer.id} name={currPlayer.name} price={currPlayer.price}
            position={currPlayer.position} number={currPlayer.number} club={currPlayer.club}
            points={currPlayer.points}
            ></PlayerCardAdditional>
        </div>
    );
};

export default PlayerView;
