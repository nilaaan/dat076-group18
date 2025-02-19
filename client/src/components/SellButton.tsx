import { sellPlayer } from "../api/teamPlayersApi";
import ActionButton from "./ActionButton";

function SellButton({playerId}: {playerId: number}) {
    return (
        <ActionButton playerId={playerId} 
        onAction={sellPlayer} 
        buttonText="Sell" 
        successText="Sold"
        completed={false}
        />
    );
}

export default SellButton;