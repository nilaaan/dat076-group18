import { ReactNode, useEffect, useState } from "react";
import { getSession } from "../api/tempAuthAPI";
import axios from "axios";
import { AuthContext } from "../contexts/authContext";

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async() => {
            try {
                const session = await getSession();
                if (session.loggedIn) {
                    setUsername(session.user!.username);
                }
                setIsAuthenticated(session.loggedIn);
            } catch {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, username }}>
            {children}
        </AuthContext.Provider>
    )
}