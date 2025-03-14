import { useEffect, useState } from 'react';
import { Player } from '../Types.ts';
import { UserRound, Plus, Minus } from 'lucide-react';
import { getPlayer } from '../api/playerApi.ts';
import { getTeamPlayers } from '../api/teamPlayersApi';
import SellButton from './SellButton.tsx';
import BuyButton from './BuyButton.tsx';

interface PlayerCardAdditionalProps {
    id: number;
    onClose: () => void;
    fieldCase: boolean;
}

function PlayerCardAdditional({ id, onClose, fieldCase }: PlayerCardAdditionalProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [player, setPlayer] = useState<Player | null>(null);
    const [teamPlayers, setTeamPlayers] = useState<Player[]>([]);
    //const [error, setError] = useState<string | null>(null);
    

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

    useEffect(() => {
            const fetchPlayers = async () => {
                try {

                    const teamPlayersData = await getTeamPlayers();
                    setTeamPlayers(teamPlayersData);
                } catch {
                    //setError('Failed to fetch players');
                } finally {
                    setLoading(false);
                }
            };
    
            fetchPlayers();
        }, []);

        const isPlayerBought = (playerId: number) => {
            return teamPlayers.some(player => player.id === playerId);
        };



    if (loading) return <h1>Loading player...</h1>;
    if (!player) return <div className="card  w-[30%] sm:w-[20%] md:w-[15%] flex flex-col opacity-100 p-4"></div>

    const content = (
        <>
            <header className="aspect-square relative">
                {player ? (
                    <>
                        {player.image !== "" ?
                        <img src={`${player.image}`} className="w-full h-full"></img>
                        : <UserRound className="w-3/4 h-full m-auto"></UserRound>
                        }
                        
                        
                        {fieldCase ? (
                        <button
                            type="button"
                            className="btn absolute rounded-none top-0 left-0 px-2 preset-filled-surface-400-600"
                            onClick={onClose}
                        >
                            <Minus />
                        </button>):(<></>)}
                    </>
                ) : (
                    <Plus className="w-3/4 h-full m-auto" />
                )}
            </header>
            <hr className="hr border-t-2 border-surface-400-600" />
            <footer className={`${player ? 'preset-filled-surface-200-800' : ''} p-3`}>
                <p className="text-center text-lg font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                    {player ? player.name : 'Buy player'}
                </p>
                <p>Position: {player.position}</p>
                <p>Number: {player.number}</p>
                <p>Club: {player.club}</p>
                <p>Price: ${player.price}</p>

                {/* Buy and Sell Buttons */}
                {isPlayerBought(player.id) ? (
                <div className="w-full h-[20%] mt-2 preset-outlined-error-500 hover:preset-filled-error-300-700">
                    <SellButton playerId={player.id}></SellButton>
                </div>
                    ) : (
                <div className="w-full h-[20%] mt-2 preset-outlined-success-500 hover:preset-filled-success-300-700">
                    <BuyButton playerId={player.id} completed={false}></BuyButton>
                </div>
                    )}



            </footer>
        </>
    );

    return (
        <div
            className="card preset-filled-surface-200-800 cursor-pointer w-[30%] sm:w-[20%] md:w-[15%] border-2 border-surface-400-600 flex flex-col opacity-100 p-4"
        >
            {content}
        </div>
    );
}

export default PlayerCardAdditional;
