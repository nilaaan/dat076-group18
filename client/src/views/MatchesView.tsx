import React from 'react';

const MatchesView: React.FC = () => {
    const handleStartFantasyLeague = () => {
        console.log("Fantasy League Started");
        // Add your logic to start the fantasy league here
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button onClick={handleStartFantasyLeague}>
                Start Fantasy League
            </button>
        </div>
    );
};

export default MatchesView;