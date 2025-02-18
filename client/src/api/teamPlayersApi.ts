import axios from 'axios';
import { Player } from '../Types.ts';

export const getTeamPlayers = async(): Promise<Player[]> => {
    const res = await axios.get<Player[]>('http://localhost:8080/team/players');
    return res.data;
};
