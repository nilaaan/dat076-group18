import { useState } from 'react';
import { Player } from '../Types.ts';
import { User } from 'lucide-react';

interface PlayerCardProps {
    player: Player;
    onRemove: (player: Player) => void;
}

function PlayerCard({ player, onRemove }: PlayerCardProps) {
    const [isDragging, setIsDragging] = useState(false);

    function startDrag(e: React.DragEvent<HTMLDivElement>, player: Player) {
        setIsDragging(true);
        e.dataTransfer.setData("application/json", JSON.stringify(player));
    }

    function handleDragEnd() {
        setIsDragging(false);
        onRemove(player);
    }

    return (
        <div
            className={`card card-hover preset-filled-surface-100-900 border-4 border-surface-300-700 flex flex-col cursor-grab
                ${isDragging ? "opacity-25" : ""}`}
            draggable
            onDragStart={(e) => startDrag(e, player)}
            onDragEnd={handleDragEnd}
        >
            <header className="aspect-square">
                <User className="w-[50%] h-full m-auto opacity-50" />
            </header>
            <hr className="hr border-t-2 border-surface-300-700"></hr>
            <section className="bg-surface-200-800">
                <p className="text-center pt-2">{player.name}</p>
                <p className="text-center pb-2 text-success-500">£{player.price}</p>
            </section>
            <footer className="p-2 preset-filled-surface-200-800 flex justify-center flex-wrap gap-1">
                <span className="badge preset-filled-primary-100-900">{player.position}</span>
                <span className="badge preset-filled-secondary-100-900">#{player.number}</span>
                <span className="badge preset-filled-tertiary-100-900">{player.club}</span>
            </footer>
        </div>
    );
}

export default PlayerCard;
