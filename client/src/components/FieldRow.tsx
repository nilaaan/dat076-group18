import PlayerSlot from './PlayerSlot';

interface FieldRowProps {
    numPlayers: number;
}

function FieldRow({ numPlayers }: FieldRowProps) {
    return (
        <div className="flex justify-evenly">
            {Array.from({ length: numPlayers }, (_, index) => 
                <PlayerSlot key={index}></PlayerSlot>
            )}
        </div>
    )
}

export default FieldRow;
