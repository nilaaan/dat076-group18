import React from "react";

interface ChoiceBoxProps {
    func: (id: number) => void; 
}

const ChoiceBox: React.FC<ChoiceBoxProps> = ({ func }) => {
    return (
        <select onChange={(e) => func(Number(e.target.value))} defaultValue="">
            <option value="" disabled>Select a player</option>
            <option value="1">Player 1</option>
            <option value="2">Player 2</option>
            <option value="3">Player 3</option>
            <option value="4">Player 4</option>
        </select>
    );
};

export default ChoiceBox;