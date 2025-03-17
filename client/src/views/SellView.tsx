import { useState, useEffect } from 'react';
import { Player } from '../Types.ts';
import { getTeamPlayers } from '../api/teamPlayersApi';
import PlayerCard from '../components/PlayerCard';
import SellButton from '../components/SellButton';
import { toast } from 'react-hot-toast';

const SellView = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const data = await getTeamPlayers();
                setPlayers(data);
            } catch (error) {
                toast.error('Failed to fetch players');
                setError('Failed to fetch players');
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, []);

    if (loading) return <h1>Loading...</h1>;
    if (error) return <h1>{error}</h1>;

    return (
        <div>
            <h1>Team</h1>
            {players.map((player) => (
                <div key={player.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <PlayerCard key={player.id} loading={loading} player={player}></PlayerCard>
                    <SellButton playerId={player.id} />
                </div>
            ))}
        </div>
    );
};

export default SellView;