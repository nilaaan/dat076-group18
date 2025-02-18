import { useState } from 'react';
import { Player } from '../Types';
 
interface ActionButtonProps {
    playerId: number; 
    onAction: (playerId: number) => Promise<Player | string>;
    buttonText: string;
    successText: string;
}

function ActionButton({playerId, onAction, buttonText, successText}: ActionButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await onAction(playerId);
            if (typeof res === 'string') {
                setError(res);
            } else {
                setSuccess(true);
            }
        } catch (error) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }

    return (
        <button onClick={handleClick} disabled={loading || success}>
            {loading ? 'Loading...' : success ? successText : buttonText}
            {error && <p>{error}</p>}
        </button>
    );
}

export default ActionButton;