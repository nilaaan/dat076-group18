import { useEffect, useState } from 'react';
import { Player } from '../Types.ts';
import { Info, Plus } from 'lucide-react';
import { isGameSession, getCurrentRound } from '../api/gamesessionApi.ts';
import { getRating } from '../api/playerApi.ts';

interface PlayerSlotProps {
    initialPlayer?: Player;
    onInfoClick: () => void;
}

function PlayerSlot({ initialPlayer, onInfoClick }: PlayerSlotProps) {
    const [player, setPlayer] = useState<Player | undefined>();
    const [lastMatchRating, setLastMatchRating] = useState<number | null>(null);
    const [gameSessionActive, setGameSessionActive] = useState<boolean>(false);
    const [currentRound, setCurrentRound] = useState<number>(0);

    useEffect(() => {
        if (initialPlayer) {
            setPlayer(initialPlayer);
        }
    }, [initialPlayer]);

    useEffect(() => {
        const fetchGameSessionData = async () => {
            try {
                const gameSessionStatus = await isGameSession();
                if (typeof gameSessionStatus === 'string') {
                    console.error('Error checking game session:', gameSessionStatus);
                    return;
                }
                setGameSessionActive(gameSessionStatus);

                if (gameSessionStatus) {
                    const round = await getCurrentRound();
                    if (typeof round === 'string') {
                        console.error('Error fetching current round:', round);
                        return;
                    }
                    setCurrentRound(round);

                    if (round >= 2 && player) {
                        const rating = await getRating(player.id, round - 1);
                        if (typeof rating === 'string') {
                            console.error('Error fetching player rating:', rating);
                            return;
                        }
                        setLastMatchRating(rating);
                    }
                }
            } catch (error) {
                console.error('Error fetching game session data:', error);
            }
        };
        
        fetchGameSessionData();
    }, [player]);

    const content = (
        <>
            <header className="aspect-square relative">
                {player ?
                    (<>
                        <img src={player.image} className="w-full h-full"></img>
                        {/* <a href={`/player/${player.id}`}> */}
                            <button type="button" className="btn absolute rounded-none top-0 left-0 p-2 preset-filled-surface-400-600" onClick={onInfoClick}>
                                <Info />
                            </button>
                        {/* </a> */}
                        {gameSessionActive && currentRound >= 2 && player && (
                            <p className={`
                                absolute top-0 right-0 p-2 preset-filled-surface-400-600 font-bold
                                ${
                                    lastMatchRating === null ? "!text-white" :
                                    lastMatchRating <= 3 ? "!text-error-500" :
                                    lastMatchRating <= 6 ? "!text-warning-500" :
                                    lastMatchRating <= 8 ? "!text-success-500" :
                                    "!text-green-600"
                                }`}>
                                {lastMatchRating ? lastMatchRating.toFixed(1) : "N/A"}
                            </p>
                        )}
                    </>) :
                    (<Plus className="w-3/4 h-full m-auto" />)
                }
            </header>
            <hr className="hr border-t-2 border-surface-400-600"></hr>
            <footer className={`${player ? "preset-filled-surface-200-800" : ""}`}>
                <p className="text-center p-2 overflow-hidden text-ellipsis whitespace-nowrap">{player ? player.name : "Buy player"}</p>
            </footer>
        </>
    )

    return (
        <div
            className="card card-hover preset-filled-surface-200-800 cursor-pointer w-[20%] sm:w-[15%] md:w-[10%] border-2 border-surface-400-600 flex flex-col opacity-80"
        >
            { player ? (
                content
            ) : (
                <a href="/player">{content}</a>
            )}
        </div>
    );
}

export default PlayerSlot;