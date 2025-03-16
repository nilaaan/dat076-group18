import React from 'react';

interface LeaderboardCardProps {
    username: string;
    points: number;
    isCurrentUser: boolean;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ username, points, isCurrentUser }) => {
    return (
        <div className={`flex items-center justify-between p-4 shadow-md rounded-md w-full max-w-md h-24 ${isCurrentUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
            <div className="text-lg font-semibold">{username}</div>
            <div className="text-lg font-semibold">{points}</div>
        </div>
    );
};

export default LeaderboardCard;