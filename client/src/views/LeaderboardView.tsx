import React, { useEffect, useState } from 'react';
import { getLeaderboard, isGameSession, getGamesessionUsernames, updateGameState } from "../api/gamesessionApi";
import { toast } from 'react-hot-toast';

interface LeaderboardEntry {
    username: string;
    points: number;
}

const LeaderboardView: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [gameSessionActive, setGameSessionActive] = useState(false);
    const [currentUserIndex, setCurrentUserIndex] = useState<number>(-1);
    const currentUsername = sessionStorage.getItem('username');

    useEffect(() => {
        const checkGameSession = async () => {
            try {
                const gameSessionStatus = await isGameSession();
                if (typeof gameSessionStatus === 'string') {
                    throw new Error(`Error checking game session: ${gameSessionStatus}`);
                }
                setGameSessionActive(gameSessionStatus);
                
                if (gameSessionStatus) {
                    // Update game state for all users except the current user 
                    const usernames = await getGamesessionUsernames();
                    if (typeof usernames === 'string') {
                        console.error('Error getting game session usernames:', usernames);
                    } else if (usernames) {
                        for (const uname of usernames) {
                            if (uname !== currentUsername) {
                                await updateGameState(uname);
                            }
                        }
                        console.log("Game session state updated for all users except the current user");
                    }
                    const leaderboardData = await getLeaderboard();
                    if (typeof leaderboardData === 'string') {
                        throw new Error(`Error fetching leaderboard: ${leaderboardData}`);
                    } else {
                        const formattedLeaderboard = leaderboardData.map(([username, points]) => ({
                            username,
                            points
                        })).sort((a, b) => b.points - a.points);
                        setLeaderboard(formattedLeaderboard);

                        if (currentUsername) {
                            const currentUserIndex = formattedLeaderboard.findIndex(({ username }) => username === currentUsername);
                            setCurrentUserIndex(currentUserIndex);
                        }
                    }
                }
            } catch (error) {
                toast.error('Leaderboard error: ' + error);
                console.error('Leaderboard error');
            } finally {
                setLoading(false);
            }
        };

        checkGameSession();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return gameSessionActive ? (
        <div className="p-10 flex flex-col items-center space-y-5">
            <h1 className="h1">Leaderboard</h1>
            <table className="table lg:w-3/4 space-1 border-spacing-y-1 border-separate">
                <thead>
                    <tr>
                        <th className="!px-4"><b>#</b></th>
                        <th className="!px-4"><b>Username</b></th>
                        <th className="!px-4"><b>Points</b></th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((entry, index) => (
                        <tr
                            className={index === currentUserIndex ? "preset-filled-primary-200-800 rounded-full" : "preset-filled-surface-200-800"}
                            key={index}
                        >
                            <td className="!p-4">{index + 1}</td>
                            <td className="!p-4">{entry.username}</td>
                            <td className="!p-4">{entry.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ) : null;
};

export default LeaderboardView;