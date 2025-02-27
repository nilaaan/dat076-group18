import { Player } from '../Types.ts';
import PlayerCard from './PlayerCard.tsx';

interface PlayerGridProps {
    players: Player[];
}

function PlayerGrid({ players = [] }: PlayerGridProps) {
    return (
        <div
            className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 p-4 gap-2 overflow-y-scroll"
        >
            {players.filter((player) => player.available).map((player) => (
                
                <PlayerCard key={player.id} player={player}></PlayerCard>
            ))}
        </div>
    )
}

export default PlayerGrid;