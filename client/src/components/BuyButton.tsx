import { buyPlayer } from "../api/teamPlayersApi";
import ActionButton from "./ActionButton";

function BuyButton({playerId, completed}: {playerId: number, completed: boolean}) {
    return (
        <ActionButton playerId={playerId} 
        onAction={buyPlayer} 
        buttonText="Buy" 
        successText="Bought"
        completed={completed}
        />
    );
}

export default BuyButton;