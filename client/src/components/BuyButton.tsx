import { buyPlayer } from "../api/teamPlayersApi";
import { useAuth } from "../contexts/authContext";
import { Player } from "../Types";
import ActionButton from "./ActionButton";

function BuyButton({playerId, completed}: {playerId: number, completed: boolean}) {
    const { updateBalance } = useAuth();

    const handleBuyPlayer = async(playerId: number): Promise<Player | string> => {
        try {
            const player = await buyPlayer(playerId);
            await updateBalance();
            return player;
        } catch {
            return "Error buying player";
        }
    };

    return (
        <ActionButton playerId={playerId} 
        onAction={handleBuyPlayer} 
        buttonText="Buy" 
        successText="Bought"
        completed={completed}
        />
    );
}

export default BuyButton;