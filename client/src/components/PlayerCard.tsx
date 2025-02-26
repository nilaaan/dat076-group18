import { useState } from 'react';
import { Player } from '../Types.ts';

interface PlayerCardProps {
    player: Player;
}

function PlayerCard({ player }: PlayerCardProps) {
    const [isDragging, setIsDragging] = useState(false);

    function startDrag(e: React.DragEvent<HTMLDivElement>, player: Player) {
        setIsDragging(true);
        e.dataTransfer.setData("application/json", JSON.stringify(player));
    }
    
    return (
        <div
            className={`card card-hover preset-filled-surface-100-900 border-4 border-surface-300-700 flex flex-col cursor-grab
                ${isDragging ? "opacity-25" : ""}`}
            draggable
            onDragStart={(e) => startDrag(e, player)}
            onDragEnd={() => setIsDragging(false)}
        >
            <header className="aspect-square">
            {/* Lucider User */}
            <svg xmlns="http://www.w3.org/2000/svg" width="50%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-1/2 m-auto h-full opacity-50">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>
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
