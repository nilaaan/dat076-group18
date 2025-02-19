import FieldRow from '../components/FieldRow';

interface FieldProps {
    numDefenders: number;
    numMidfielders: number;
    numAttackers: number;
}

function Field({ numDefenders, numMidfielders, numAttackers }: FieldProps) {
    return (
        <>
            <FieldRow numPlayers={1}></FieldRow>
            <FieldRow numPlayers={numDefenders}></FieldRow>
            <FieldRow numPlayers={numMidfielders}></FieldRow>
            <FieldRow numPlayers={numAttackers}></FieldRow>
        </>
    )
}

export default Field;
