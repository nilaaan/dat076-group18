import { useState } from 'react';
import { Player } from '../Types.ts';
import { UserRound, X, Info, Plus } from 'lucide-react';

interface PlayerSlotProps {
    initialPlayer?: Player;
    setPlayerAvailable: (id: number, available: boolean) => void;
}

function PlayerSlot({ initialPlayer, setPlayerAvailable }: PlayerSlotProps) {
    const [player, setPlayer] = useState<Player | undefined>(initialPlayer);

    function drop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();

        if (player) {
            return;
        }

        const playerData = e.dataTransfer.getData("application/json");
        if (playerData) {
            const droppedPlayer: Player = JSON.parse(playerData);
            setPlayer(droppedPlayer);
            setPlayerAvailable(droppedPlayer.id, false);
        }
    }

    function dragOver(e: React.DragEvent<HTMLDivElement>) {
        if (!player) {
            e.preventDefault();
        }
    }

    function removePlayer() {
        if (player) {
            console.log("removed");
            setPlayerAvailable(player.id, true);
            setPlayer(undefined);
        }
    }

    const content = (
        <>
            <header className="aspect-square relative">
                {player ? 
                    (<>
                        <UserRound className="w-3/4 h-full m-auto" />
                        <a href="/player">
                            <button type="button" className="btn absolute rounded-none top-0 left-0 px-2 preset-filled-surface-300-700" onMouseDown={removePlayer}>
                                <Info />
                            </button>
                        </a>
                        <a href="/sell">
                            <button type="button" className="btn absolute rounded-none top-0 right-0 px-2 preset-filled-surface-300-700" onMouseDown={removePlayer}>
                                <X />
                            </button>
                        </a>
                    </>) :
                    (<Plus className="w-3/4 h-full m-auto" />)
                }
            </header>
            <hr className="hr border-t-2 border-surface-300-700"></hr>
            <footer className={`${player ? "preset-filled-surface-200-800" : ""}`}>
                <p className="text-center p-2 overflow-hidden text-ellipsis whitespace-nowrap">{player ? player.name : "Buy player"}</p>
            </footer>
        </>
    )

    return (
        <div
            className="card card-hover preset-filled-surface-200-800 cursor-pointer w-[20%] sm:w-[15%] md:w-[10%] border-2 border-surface-300-700 flex flex-col opacity-75"
            onDrop={drop}
            onDragOver={dragOver}
        >
            { player ? (
                content
            ) : (
                <a href="/buy">{content}</a>
            )}
        </div>
    );
}

export default PlayerSlot;