import toast from "react-hot-toast";
import { getTopPerformers, getRating } from "../api/playerApi";
import { Player } from "../Types";
import React, { useEffect, useState } from 'react';


interface TopPerformersProps {
    round: number;
}

const TopPerformers: React.FC<TopPerformersProps> = ({ round }) => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [ratings, setRatings] = useState<{ [key: number]: number | null }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopPerformers = async () => {
            try {
                const topPerformers = await getTopPerformers(round);
                if (typeof topPerformers === 'string') {
                    console.error('Error fetching top performers:', topPerformers);
                    setLoading(false);
                    return;
                }
                setPlayers(topPerformers.slice(0, 10)); // Take the top 10 players

                const ratingsPromises = topPerformers.slice(0, 10).map(async (player: Player) => {
                    const rating = await getRating(player.id, round);
                    if (typeof rating === 'string') {
                        console.error('Error fetching rating:', rating);
                        return 
                    }
                    return { playerId: player.id, rating };
                });

                const ratingsResults = await Promise.all(ratingsPromises);
                const ratingsMap: { [key: number]: number | null } = {};
                ratingsResults.forEach(result => {
                    if (result) {
                        ratingsMap[result.playerId] = result.rating;
                    }
                });

                setRatings(ratingsMap);
            } catch (error) {
                console.error('Error fetching top performers or ratings:', error);
                toast.error('Could not fetch top performers');
            } finally {
                setLoading(false);
            }
        };

        fetchTopPerformers();
    }, [round]);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Sort players by rating in descending order
    const sortedPlayers = players.sort((a, b) => (ratings[b.id] ?? -Infinity) - (ratings[a.id] ?? -Infinity));

    return (
        <div className="w-full flex flex-col items-center space-y-4">
            <h2 className="h4">Top Performing Players from Round {round}</h2>
            <table className="table border-spacing-2 border-collapse">
                <thead>
                    <tr className="border-b border-b-surface-400-600">
                        <th className="!py-3"><b>#</b></th>
                        <th><b>Name</b></th>
                        <th><b>Club</b></th>
                        <th><b>Rating</b></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        sortedPlayers.map((player, index) => (
                            <tr key={player.id}>
                                <td className="!py-3">{index + 1}</td>
                                <td>{player.name}</td>
                                <td>{player.club}</td>
                                <td>{ratings[player.id] !== null ? ratings[player.id] : 'N/A'}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default TopPerformers;

