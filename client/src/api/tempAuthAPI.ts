import axios from 'axios';
import { User } from "../Types";

axios.defaults.withCredentials = true;

export const testRegister = async(username: string, password: string) => {
    const res = await axios.post<User>(`http://localhost:8080/user`, {username, password});
    return res.data; 
};

export const testLogin = async(username: string, password: string) => {
    const res = await axios.post<User>(`http://localhost:8080/user/login`, {username, password});
    return res.data; 
};

export const testLogout = async() => {
    await axios.post(`http://localhost:8080/user/logout`);
};

export const checkAuthenticated = async (): Promise<boolean> => {
    const res = await axios.get("http://localhost:8080/user/check-session");
    return res.data.loggedIn;
};

export const getUsername = async (): Promise<string> => {
    const res = await axios.get("http://localhost:8080/user/check-session");
    return res.data.user.username; 
};

interface Session {
    loggedIn: boolean;
    user?: { username: string };
}

export const getSession = async (): Promise<Session> => {
    try {
        const res = await axios.get("http://localhost:8080/user/check-session");
        return res.data;
    } catch {
        return { loggedIn: false };
    }
    
}