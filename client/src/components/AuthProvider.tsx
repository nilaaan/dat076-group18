import { ReactNode, useEffect, useState } from "react";
import { getSession } from "../api/tempAuthAPI";
import axios from "axios";
import { AuthContext } from "../contexts/authContext";
import { getTeamBalance } from "../api/teamPlayersApi";

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | null>(null);

    useEffect(() => {
        const checkAuth = async() => {
            try {
                const session = await getSession();
                setIsAuthenticated(session.loggedIn);
                if (session.loggedIn) {
                    setUsername(session.user!.username);
                    updateBalance();
                }
            } catch {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    const updateBalance = async() => {
        try {
            const res = await getTeamBalance();
            setBalance(res.balance);
        } catch {
            // Error updating balance
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, balance, updateBalance }}>
            {children}
        </AuthContext.Provider>
    )
}