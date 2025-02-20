import axios from 'axios';
import { Player } from '../Types.ts';

axios.defaults.withCredentials = true;

export const getPlayer = async(id: string): Promise<Player> => {
    const res = await axios.get<Player>(`http://localhost:8080/player/${id}`);
    return res.data;
};
