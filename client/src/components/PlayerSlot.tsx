import { useState } from 'react';
import { Player } from '../Types.ts';
import { User } from 'lucide-react';

interface PlayerSlotProps {
    currentPlayer?: Player;
}


/**
 * TODO:
 * hover: dropdown to show more info, shown by default (?) in playercards to the right
 * remove card after dropped in a player slot
 */
function PlayerSlot({ currentPlayer }: PlayerSlotProps) {
    const [player, setPlayer] = useState<Player | undefined>(currentPlayer);

    function drop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        const playerData = e.dataTransfer.getData("application/json");
        if (playerData) {
            const droppedPlayer: Player = JSON.parse(playerData);
            setPlayer(droppedPlayer);
        }
    }

    function dragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    return (
        <div 
            className={`card preset-filled-surface-100-900 opacity-75 w-[20%] border-4 border-surface-300-700 flex flex-col p-2
                ${player ? "cursor-grab card-hover" : "border-dashed cursor-not-allowed"}`}
            onDrop={drop}
            onDragOver={dragOver}
        >
            <header className="aspect-square">
                <User className="w-[50%] h-full m-auto opacity-50" />
            </header>
            <hr className="hr border-t-2 border-surface-300-700"></hr>
            <footer>
                <p className="text-center py-2">{player ? player.name : <>&nbsp;</>}</p>
            </footer>
        </div>
    )
}

export default PlayerSlot;