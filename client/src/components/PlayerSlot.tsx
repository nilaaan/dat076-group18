import { Player } from '../Types.ts';
import { User } from 'lucide-react';

interface PlayerSlotProps {
    player?: Player;
}


/**
 * hover: dropdown to show more info, shown by default (?) in playercards to the right
 */
function PlayerSlot({ player }: PlayerSlotProps) {
    return (
        <div className={`card preset-filled-surface-100-900 opacity-75 w-[20%] border-4 border-dashed border-surface-300-700 flex flex-col p-2
            ${player ? "cursor-grab card-hover" : "cursor-not-allowed"}`}>
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