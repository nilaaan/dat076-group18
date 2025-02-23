import axios from 'axios';
import { User } from "../Types";

axios.defaults.withCredentials = true;

export const testRegister = async(username: string, password: string) => {
    const res = await axios.post<User>(`http://localhost:8080/user/register`, {username, password});
    return res.data; 
};

export const testLogin = async(username: string, password: string) => {
    const res = await axios.post<User>(`http://localhost:8080/user/login`, {username, password});
    return res.data; 
};

export const testLogout = async() => {
    await axios.post(`http://localhost:8080/user/logout`);
};