import React, { useEffect, useState } from 'react';
import { getLeaderboard, isGameSession } from "../api/gamesessionApi";
import LeaderboardCard from '../components/LeaderboardCard';

interface LeaderboardEntry {
    username: string;
    points: number;
}

const LeaderboardView: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [gameSessionActive, setGameSessionActive] = useState(false);
    const currentUser = sessionStorage.getItem('username');

    useEffect(() => {
        const checkGameSession = async () => {
            try {
                const gameSessionStatus = await isGameSession();
                if (typeof gameSessionStatus === 'string') {
                    console.error('Error checking game session:', gameSessionStatus);
                    setLoading(false);
                    return;
                }
                setGameSessionActive(gameSessionStatus);
                if (gameSessionStatus) {
                    const leaderboardData = await getLeaderboard();
                    if (typeof leaderboardData === 'string') {
                        console.error('Error fetching leaderboard:', leaderboardData);
                        setLoading(false);
                        return;
                    } else {
                        const formattedLeaderboard = leaderboardData.map(([username, points]) => ({
                            username,
                            points
                        }));
                        setLeaderboard(formattedLeaderboard);
                        setLoading(false);
                    }
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error checking game session or fetching leaderboard:', error);
                setLoading(false);
            }
        };

        checkGameSession();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Leaderboard:</h1>
            {gameSessionActive ? (
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="py-2 px-4 border-b">#</th>
                            <th className="py-2 px-4 border-b">Username</th>
                            <th className="py-2 px-4 border-b">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((entry, index) => (
                            <tr key={entry.username}>
                                <td className="py-2 px-4 border-b text-black">{index + 1}</td>
                                <td className="py-2 px-4 border-b">
                                    <LeaderboardCard
                                        username={entry.username}
                                        points={entry.points}
                                        isCurrentUser={entry.username === currentUser}
                                    />
                                </td>
                                <td className="py-2 px-4 border-b">{entry.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : null}
        </div>
    );
};

export default LeaderboardView;