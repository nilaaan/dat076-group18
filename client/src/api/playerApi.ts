import axios from 'axios';
import { Player } from '../Types.ts';

axios.defaults.withCredentials = true;


export const getPlayer = async(id: number): Promise<Player> => {
    const res = await axios.get<Player>(`http://localhost:8080/player/${id}`);
    return res.data; 
};

export const getPlayers = async(): Promise<Player[]> => {
    const res = await axios.get<Player[]>('http://localhost:8080/player');
    return res.data;
};

export const getRating = async(id: number, round: number): Promise<number | null | string> => {
    const res = await axios.get<number | null | string>(`http://localhost:8080/player/${id}/rating/${round}`);
    return res.data;
};

export const getAvailability = async(id: number, round: number): Promise<boolean | null | string> => {
    const res = await axios.get<boolean | null | string>(`http://localhost:8080/player/${id}/availability/${round}`);
    return res.data;
};

export const getForm = async(id: number, round: number): Promise<number | null | string> => {
    const res = await axios.get<number | null | string>(`http://localhost:8080/player/${id}/form/${round}`);
    return res.data;
};

export const getTopPerformers = async(round: number): Promise<Player[] | string > => {
    const res = await axios.get<Player[] | string >(`http://localhost:8080/player/performance/${round}`);
    return res.data;
};