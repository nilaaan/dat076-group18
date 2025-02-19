import { Player } from '../Types.ts';

interface PlayerCardProps {
    player?: Player;
    loading: boolean;
}

function PlayerCard({ player, loading = false }: PlayerCardProps) {
    const name = player?.name ?? "?";
    const price = player?.price ? `£${player.price}` : "?";
    const position = player?.position ?? "?";
    const club = player?.club ?? "?";

    return (
        <a
            href={`./player${player ? `/${player.id}` : ""}`}
            className={`
                card preset-filled-surface-100-900 ${loading ? "placeholder animate-pulse" : ""}
                border-2 border-surface-300-700 ${player ? "" : "border-dashed"}
                card-hover block w-[200px] h-100 pb-4 p-2`}
        >
            <header className="flex flex-col items-center gap-2 pb-4">
                <div className={`card pb-[75%] border-2 border-surface-300-700 w-full ${player ? "" : "border-dashed"}`}></div>
                <h5 className="h5">{name}</h5>
                <p>{price}</p>
            </header>
            <hr className="hr" />
            <table className="table">
                <tbody>
                    <tr>
                        <th className="opacity-50">Position:</th>
                        <td>{position}</td>
                    </tr>
                    <tr>
                        <th className="opacity-50">Club:</th>
                        <td>{club}</td>
                    </tr>
                </tbody>
            </table>
        </a>
    );
}

export default PlayerCard;
