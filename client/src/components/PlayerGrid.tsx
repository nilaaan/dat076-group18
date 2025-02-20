import { useState } from 'react';
import { Player } from '../Types.ts';
import PlayerCard from './PlayerCard.tsx';

interface PlayerGridProps {
    initialPlayers: Player[];
}

function PlayerGrid({ initialPlayers = [] }: PlayerGridProps) {
    const [players, setPlayers] = useState<Player[]>(initialPlayers);

    function removePlayer(player: Player) {
        setPlayers((ps: Player[]) => ps.filter(p => p.id !== player.id));
    }

    return (
        <div
            className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 p-4 gap-2 overflow-y-scroll"
        >
            
            {players.map((player) => (
                <PlayerCard key={player.id} player={player} onRemove={removePlayer}></PlayerCard>
            ))}
        </div>
    )
}

export default PlayerGrid;