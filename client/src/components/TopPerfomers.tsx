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
                setLoading(false);
            } catch (error) {
                console.error('Error fetching top performers or ratings:', error);
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
        <div>
            <h2>Top Performing Players From Last Round ({round})</h2>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Club</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedPlayers.map((player, index) => (
                        <tr key={player.id}>
                            <td>{index + 1}</td>
                            <td>{player.name}</td>
                            <td>{player.club}</td>
                            <td>{ratings[player.id] !== null ? ratings[player.id] : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TopPerformers;

