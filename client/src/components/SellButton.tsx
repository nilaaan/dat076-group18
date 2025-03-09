import { sellPlayer } from "../api/teamPlayersApi";
import { useAuth } from "../contexts/authContext";
import { Player } from "../Types";
import ActionButton from "./ActionButton";

function SellButton({playerId}: {playerId: number}) {
    const { updateBalance } = useAuth();

    const handleSellPlayer = async(playerId: number): Promise<Player | string> => {
        try {
            const player = await sellPlayer(playerId);
            await updateBalance();
            return player;
        } catch {
            return "Error selling player";
        }
    };

    return (
        <ActionButton playerId={playerId} 
        onAction={handleSellPlayer} 
        buttonText="Sell" 
        successText="Sold"
        completed={false}
        />
    );
}

export default SellButton;