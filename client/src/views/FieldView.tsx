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
            <div className="relative w-full">
                <svg viewBox="0 0 200 100" className="stroke-1 stroke-white fill-none absolute">
                    <defs>
                        <pattern id="grassPattern" patternUnits="userSpaceOnUse" width="1" height="36">
                            <rect width="10" height="18" className="fill-green-700 stroke-none"/>
                            <rect y="18" width="10" height="18" className="fill-green-800 stroke-none"/>
                        </pattern>
                    </defs>

                    // Grass
                    <polygon points="0,100 40,0 160,0 200,100" fill="url(#grassPattern)" className="stroke-none"></polygon>
                    
                    // Sidelines, endline, halfway line
                    <polygon points="3,100 42,2 158,2 197,100"></polygon>

                    // Center circle
                    <ellipse cx="100" cy="110" rx="36" ry="28"></ellipse>

                    // Penalty arc
                    <ellipse cx="100" cy="17" rx="10" ry="7"></ellipse>

                    // Penalty area
                    <polygon points="70,18 74,2 126,2 130,18" fill="url(#grassPattern)"></polygon>
                    // Goal area
                    <polygon points="86,10 87,2 113,2 114,10"></polygon>
                </svg>
                <div className="w-full flex flex-col gap-2 top-0">
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
            </div>
                {/*}
                <div
                    className="basis-[50%] grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 p-4 gap-2"
                >
                    {players.filter((player) => player.available).map((player) => (
                        <PlayerCard key={player.id} player={player}></PlayerCard>
                    ))}
                </div>
                {*/}
        </div>
    );

    /*return (
        <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="stroke-1 stroke-white fill-none">
            <defs>
                <pattern id="grassPattern" patternUnits="userSpaceOnUse" width="1" height="36">
                    <rect width="10" height="18" className="fill-green-700 stroke-none"/>
                    <rect y="18" width="10" height="18" className="fill-green-800 stroke-none"/>
                </pattern>
            </defs>
            <polygon points="0,100 40,0 160,0 200,100" fill="url(#grassPattern)" className="stroke-none"></polygon>
            <polygon points="2,102 42,2 158,2 198,102"></polygon>
            <ellipse cx="100" cy="110" rx="36" ry="28"></ellipse>
            <ellipse cx="100" cy="17" rx="10" ry="8"></ellipse>
            <polygon points="70,18 74,2 126,2 130,18"  fill="url(#grassPattern)"></polygon>
            <polygon points="86,10 87,2 113,2 114,10"></polygon>
        </svg>
    );*/
};

export default FieldView;
