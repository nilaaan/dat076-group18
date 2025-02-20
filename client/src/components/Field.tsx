import PlayerSlot from './PlayerSlot';

interface FieldProps {
    numDefenders: number;
    numMidfielders: number;
    numAttackers: number;
}

function Field({ numDefenders, numMidfielders, numAttackers }: FieldProps) {
    return (
        <div className="flex flex-col justify-around bg-green-800 gap-4 p-8">
            <div className="flex justify-evenly">
                <PlayerSlot></PlayerSlot>
            </div>
            <div className="flex justify-evenly">
                {Array.from({ length: numDefenders }, (_, index) => 
                    <PlayerSlot key={index}></PlayerSlot>
                )}
            </div>
            <div className="flex justify-evenly">
                {Array.from({ length: numMidfielders }, (_, index) => 
                    <PlayerSlot key={index}></PlayerSlot>
                )}
            </div>
            <div className="flex justify-evenly">
                {Array.from({ length: numAttackers }, (_, index) => 
                    <PlayerSlot key={index}></PlayerSlot>
                )}
            </div>
        </div>
    )
}

export default Field;
