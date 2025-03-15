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

    return (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid black', borderRadius: '5px' }}>
            <h3>Your Current Points:</h3>
            <p>{teamPoints !== null ? teamPoints : 'Loading...'}</p>
        </div>
    );
};

export default TeamPoints;