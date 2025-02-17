interface Player {
    id: number;
    name: string;
    position: string;
    number: number;
    club: string;
    price: number;
    available: boolean;
    points: number;
}

/**
 * Data Flow:
 * Frontend sends GET request to /team/players
 * Back end responds with the list of players on the user's team
 * Frontend displays the list of players on the team
*/

const TeamView = () => {
    const team: Player[] = [
        {
            name: "test1"
        },
        {
            name: "test2"
        },
        {
            name: "test3"
        },
    ];

    return (
        <div>
            <h1>Team</h1>
            {team.map((player) => (
                <p>{player.name}</p>
            ))}
        </div>
    );
};

export default TeamView;

