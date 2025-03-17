import React, { useEffect, useState } from 'react';
import { getTeamPoints } from '../api/teamPlayersApi'; // Import the getTeamPoints method

const TeamPoints: React.FC = () => {
    const [teamPoints, setTeamPoints] = useState<number | null>(null);

    useEffect(() => {
        const fetchTeamPoints = async () => {
            try {
                const points = await getTeamPoints().then((data: { points: number }) => {
                    console.log('API data: ', data);
                    return data.points;
                });
                setTeamPoints(points);
            } catch (error) {
                console.error('Error fetching team points:', error);
            }
        };

        fetchTeamPoints();
    }, []);

    return teamPoints !== null ? teamPoints : 'Loading...';
};

export default TeamPoints;