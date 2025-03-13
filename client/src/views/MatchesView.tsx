import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { isGameSession as checkGameSession } from '../api/gamesessionApi';
import { isGameSessionFinished as checkGameFinsihed } from '../api/gamesessionApi';
import { isMatchesInProgress as checkMatchesInProgress } from '../api/gamesessionApi';
import { getCurrentRound } from '../api/gamesessionApi';
import { updateGameState as updateGame } from '../api/gamesessionApi';
import { startGameSession } from '../api/gamesessionApi';


const MatchesView: React.FC = () => {
    const [isGameSession, setIsGameSession] = useState<boolean>(false);
    const [isGameSessionFinished, setIsGameSessionFinished] = useState<boolean>(false);
    const [isMatchesInProgress, setIsMatchesInProgress] = useState<boolean>(false);
    const [userRound, setUserRound] = useState<number | null>(null);


    const updateGameState = async () => {
        try {
            await updateGame();
            const finishedResponse = await checkGameFinsihed();
            if (typeof finishedResponse === 'boolean') {
                setIsGameSessionFinished(finishedResponse);
            } else {
                console.error('Error checking if game session is finished:', finishedResponse);
            }
            const inProgressResponse = await checkMatchesInProgress();
            if (typeof inProgressResponse === 'boolean') {
                setIsMatchesInProgress(inProgressResponse);
            } else {
                console.error('Error checking if matches are in progress:', inProgressResponse);
            }
            const roundResponse = await getCurrentRound();
            if (typeof roundResponse === 'number') {
                setUserRound(roundResponse);
            } else {
                console.error('Error getting current round:', roundResponse);
            }
        } catch (error) {
            console.error('Error updating game state:', error);
        }
    };


    useEffect(() => {
        const checkIfGameSession = async () => {
            try {
                const response = await checkGameSession();
                if (typeof response === 'boolean') {
                    setIsGameSession(response);
                    if (response) {
                        await updateGameState();
                    }
                } else {
                    console.error('Error checking game session:', response);
                }
            } catch (error) {
                console.error('Error checking game session:', error);
            }
        };

        checkIfGameSession();
    }, []);

    const handleStartFantasyLeague = async () => {
        try {
            const response = await startGameSession();
            if (typeof response === 'boolean') {
                if (response) {
                    setIsGameSession(true);
                    await updateGameState();
                } else {
                    console.error('Could not start fantasy league:'); // impossible to get here since only possible boolean response value is true
                }

            } else {
                console.error('Error starting fantasy league:', response);
            }
        } catch (error) {
            console.error('Error starting fantasy league:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            {!isGameSession ? (
                <button onClick={handleStartFantasyLeague}>
                    Start Fantasy League
                </button>
            ) : isGameSessionFinished ? (
                <p>League is over! Check your final position in the Leaderboard!</p>
            ) : isMatchesInProgress ? (
                <p>Round: {userRound}. Matches in progress...</p>
            ) : (
                <p>Round: {userRound}. Matches will be played tonight at 8:45. Form your team!</p>
            )}
        </div>
    );
};

export default MatchesView;