import { useEffect, useState } from 'react';
import { Player } from '../Types.ts';
import { UserRound, X, Info, Plus, Minus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getPlayer } from '../api/playerApi.ts';


interface PlayerCardAdditionalProps {
    id: string;
    onClose: () => void;
}


function PlayerCardAdditional({ id, onClose }: PlayerCardAdditionalProps) {

  

    // const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [player, setPlayer] = useState<Player | null>(null);

    useEffect(() => {
            if (!id) return; 
            console.log(id);
    
            setLoading(false);
            getPlayer(id)
                .then((data) => {
                    setPlayer(data);
                })
                .catch(() => {
                    setPlayer(null);
                })
                .finally(() => {
                    setLoading(false);
                });
    
        }, [id]); 

    

    


    if (loading) return (
        
        <h1>Loading player...</h1>
        
    );

    if (!player) return <h1>Error loading player</h1>;

    const content = (
        <>
            <header className="aspect-square relative">
                {player ? (
                    <>
                        <UserRound className="w-3/4 h-full m-auto" />
                        <button type="button" className="btn absolute rounded-none top-0 left-0 px-2 preset-filled-surface-400-600" onClick={onClose}>
                                <Minus />
                            </button>
                        
                    </>
                ) : (
                    <Plus className="w-3/4 h-full m-auto" />
                )}
            </header>
            <hr className="hr border-t-2 border-surface-400-600"></hr>
            <footer className={`${player ? "preset-filled-surface-200-800" : ""}`}>
                <p className="text-center p-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    {player ? player.name : "Buy player"}
                </p>
                <p className=''>Position: {player.position}</p>
                <p>Number: {player.number}</p>
                <p>Club: {player.club}</p>
                <p>Price: ${player.price}</p>
                <p>Points: {player.points}</p>
                <p>Status: {player.available ? "Available" : "Not Available"}</p>
                    
                
            </footer>
        </>
    );


    return (
        <div
            className="card preset-filled-surface-200-800 cursor-pointer w-[20%] sm:w-[15%] md:w-[10%] border-2 border-surface-400-600 flex flex-col opacity-100"

        >
            {content}
        </div>
    );
}

export default PlayerCardAdditional;
