import { buyPlayer } from "../api/teamPlayersApi";
import ActionButton from "./ActionButton";

function BuyButton({playerId}: {playerId: number}) {
    return (
        <ActionButton playerId={playerId} 
        onAction={buyPlayer} 
        buttonText="Buy" 
        successText="Bought"
        />
    );
}

export default BuyButton;