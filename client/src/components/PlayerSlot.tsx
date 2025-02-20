import { useState } from 'react';
import { Player } from '../Types.ts';
import { User, X } from 'lucide-react';

interface PlayerSlotProps {
    initialPlayer?: Player;
    setPlayerAvailable: (id: number, available: boolean) => void;
}


/**
 * TODO:
 * hover: dropdown to show more info, shown by default (?) in playercards to the right
 * remove card after dropped in a player slot
 */
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

    return (
        <div
            className={`card preset-filled-surface-100-900 opacity-75 w-[20%] border-4 border-surface-300-700 flex flex-col
                ${player ? "cursor-grab card-hover" : "border-dashed cursor-not-allowed"}`}
            onDrop={drop}
            onDragOver={dragOver}
        >
            <header className="aspect-square relative">
                <User className="w-[50%] h-full m-auto opacity-50" />

                {player && (
                    <button type="button" className="btn absolute top-0 right-0 p-0 px-1 m-0 rounded-none rounded-bl-lg preset-filled-surface-300-700" onMouseDown={removePlayer}>
                        <X></X>
                    </button>
                )}
            </header>
            <hr className="hr border-t-2 border-surface-300-700"></hr>
            <footer>
                <p className="text-center py-2">{player ? player.name : <>&nbsp;</>}</p>
            </footer>
        </div>
    )
}

export default PlayerSlot;