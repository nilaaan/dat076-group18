import Field from '../components/Field.tsx';
import PlayerGrid from '../components/PlayerGrid.tsx';
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

    const numTestPlayers = 10;
    const testPlayers: Player[] = Array.from({ length: numTestPlayers }, getTestPlayer);

    return (
        <div className="flex justify-center">
            <div className="flex flex-row xl:w-[75%] lg:w-full">
                <div className="basis-[50%]">
                    <Field numDefenders={3} numMidfielders={4} numAttackers={3}></Field>
                </div>
                <div className="basis-[50%]">
                    <PlayerGrid initialPlayers={testPlayers}></PlayerGrid>
                </div>
            </div>
        </div>
    );
};

export default FieldView;
