import { useState } from 'react';
import { Player } from '../Types';
 
interface ActionButtonProps {
    playerId: number; 
    onAction: (playerId: number) => Promise<Player | string>;
    buttonText: string;
    successText: string;
    completed: boolean;
}

function ActionButton({playerId, onAction, buttonText, successText, completed}: ActionButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        setError(null);
        if (!completed) {
            try {
                const res = await onAction(playerId);
                if (typeof res === 'string') {
                    setError(res);
                } else {
                    setSuccess(true);
                }
            } catch {
                setError('An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <button onClick={handleClick} disabled={loading || success || completed} className="w-full h-full">
            {loading ? 'Loading...' : (success || completed) ? successText : buttonText}
            {error && <p>{error}</p>}
        </button>
    );
}

export default ActionButton;