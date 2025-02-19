import { Player } from '../Types.ts';
import { Plus } from 'lucide-react';

interface PlayerSlotProps {
    player?: Player;
}

function PlayerSlot({ player }: PlayerSlotProps) {

    return (
        <div className="card card-hover preset-filled-surface-100-900 opacity-75 w-[20%] border-4 border-dashed border-surface-300-700 flex flex-col p-2">
            <header className="aspect-square">
                <Plus className="w-[50%] h-full m-auto opacity-50"></Plus>
            </header>
            <hr className="hr border-t-2 border-surface-300-700"></hr>
            <footer>
                <p className="text-center py-2">Test{player ? player.name : <>&nbsp;</>}</p>
            </footer>
        </div>
    )
}

export default PlayerSlot;