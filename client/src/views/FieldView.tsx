import Field from '../components/Field.tsx';
import PlayerList from '../components/PlayerList.tsx';
import { Player } from '../Types.ts';

const FieldView = () => {
    let nextTestPlayerId = 0;
    function getTestPlayer(): Player {
        const testPlayer: Player = {
            id: nextTestPlayerId,
            name: `Name${nextTestPlayerId} Surname${nextTestPlayerId}`,
            position: "Position",
            number: nextTestPlayerId,
            club: "Club",
            price: 0,
            available: true,
            points: 0
        }
        nextTestPlayerId++;
        return testPlayer;
    }

    const numTestPlayers = 5;
    const testPlayers: Player[] = Array.from({ length: numTestPlayers }, getTestPlayer);

    return (
        <div className="flex flex-row w-full">
            <div className="flex-grow">
                <Field numDefenders={3} numMidfielders={4} numAttackers={3}></Field>
            </div>
            <div>
                <PlayerList players={testPlayers}></PlayerList>
            </div>
        </div>
    );
};

export default FieldView;
