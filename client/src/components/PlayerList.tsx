import { Player } from '../Types.ts';
import PlayerListItem from './PlayerListItem.tsx';

interface PlayerListProps {
    players: Player[];
}

function PlayerList({ players = [] }: PlayerListProps) {
    return (
        <div className="flex flex-col">
            {players.map((player) => (
                <PlayerListItem key={player.id} player={player}></PlayerListItem>
            ))}
        </div>
    )
}

export default PlayerList;