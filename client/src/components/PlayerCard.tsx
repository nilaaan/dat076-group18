import { Player } from '../Types.ts';

interface PlayerCardProps {
    player: Player
}

function PlayerCard({ player }: PlayerCardProps) {
    return (
        <a
            href="./player"
            className="card preset-filled-surface-100-900 border-[1px] border-surface-200-800 card-hover divide-surface-200-800 block"
        >
            <header>
                <h2>{player.name}</h2>
            </header>
            <table className="table">
                <tr>
                    <th>Position</th>
                    <tr>{player.position}</tr>
                </tr>
                <tr>
                    <th>Club</th>
                    <tr>{player.club}</tr>
                </tr>
                <tr>
                    <th>Price:</th>
                    <tr>£{player.price}</tr>
                </tr>
            </table>
            <footer>

            </footer>
        </a>
    );
}

export default PlayerCard;
