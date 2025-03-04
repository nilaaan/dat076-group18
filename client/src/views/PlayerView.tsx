import { useState, useEffect } from 'react';
import { Player } from '../Types.ts';
import { getPlayer } from '../api/playerApi.ts';
import PlayerCardAdditional from '../components/PlayerCardAdditional.tsx';
import ChoiceBox from '../components/DemoChoiceBox.tsx';
import { useParams } from 'react-router-dom';

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
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (!id) return; 

        setLoading(false);
        getPlayer(id)
            .then((data) => {
                setPlayer(data);
            })
            .catch(() => {
                setPlayer(null);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [id]); 

    if (!id) return <h1>Error loading player</h1>;

    return (
        <div>

            <div className="flex justify-center items-center">
            <PlayerCardAdditional id={id} />
            </div>

            
        </div>
    );
};

export default PlayerView;
