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

    const forwards = players.filter(player => player.position === "Forward");
    const midfielders = players.filter(player => player.position === "Midfielder");
    const defenders = players.filter(player => player.position === "Forward");
    const goalkeepers = players.filter(player => player.position === "Goalkeeper");

    return (
        <>
            <table className="table table-fixed h-60">
                <thead className="preset-filled-surface-300-700 sticky top-0 !text-white">
                    <tr>
                        <th className="preset-filled-tertiary-300-700 !font-bold">Forwards</th>
                        <th className="!font-bold">#</th>
                        <th className="!font-bold">Club</th>
                        <th className="!font-bold">Price</th>
                        <th className="!font-bold">Points</th>
                    </tr>
                </thead>
                <tbody>
                    {forwards.map((player) => (
                        <tr key={player.id} className="preset-filled-surface-100-900">
                            <td>{player.name}</td>
                            <td>{player.number}</td>
                            <td>{player.club}</td>
                            <td>{player.price}</td>
                            <td>{player.points}</td>
                        </tr>
                    ))}
                    <tr>
                        <th className="preset-filled-secondary-300-700 sticky top-0 !font-bold">Midfielders</th>
                        <td className="preset-filled-surface-200-800" colSpan={4}></td>
                    </tr>
                    {midfielders.map((player) => (
                        <tr key={player.id} className="preset-filled-surface-100-900">
                            <td>{player.name}</td>
                            <td>{player.number}</td>
                            <td>{player.club}</td>
                            <td>{player.price}</td>
                            <td>{player.points}</td>
                        </tr>
                    ))}
                    <tr>
                        <th className="preset-filled-primary-300-700 sticky top-0 !font-bold">Defenders</th>
                        <td className="preset-filled-surface-200-800" colSpan={4}></td>
                    </tr>
                    {defenders.map((player) => (
                        <tr key={player.id} className="preset-filled-surface-100-900">
                            <td>{player.name}</td>
                            <td>{player.number}</td>
                            <td>{player.club}</td>
                            <td>{player.price}</td>
                            <td>{player.points}</td>
                        </tr>
                    ))}
                    <tr className="bg-red-500">
                        <th className="preset-filled-success-300-700 sticky top-0 !font-bold">Goalkeepers</th>
                        <td className="preset-filled-surface-200-800" colSpan={4}></td>
                    </tr>
                    {goalkeepers.map((player) => (
                        <tr key={player.id} className="preset-filled-surface-100-900">
                            <td>{player.name}</td>
                            <td>{player.number}</td>
                            <td>{player.club}</td>
                            <td>{player.price}</td>
                            <td>{player.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


            

            <div>
                <h1>Players</h1>
                {players.map((player) => (
                    <div key={player.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <PlayerCard key={player.id} player={player}></PlayerCard>
                        <BuyButton playerId={player.id} completed={isPlayerBought(player.id)} />
                    </div>
                ))}
            </div>
        </>
    );
};

export default BuyView;