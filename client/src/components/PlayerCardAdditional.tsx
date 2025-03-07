interface PlayerCardPropsAdd {
    name: string;
    price: number;
    position: string;
    number: number;
    club: string;
}

function PlayerCardAdditional({ name, price, position, number, club }: PlayerCardPropsAdd) {
    return (
        <div>
            <h2>{name}</h2>
            <p>Price: {price}</p>
            <p>Position: {position}</p>
            <p>Number: {number}</p>
            <p>Club: {club}</p>
        </div>
    );
}

export default PlayerCardAdditional;
