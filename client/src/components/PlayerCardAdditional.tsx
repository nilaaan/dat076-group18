interface PlayerCardPropsAdd {
    name: string;
    price: number;
    position: string;
    number: number;
    club: string;
    points: number;
}

function PlayerCardAdditional({ name, price, position, number, club, points }: PlayerCardPropsAdd) {
    return (
        <div>
            <h2>{name}</h2>
            <p>Price: {price}</p>
            <p>Position: {position}</p>
            <p>Number: {number}</p>
            <p>Club: {club}</p>
            <p>Points: {points}</p>

        </div>
    );
}

export default PlayerCardAdditional;
