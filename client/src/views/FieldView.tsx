import { useEffect, useState } from 'react';
import { Player } from '../Types.ts';
import PlayerSlot from '../components/PlayerSlot.tsx';
import PlayerCard from '../components/PlayerCard.tsx';

const FieldView = () => {
    const [players, setPlayers] = useState<Player[]>([]);

    const numDefenders = 3;
    const numMidfielders = 4;
    const numAttackers = 3;

    useEffect(() => {
        const testPlayers: Player[] = [];
        for (let i = 0; i < 20; i++) {
            testPlayers.push({
                id: i,
                name: `Name${i} Surname${i}`,
                position: "Position",
                number: i,
                club: "Club",
                price: 0,
                available: true,
                points: 0
            });
        }
        setPlayers(testPlayers);
    }, []);

    function setPlayerAvailable(playerId: number, available: boolean) {
        setPlayers((ps: Player[]) =>
            ps.map((p) =>
                p.id === playerId ? { ...p, available } : p
            )
        );
    }

    return (
        <div className="flex justify-center">
            <div className="flex flex-row xl:w-[75%] lg:w-full h-full">
                <div className="basis-[50%] flex flex-col justify-around bg-green-800 gap-4 p-8 h-full">
                    <div className="flex justify-evenly">
                        <PlayerSlot setPlayerAvailable={setPlayerAvailable}></PlayerSlot>
                    </div>
                    <div className="flex justify-evenly">
                        {Array.from({ length: numAttackers }, (_, index) => 
                            <PlayerSlot key={index} setPlayerAvailable={setPlayerAvailable}></PlayerSlot>
                        )}
                    </div>
                    <div className="flex justify-evenly">
                        {Array.from({ length: numMidfielders }, (_, index) => 
                            <PlayerSlot key={index} setPlayerAvailable={setPlayerAvailable}></PlayerSlot>
                        )}
                    </div>
                    <div className="flex justify-evenly">
                        {Array.from({ length: numDefenders }, (_, index) => 
                            <PlayerSlot key={index} setPlayerAvailable={setPlayerAvailable}></PlayerSlot>
                        )}
                    </div>
                </div>
                <div
                    className="basis-[50%] grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 p-4 gap-2"
                >
                    {players.filter((player) => player.available).map((player) => (
                        <PlayerCard key={player.id} player={player}></PlayerCard>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FieldView;
