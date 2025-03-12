import axios from 'axios';

axios.defaults.withCredentials = true;

export const startGameSession = async(): Promise<string> => {
    try {
        const res = await axios.post<string>(`http://localhost:8080/gamesession`);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data; // Return the error message from the server
        }
        throw new Error('An unexpected error occurred');
    }
}

export const isGameSession = async(): Promise<boolean | string> => {
    const res = await axios.get<boolean | string>('http://localhost:8080/gamesession');
    return res.data;
};


export const isGameSessionFinsihed = async(): Promise<boolean | string> => {
    const res = await axios.get<boolean | string>('http://localhost:8080/gamesession/finished');
    return res.data;
};


export const isMatchesInProgress = async(): Promise<boolean | string> => {
    const res = await axios.get<boolean | string>('http://localhost:8080/gamesession/matchesActive');
    return res.data;
};

export const getCurrentRound = async(): Promise<number | string> => {
    const res = await axios.get<number | string>('http://localhost:8080/gamesession/round');
    return res.data;
};

export const updateGameState = async(): Promise<string> => {
    try {
        const res = await axios.put<string>(`http://localhost:8080/gamesession`);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data; // Return the error message from the server
        }
        throw new Error('An unexpected error occurred');
    }
}


