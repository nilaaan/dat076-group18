import { useState, useEffect } from 'react';
import { Player } from '../Types.ts';
import { getPlayers } from '../api/playerApi';
import { getTeamPlayers } from '../api/teamPlayersApi';
import PlayerCard from '../components/PlayerCard';
import BuyButton from '../components/BuyButton';

const BuyView = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [teamPlayers, setTeamPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const playersdata = await getPlayers();
                setPlayers(playersdata);
                const teamPlayersData = await getTeamPlayers();
                setTeamPlayers(teamPlayersData);
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

    const isPlayerBought = (playerId: number) => {
        return teamPlayers.some(player => player.id === playerId);
    };

    return (
        <div>
            <h1>Players</h1>
            {players.map((player) => (
                <div key={player.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <PlayerCard key={player.id} loading={loading} player={player}></PlayerCard>
                    <BuyButton playerId={player.id} completed={isPlayerBought(player.id)} />
                </div>
            ))}
        </div>
    );
};

export default BuyView;