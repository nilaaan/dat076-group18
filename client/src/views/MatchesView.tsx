import React, { useEffect, useState } from 'react';
import { isGameSession as checkGameSession } from '../api/gamesessionApi';
import { isGameSessionFinished as checkGameFinsihed } from '../api/gamesessionApi';
import { isMatchesInProgress as checkMatchesInProgress } from '../api/gamesessionApi';
import { getCurrentRound } from '../api/gamesessionApi';
import { updateGameState as updateGame } from '../api/gamesessionApi';
import { startGameSession } from '../api/gamesessionApi';
import TopPerformers from '../components/TopPerfomers';
import { Link } from 'react-router-dom';


const MatchesView: React.FC = () => {
    const [isGameSession, setIsGameSession] = useState<boolean>(false);
    const [isGameSessionFinished, setIsGameSessionFinished] = useState<boolean>(false);
    const [isMatchesInProgress, setIsMatchesInProgress] = useState<boolean>(false);
    const [userRound, setUserRound] = useState<number>(1);


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
                    console.error('Could not start fantasy league:'); 
                }

            } else {
                console.error('Error starting fantasy league:', response);
            }
        } catch (error) {
            console.error('Error starting fantasy league:', error);
        }
    };

    return (
        <div className="p-6 flex items-center flex-col">
            <div className="w-full lg:w-1/2 space-y-4">
                {!isGameSession ? (
                    <div className="preset-filled-surface-100-900 card p-6 flex flex-col items-center">
                        <h1 className="h1">Ready to Join?</h1>
                        <button onClick={handleStartFantasyLeague} className="btn preset-filled-success-500 py-6 px-12 mt-4">
                            Confirm Team & Join Season
                        </button>
                    </div>
                ) : isGameSessionFinished ? (
                    <div className="preset-filled-surface-100-900 card p-6 flex flex-col items-center">
                        <h1 className="h1">The Season has Ended!</h1>
                        <Link to="/leaderboard">
                            <button className="btn preset-filled-primary-500 py-6 px-12">Final Ranking &gt;</button>
                        </Link>
                    </div>
                ) : isMatchesInProgress ? (
                    <div className="preset-filled-surface-100-900 card p-6 flex flex-col items-center">
                        <h1 className="h1">Matches in Progress...</h1>
                        <p>Round {userRound}</p>
                        <Link to="/leaderboard">
                            <button className="btn preset-filled-primary-500 py-6 px-12 mt-8">Current standings &gt;</button>
                        </Link>
                    </div>
                ) : (
                    <div className="preset-filled-surface-100-900 card p-6 flex flex-col items-center">
                        <h1 className="h1">Matches Starting at 8:45</h1>
                        <p>Round {userRound}</p>
                        <Link to="/player">
                            <button className="btn preset-filled-success-600-400 py-6 px-12 mt-8">Build Your Team &gt;</button>
                        </Link>
                    </div>
                )}
                {isGameSession ? 
                    <div className="preset-filled-surface-100-900 card p-6 flex flex-col items-center">
                        {userRound >= 2 && <TopPerformers round={userRound - 1} />}
                    </div> : null
                }
            </div>
        </div>
    );
};


export default MatchesView;