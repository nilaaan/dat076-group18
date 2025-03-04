import { useEffect, useState } from 'react';
import { Player } from '../Types.ts';
import { UserRound, X, Info, Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getPlayer } from '../api/playerApi.ts';


function PlayerCardAdditional({ id }: { id: string }) {

  

    // const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [player, setPlayer] = useState<Player | null>(null);

    useEffect(() => {
            if (!id) return; 
    
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

    

    function dragOver(e: React.DragEvent<HTMLDivElement>) {
        if (!player) {
            e.preventDefault();
        }
        console.log(player);
    }


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
            className="card card-hover preset-filled-surface-200-800 cursor-pointer w-[20%] sm:w-[15%] md:w-[10%] border-2 border-surface-400-600 flex flex-col opacity-75"
            onDragOver={dragOver}
        >
            {content}
        </div>
    );
}

export default PlayerCardAdditional;
