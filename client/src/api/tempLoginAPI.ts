import axios from 'axios';
import { User } from "../Types";

axios.defaults.withCredentials = true;

export const testLogin = async(username: string, password: string) => {
    const res = await axios.post<User>(`http://localhost:8080/user`, {username, password});
    return res.data; 

};