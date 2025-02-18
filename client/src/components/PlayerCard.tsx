interface PlayerCardProps {
    name: string;
    price: number;
}

function PlayerCard({ name, price }: PlayerCardProps) {
    return (
        <div>
            <h2>Name: {name}</h2>
            <p>Price: {price}</p>
        </div>
    );
}

export default PlayerCard;
