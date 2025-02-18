import { Player } from '../Types.ts';
import { Avatar } from '@skeletonlabs/skeleton-react';

interface PlayerCardProps {
    player?: Player;
    loading: boolean;
}

function PlayerCard({ player, loading = false }: PlayerCardProps) {
    return (
        <a
            href={`./player${player ? `/${player.id}` : ""}`}
            className={`
                card preset-filled-surface-100-900 ${loading && "placeholder animate-pulse"}
                border-[2px] border-surface-300-700 ${player || "border-dashed"}
                card-hover block w-[200px] h-100 py-4 px-2`}
        >
            <header className="flex flex-col items-center p-3 gap-2">
                <Avatar name={player ? player.name : "?"}></Avatar>
                <h5 className="h5">{player ? player.name : "..."}</h5>
                <p>{player ? ("£" + player.price) : "-"}</p>
            </header>
            <hr className="hr" />
            <table className="table">
                <tbody>
                    <tr>
                        <th className="opacity-50">Position:</th>
                        <td>{player && player.position}</td>
                    </tr>
                    <tr>
                        <th className="opacity-50">Club:</th>
                        <td>{player && player.club}</td>
                    </tr>
                </tbody>
            </table>
        </a>
    );
}

export default PlayerCard;
