import FieldRow from './FieldRow';

interface FieldProps {
    numDefenders: number;
    numMidfielders: number;
    numAttackers: number;
}

function Field({ numDefenders, numMidfielders, numAttackers }: FieldProps) {
    return (
        <div className="flex flex-col justify-around bg-green-800 gap-4 p-8">
            <FieldRow numPlayers={1}></FieldRow>
            <FieldRow numPlayers={numDefenders}></FieldRow>
            <FieldRow numPlayers={numMidfielders}></FieldRow>
            <FieldRow numPlayers={numAttackers}></FieldRow>
        </div>
    )
}

export default Field;
