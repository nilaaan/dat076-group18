import { useState } from 'react';
import { Player } from '../Types';
import toast from 'react-hot-toast';
 
interface ActionButtonProps {
    playerId: number; 
    onAction: (playerId: number) => Promise<Player | string>;
    buttonText: string;
    successText: string;
    completed: boolean;
}

function ActionButton({playerId, onAction, buttonText, successText, completed}: ActionButtonProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        if (!completed) {
            try {
                const res = await onAction(playerId);
                if (typeof res === 'string') {
                    throw new Error(res);
                } else {
                    setSuccess(true);
                }
            } catch (error) {
                console.error(`Could not complete action ${error}`);
                toast.error(`${error}`);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <button onClick={handleClick} disabled={loading || success || completed} className="w-full h-full">
            {loading ? 'Loading...' : (success || completed) ? successText : buttonText}
        </button>
    );
}

export default ActionButton;