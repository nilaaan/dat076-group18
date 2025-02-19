import { useState, useEffect } from 'react';
import { Player } from '../Types.ts';
import { getPlayers } from '../api/playerApi';
import PlayerCard from '../components/PlayerCard';
import BuyButton from '../components/BuyButton';

const BuyView = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const data = await getPlayers();
                setPlayers(data);
            } catch (error) {
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
            <h1>Players</h1>
            {players.map((player) => (
                <div key={player.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <PlayerCard key={player.id} loading={loading} player={player}></PlayerCard>
                    <BuyButton playerId={player.id} />
                </div>
            ))}
        </div>
    );
};

export default BuyView;