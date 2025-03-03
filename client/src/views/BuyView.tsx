import { useState, useEffect } from 'react';
import { Player } from '../Types.ts';
import { getPlayers } from '../api/playerApi';
import { getTeamPlayers } from '../api/teamPlayersApi';
import BuyButton from '../components/BuyButton';
import SellButton from '../components/SellButton.tsx';
import BalanceView from './BalanceView.tsx';

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
            } catch {
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

    const forwards = players.filter(player => player.position === "Attacker");
    const midfielders = players.filter(player => player.position === "Midfielder");
    const defenders = players.filter(player => player.position === "Defender");
    const goalkeepers = players.filter(player => player.position === "Goalkeeper");

    return (
        <div className="p-10 flex flex-col items-center">
            <BalanceView></BalanceView>
            <table className="table lg:w-3/4">
                <thead className="preset-filled-surface-300-700 sticky top-0 !text-white">
                    <tr>
                        <th className="preset-filled-tertiary-200-800 !font-bold !p-4">Forwards</th>
                        <th className="!font-bold">#</th>
                        <th className="!font-bold">Club</th>
                        <th className="!font-bold">Price</th>
                        <th className="!font-bold">Points</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {forwards.map((player) => (
                        <tr key={player.id} className="preset-filled-surface-100-900">
                            <td className="!p-4">{player.name}</td>
                            <td>{player.number}</td>
                            <td>{player.club}</td>
                            <td>£ {player.price}</td>
                            <td>{player.points}</td>
                            <td className="h-1">
                                {isPlayerBought(player.id) ? (
                                    <div className="w-full h-full preset-outlined-error-500 hover:preset-filled-error-300-700">
                                        <SellButton playerId={player.id}></SellButton>
                                    </div>
                                ): (
                                    <div className="w-full h-full preset-outlined-success-500 hover:preset-filled-success-300-700">
                                        <BuyButton playerId={player.id} completed={false}></BuyButton>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <th className="preset-filled-secondary-200-800 sticky top-0 !font-bold !p-4">Midfielders</th>
                        <td className="preset-filled-surface-200-800" colSpan={5}></td>
                    </tr>
                    {midfielders.map((player) => (
                        <tr key={player.id} className="preset-filled-surface-100-900">
                            <td className="!p-4">{player.name}</td>
                            <td>{player.number}</td>
                            <td>{player.club}</td>
                            <td>£ {player.price}</td>
                            <td>{player.points}</td>
                            <td className="h-1">
                                {isPlayerBought(player.id) ? (
                                    <div className="w-full h-full preset-outlined-error-500 hover:preset-filled-error-300-700">
                                        <SellButton playerId={player.id}></SellButton>
                                    </div>
                                ): (
                                    <div className="w-full h-full preset-outlined-success-500 hover:preset-filled-success-300-700">
                                        <BuyButton playerId={player.id} completed={false}></BuyButton>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <th className="preset-filled-primary-200-800 sticky top-0 !font-bold !p-4">Defenders</th>
                        <td className="preset-filled-surface-200-800" colSpan={5}></td>
                    </tr>
                    {defenders.map((player) => (
                        <tr key={player.id} className="preset-filled-surface-100-900">
                            <td className="!p-4">{player.name}</td>
                            <td>{player.number}</td>
                            <td>{player.club}</td>
                            <td>£ {player.price}</td>
                            <td>{player.points}</td>
                            <td className="h-1">
                                {isPlayerBought(player.id) ? (
                                    <div className="w-full h-full preset-outlined-error-500 hover:preset-filled-error-300-700">
                                        <SellButton playerId={player.id}></SellButton>
                                    </div>
                                ): (
                                    <div className="w-full h-full preset-outlined-success-500 hover:preset-filled-success-300-700">
                                        <BuyButton playerId={player.id} completed={false}></BuyButton>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    <tr className="bg-red-500">
                        <th className="preset-filled-success-200-800 sticky top-0 !font-bold !p-4">Goalkeepers</th>
                        <td className="preset-filled-surface-200-800" colSpan={5}></td>
                    </tr>
                    {goalkeepers.map((player) => (
                        <tr key={player.id} className="preset-filled-surface-100-900">
                            <td>{player.name}</td>
                            <td>{player.number}</td>
                            <td>{player.club}</td>
                            <td>£ {player.price}</td>
                            <td>{player.points}</td>
                            <td className="h-1">
                                {isPlayerBought(player.id) ? (
                                    <div className="w-full h-full preset-outlined-error-500 hover:preset-filled-error-300-700">
                                        <SellButton playerId={player.id}></SellButton>
                                    </div>
                                ): (
                                    <div className="w-full h-full preset-outlined-success-500 hover:preset-filled-success-300-700">
                                        <BuyButton playerId={player.id} completed={false}></BuyButton>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BuyView;