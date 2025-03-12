import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MatchesView: React.FC = () => {
    const [isGameSession, setIsGameSession] = useState<boolean | null>(null);
    const [isGameSessionFinished, setIsGameSessionFinished] = useState<boolean | null>(null);
    const [isMatchesInProgress, setIsMatchesInProgress] = useState<boolean | null>(null);
    const [userRound, setUserRound] = useState<number | null>(null);

    useEffect(() => {
        const checkGameSession = async () => {
            try {
                const response = await axios.get('/router/gamesession/isGameSession');
                setIsGameSession(response.data);
                if (response.data) {
                    await updateGameState();
                }
            } catch (error) {
                console.error('Error checking game session:', error);
            }
        };

        const updateGameState = async () => {
            try {
                await axios.put('/router/gamesession/updateState');
                const finishedResponse = await axios.get('/router/gamesession/isGameSessionFinished');
                setIsGameSessionFinished(finishedResponse.data);
                const inProgressResponse = await axios.get('/router/gamesession/isMatchesInProgress');
                setIsMatchesInProgress(inProgressResponse.data);
                const roundResponse = await axios.get('/router/gamesession/getUserRound');
                setUserRound(roundResponse.data);
            } catch (error) {
                console.error('Error updating game state:', error);
            }
        };

        checkGameSession();
    }, []);

    const handleStartFantasyLeague = async () => {
        try {
            await axios.post('/router/gamesession/startGameSession');
            setIsGameSession(true);
            await updateGameState();
        } catch (error) {
            console.error('Error starting fantasy league:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            {isGameSession === null ? (
                <p>Loading...</p>
            ) : !isGameSession ? (
                <button onClick={handleStartFantasyLeague}>
                    Start Fantasy League
                </button>
            ) : isGameSessionFinished ? (
                <p>League is over!</p>
            ) : isMatchesInProgress ? (
                <p>Round: {userRound}. Matches in progress...</p>
            ) : (
                <p>Round: {userRound}. Matches will be played tonight at 8:45</p>
            )}
        </div>
    );
};

export default MatchesView;