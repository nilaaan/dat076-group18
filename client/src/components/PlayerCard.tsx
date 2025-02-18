interface PlayerCardProps {
    name: string;
    price: number;
}

function PlayerCard({ name, price }: PlayerCardProps) {
    return (
        <div>
            <h2>{name}</h2>
            <p>{price}</p>
        </div>
    );
}

export default PlayerCard;
