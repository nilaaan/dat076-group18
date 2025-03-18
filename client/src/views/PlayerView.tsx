import { useEffect, useState } from 'react';
import { Player } from '../Types.ts';
import { getPlayers } from '../api/playerApi.ts';
import PlayerCardAdditional from '../components/PlayerCardAdditional.tsx';

const PlayerView = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>(undefined);

    useEffect(() => {
        getPlayers().then((data) => {
            setPlayers(data);
            //setLoading(false);
        }).catch(() => {
            //setLoading(false);
        });
    }, []);

    //Closes the popup window
    const closePopup = () => {
        setSelectedPlayer(undefined); 
    };

    return (
        <div className="flex justify-center pb-20 overflow-hidden">
            <div className="relative w-full">
                
                <div className="flex flex-row absolute w-full">
                
                </div>
                <div className="w-full flex flex-col gap-5 p-5">
                    {Array.from({ length: Math.ceil(players.length / 6) }, (_, rowIndex) => (
                        <div className="flex justify-evenly" key={rowIndex}>
                            {Array.from({ length: 6 }, (_, index) => {
                                const playerIndex = index + rowIndex * 6;
                                if (playerIndex < players.length) {
                                    return (
                                        <PlayerCardAdditional 
                                            key={players[playerIndex].id} // Unique key using player ID
                                            id={players[playerIndex].id} 
                                            onClose={closePopup} 
                                            fieldCase={false}
                                        />
                                    );
                                }
                                return null;
                            })}
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

export default PlayerView;
