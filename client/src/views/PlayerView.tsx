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
 * 
 * 
*/

interface PlayerViewProps {
    initialPlayer?: Player;
    setPlayerAvailable: (id: number, available: boolean) => void;
    onInfoClick: () => void;
}

const PlayerView = () => {
    const [currPlayer, setPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { paramId } = useParams<{ paramId: string }>();

    useEffect(() => {
        if (!paramId) return; 

        setLoading(false);
        getPlayer(Number(paramId))
            .then((data) => {
                setPlayer(data);
            })
            .catch(() => {
                setPlayer(null);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [paramId]); 

    if (!paramId) return <h1>Error loading player</h1>;

    return (
        <div>

            <div className="flex justify-center items-center">
 
            </div>

            
        </div>
    );
};

export default PlayerView;
