import { Player } from '../Types.ts';

interface PlayerListItemProps {
    player?: Player;
}

function PlayerListItem({ player }: PlayerListItemProps) {
    return <p>{player ? player.name : "empty"}</p>
}

export default PlayerListItem;