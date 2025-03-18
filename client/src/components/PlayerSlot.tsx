import { useEffect, useState } from 'react';
import { Player } from '../Types.ts';
import { Info, Plus } from 'lucide-react';
import { isGameSession, getCurrentRound } from '../api/gamesessionApi.ts';
import { getRating } from '../api/playerApi.ts';

interface PlayerSlotProps {
    initialPlayer?: Player;
    onInfoClick: () => void;
    'data-testid'?: string;
}

function PlayerSlot({ initialPlayer, onInfoClick, 'data-testid': dataTestId }: PlayerSlotProps) {
    // State for the player data
    const [player, setPlayer] = useState<Player | undefined>();
    // State for player's last match rating
    const [lastMatchRating, setLastMatchRating] = useState<number | null>(null);
    // State to track if game session is active
    const [gameSessionActive, setGameSessionActive] = useState<boolean>(false);
    // State for the current round number
    const [currentRound, setCurrentRound] = useState<number>(0);

    // Update the player state when player changes
    useEffect(() => {
        if (initialPlayer) {
            setPlayer(initialPlayer);
        }
    }, [initialPlayer]);

    // Fetch game session and player rating data when the player changes
    useEffect(() => {
        const fetchGameSessionData = async () => {
            try {
                // Check if game is active
                const gameSessionStatus = await isGameSession();
                if (typeof gameSessionStatus === 'string') {
                    console.error('Error checking game session:', gameSessionStatus);
                    return;
                }
                setGameSessionActive(gameSessionStatus);

                // If game session is active, get data for the current round
                if (gameSessionStatus) {
                    const round = await getCurrentRound();
                    if (typeof round === 'string') {
                        console.error('Error fetching current round:', round);
                        return;
                    }
                    setCurrentRound(round);

                    // If player is set and there is a previous round, fetch the player's rating in the previous round
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

    // Content to render inside this slot if the player is set
    const content = (
        <>
            <header className="aspect-square relative">
                {/*Render player details if player data is set*/}
                {player ?
                    (
                        <>
                            <img src={player.image} className="w-full h-full"></img>
                            <button type="button" className="btn absolute rounded-none top-0 left-0 p-2 preset-filled-surface-400-600" onClick={onInfoClick}>
                                <Info />
                            </button>
                            {/*Display the player's rating in the last round if there is one*/}
                            {gameSessionActive && currentRound >= 2 && player && (
                                <p className={`
                                    absolute top-0 right-0 p-2 preset-filled-surface-400-600 font-bold
                                    ${
                                        lastMatchRating === null ? "!text-white" : // White for N/A
                                        lastMatchRating <= 3 ? "!text-error-500" : // Red for bad rating
                                        lastMatchRating <= 6 ? "!text-warning-500" : // Yellow for ok rating
                                        lastMatchRating <= 8 ? "!text-success-500" : // Light green for good rating
                                        "!text-green-600" // Dark green for great rating
                                    }`}>
                                    {/*Display rating or N/A if not available*/}
                                    {lastMatchRating ? lastMatchRating.toFixed(1) : "N/A"}
                                </p>
                            )}
                        </>
                    ) : (
                        // Display a plus to indicate the user can add a player to this empty slot
                        <Plus className="w-3/4 h-full m-auto" />
                    )
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
            data-testid={dataTestId}
        >
            {player ? 
            (
                content
            ) : (
                // If no player data is available, render the playerslot with a link around it to buy view
                <a href="/player">{content}</a>
            )}
        </div>
    );
}

export default PlayerSlot;