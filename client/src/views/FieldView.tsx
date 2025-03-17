import { useEffect, useState } from 'react';
import { Player } from '../Types.ts';
import PlayerSlot from '../components/PlayerSlot.tsx';
import { getTeamPlayers } from '../api/teamPlayersApi.ts';
import PlayerCardAdditional from '../components/PlayerCardAdditional.tsx';
import TeamPoints from '../components/TeamPoints.tsx';
import { getSession } from '../api/tempAuthAPI.ts';
import { useAuth } from '../contexts/authContext.ts';

const FieldView = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>(undefined);

    const numDefenders = 3;
    const numMidfielders = 4;
    const numAttackers = 3;

    useEffect(() => {
        getTeamPlayers().then((data) => {
            setPlayers(data);
            //setLoading(false);
        }).catch(() => {
            //setLoading(false);
        });
    }, []);


    const handlePlayerClick = (player: Player | undefined) => {
        setSelectedPlayer(player);
    };

    const closePopup = () => {
        setSelectedPlayer(undefined); 
    };
    


    /*useEffect(() => {
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
    }, []);*/

    function getPlayer(index: number): Player | undefined {
        return players[index] || undefined;
    }

    return (
        <div className="flex items-center pb-20 overflow-hidden flex-col">
            <div className="pb-5 p-10 flex items-end justify-around w-full">
                <h1 className="h1">{useAuth().username}'s team</h1>
                <h3 className="h3"><TeamPoints /> Points</h3>
            </div>
            <div className="relative w-full">
                <svg xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 1000" className="absolute">
                    <defs>
                        <pattern id="grassPattern" patternUnits="userSpaceOnUse" width="200" height="50">
                            <rect width="200" height="25" className="fill-green-700 stroke-none"/>
                            <rect y="25" width="200" height="25" className="fill-green-800 stroke-none"/>
                        </pattern>
                    </defs>
                    {/* Grass */}
                    <polygon points="0,1000 0,45 37,0 163,0 200,45 200,1000" fill="url(#grassPattern)"></polygon>
                </svg>
                <div className="flex flex-row absolute w-full">
                    <svg viewBox="0 0 40 50" className="stroke-1 stroke-white w-[20%] fill-none">
                        {/* Left sideline */}
                        <polygon points="-5,55 38,2 45,2 45,55"></polygon>
                    </svg>

                    <svg viewBox="0 0 120 50" className="stroke-1 stroke-white w-[60%] fill-none">
                        {/* Goal line */}
                        <polygon points="-5,55 -5,2 125,2 125,55"></polygon>

                        {/* Penalty arc */}
                        <ellipse cx="60" cy="15" rx="10" ry="7"></ellipse>
                        {/* Penalty area */}
                        <polygon points="30,15 35,2 85,2 90,15" fill="url(#grassPattern)"></polygon>
                        {/* Goal area */}
                        <polygon points="46,8 47,2 73,2 74,8"></polygon>
                    </svg>

                    <svg viewBox="0 0 40 50" className="stroke-1 stroke-white w-[20%] fill-none">
                        {/* Right sideline */}
                        <polygon points="45,55 2,2 -5,2 -5,55"></polygon>
                    </svg>
                </div>
                <div className="w-full flex flex-col gap-2 p-5">
                    <div className="flex justify-evenly">
                        <PlayerSlot initialPlayer={getPlayer(0)} onInfoClick={() => handlePlayerClick(getPlayer(0))}></PlayerSlot>
                    </div>
                    <div className="flex justify-evenly">
                        {Array.from({ length: numAttackers }, (_, index) => 
                            <PlayerSlot key={index} initialPlayer={getPlayer(1 + index)} onInfoClick={() => handlePlayerClick(getPlayer(1 + index))}></PlayerSlot>
                        )}
                    </div>
                    <div className="flex justify-evenly">
                        {Array.from({ length: numMidfielders }, (_, index) => 
                            <PlayerSlot key={index} initialPlayer={getPlayer(1 + numAttackers +  + index)} onInfoClick={() => handlePlayerClick(getPlayer(1 + numAttackers +  + index))} ></PlayerSlot>
                        )}
                    </div>
                    <div className="flex justify-evenly">
                        {Array.from({ length: numDefenders }, (_, index) => 
                            <PlayerSlot key={index} initialPlayer={getPlayer(1 + numAttackers + numMidfielders + index)} onInfoClick={() => handlePlayerClick(getPlayer(1 + numMidfielders +  + index))}></PlayerSlot>
                        )}
                    </div>
                </div>
            </div>
            {selectedPlayer && (
                <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 popup-enter">
                    <PlayerCardAdditional 
                        id={selectedPlayer.id} 
                        onClose={closePopup} 
                        fieldCase={true}
                    />
                </div>
            )}
        </div>
    );
};

export default FieldView;
