import { Player } from '../Types.ts';

interface PlayerSlotProps {
    player?: Player;
}

function PlayerSlot({ player }: PlayerSlotProps) {
    return <p>{player ? player.name : "empty"}</p>
}

export default PlayerSlot;