import { useEffect, useState } from 'react';
import { Player } from '../Types.ts';
import { getPlayers } from '../api/playerApi.ts';
import PlayerCardAdditional from '../components/PlayerCardAdditional.tsx';

const StartPageTest = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>(undefined);



    useEffect(() => {
        getPlayers().then((data) => {
            console.log("players:", players);
            setPlayers(data);
            //setLoading(false);
        }).catch(() => {
            //setLoading(false);
        });
    }, []);


    /*const handlePlayerClick = (player: Player | undefined) => {
        setSelectedPlayer(player);
    };*/

    const closePopup = () => {
        setSelectedPlayer(undefined); 
    };


    /*function getPlayer(index: number): Player | undefined {
        return players[index] || undefined;
    }

    function setPlayerAvailable(playerId: number, available: boolean) {
        setPlayers((ps: Player[]) =>
            ps.map((p) =>
                p.id === playerId ? { ...p, available } : p
            )
        );
    }*/

    return (
        <div className="flex justify-center pb-20 overflow-hidden">
            <div className="relative w-full">
                
                <div className="flex flex-row absolute w-full">
                
                </div>
                <div className="w-full flex flex-col gap-5 p-5">
                    {Array.from({ length: Math.ceil(players.length / 6) }, (_, rowIndex) => (
                        <div className="flex justify-evenly" key={rowIndex}>
                            {Array.from({ length: 6 }, (_, index) => (
                                <PlayerCardAdditional 
                                    key={rowIndex * 6 + index} // Unique key combining row index and column index
                                    id={players[index + rowIndex * 6].id} 
                                    // onInfoClick={() => handlePlayerClick(getPlayer(1 + index + rowIndex * 8))}
                                    onClose={closePopup} 
                                    fieldCase={false}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            {selectedPlayer && (
                <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 popup-enter">
                    <PlayerCardAdditional 
                        id={selectedPlayer.id} 
                        onClose={closePopup} 
                        fieldCase={false}
                    />
                </div>
            )}
        </div>
    );
};

export default StartPageTest;
