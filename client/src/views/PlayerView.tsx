import { useEffect, useState } from 'react';
import { Player } from '../Types.ts';
import { getPlayers } from '../api/playerApi.ts';
import PlayerCardAdditional from '../components/PlayerCardAdditional.tsx';
import SellButton from '../components/SellButton.tsx';
import BuyButton from '../components/BuyButton.tsx';
import { Tabs } from '@skeletonlabs/skeleton-react';
import { LayoutGrid, Rows2 } from 'lucide-react';
import { getTeamPlayers } from '../api/teamPlayersApi.ts';
import { useAuth } from '../contexts/authContext.ts';

const PlayerView = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>(undefined);
    const [group, setGroup] = useState('grid');
    const [teamPlayers, setTeamPlayers] = useState<Player[]>([]);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const playersData = await getPlayers();
                setPlayers(playersData);
                if (isAuthenticated) {
                    const teamPlayersData = await getTeamPlayers();
                    setTeamPlayers(teamPlayersData);
                }
            } catch {
                //setError('Failed to fetch players');
            } finally {
                //setLoading(false);
            }
        };

        fetchPlayers();
    }, [isAuthenticated]);

    /*const handlePlayerClick = (player: Player | undefined) => {
        setSelectedPlayer(player);
    };*/

    //Closes the popup window
    const closePopup = () => {
        setSelectedPlayer(undefined); 
    };


    /*function getPlayer(index: number): Player | undefined {
        return players[index] || undefined;
    }

    function setPlayerAvailable(playerId: number, available: boolean) {
        setPlayers((ps: Player[]) =>
            ps.map((p) =>
                p.id === playerId ? { ...p, available } : p
            )
        );
    }*/

    const grid = (
        <div className="flex justify-center pb-20 overflow-hidden">
            <div className="relative w-full">
                
                <div className="flex flex-row absolute w-full">
                
                </div>
                <div className="w-full flex flex-col gap-5 p-5">
                    {Array.from({ length: Math.ceil(players.length / 6) }, (_, rowIndex) => (
                        <div className="flex justify-evenly" key={rowIndex}>
                            {Array.from({ length: 6 }, (_, index) => {
                                const playerIndex = index + rowIndex * 6;
                                if (playerIndex < players.length) {
                                    return (
                                        <PlayerCardAdditional 
                                            key={players[playerIndex].id} // Unique key using player ID
                                            id={players[playerIndex].id} 
                                            onClose={closePopup} 
                                            fieldCase={false}
                                        />
                                    );
                                }
                                return null;
                            })}
                        </div>
                    ))}
                </div>
            </div>
            {selectedPlayer && (
                <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 popup-enter">
                    <PlayerCardAdditional 
                        id={selectedPlayer.id} 
                        onClose={closePopup} 
                        fieldCase={false}
                    />
                </div>
            )}
        </div>
    );

    const forwards = players.filter(player => player.position === "attacker");
    const midfielders = players.filter(player => player.position === "midfielder");
    const defenders = players.filter(player => player.position === "defender");
    const goalkeepers = players.filter(player => player.position === "goalkeeper");

    const isPlayerBought = (playerId: number) => {
        if (!isAuthenticated) {
            return false;
        }
        return teamPlayers.some(player => player.id === playerId);
    };

    const list = (
        <div className="flex flex-col items-center pb-80">
            <table className="table lg:w-3/4">
                <thead className="preset-filled-surface-300-700 sticky top-0 !text-white">
                    <tr>
                        <th className="preset-filled-tertiary-200-800 !font-bold !p-4">Attackers</th>
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
                                ) : (
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
                                ) : (
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
                                ) : (
                                    <div className="w-full h-full preset-outlined-success-500 hover:preset-filled-success-300-700">
                                        <BuyButton playerId={player.id} completed={false}></BuyButton>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <th className="preset-filled-success-200-800 sticky top-0 !font-bold !p-4">Goalkeepers</th>
                        <td className="preset-filled-surface-200-800" colSpan={5}></td>
                    </tr>
                    {goalkeepers.map((player) => (
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
                                ) : (
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

    return (
        <Tabs value={group} onValueChange={(e) => setGroup(e)}>
            <Tabs.List justify="justify-center">
                <Tabs.Control value="grid"><LayoutGrid /></Tabs.Control>
                <Tabs.Control value="list"><Rows2 /></Tabs.Control>
            </Tabs.List>
            <Tabs.Content>
                <Tabs.Panel value="grid">{grid}</Tabs.Panel>
                <Tabs.Panel value="list">{list}</Tabs.Panel>
            </Tabs.Content>
        </Tabs>
    )
};

export default PlayerView;
