import { useState } from 'react';
import { Player } from '../Types.ts';
import { User } from 'lucide-react';

interface PlayerCardProps {
    player: Player;
    loading: boolean;
}

function PlayerCard({ player }: PlayerCardProps) {
    const [isDragging, setIsDragging] = useState(false);

    const name = player?.name ?? "?";
    const price = player?.price ? `£${player.price}` : "?";
    const position = player?.position ?? "?";
    const club = player?.club ?? "?";

    function startDrag(e: React.DragEvent<HTMLDivElement>, player: Player) {
        setIsDragging(true);
        e.dataTransfer.setData("application/json", JSON.stringify(player));
    }

    return (
        <div
            className={`card card-hover preset-filled-surface-100-900 border-4 border-surface-300-700 flex flex-col p-2 cursor-grab
                ${isDragging ? "opacity-25" : ""}`}
            draggable
            onDragStart={(e) => startDrag(e, player)}
            onDragEnd={() => setIsDragging(false)}
        >
            <header className="aspect-square">
                <User className="w-[50%] h-full m-auto opacity-50" />
            </header>
            <hr className="hr border-t-2 border-surface-300-700"></hr>
            <footer>
                <p className="text-center py-2">{player ? player.name : <>&nbsp;</>}</p>
            </footer>
        </div>
    );
}

export default PlayerCard;
