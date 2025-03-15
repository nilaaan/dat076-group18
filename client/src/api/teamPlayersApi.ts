import axios from 'axios';
import { Player } from '../Types.ts';

axios.defaults.withCredentials = true;

export const getTeamPlayers = async(): Promise<Player[]> => {
    const res = await axios.get<Player[]>('http://localhost:8080/team/players');
    return res.data;
};

export const buyPlayer = async(id: number): Promise<Player|string> => {
    try {
        const res = await axios.post<Player|string>(`http://localhost:8080/team/${id}`, ({action: "buy"}));
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data; // Return the error message from the server
        }
        throw new Error('An unexpected error occurred');
    }
}

export const sellPlayer = async(id: number): Promise<Player|string> => {
    try {
        const res = await axios.post<Player|string>(`http://localhost:8080/team/${id}`, ({action: "sell"}));
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data; // Return the error message from the server
        }
        throw new Error('An unexpected error occurred');
    }
}

export const getTeamBalance = async(): Promise<{ balance: number }> => {
    const res = await axios.get<{ balance: number }>('http://localhost:8080/team/balance');
    return res.data;
};

export const getTeamPoints = async(): Promise<{ points: number }> => {
    const res = await axios.get<{ points: number }>('http://localhost:8080/team/points');
    return res.data;
};