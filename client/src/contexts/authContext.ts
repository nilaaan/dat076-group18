import { createContext, useContext } from "react";

interface AuthContextType {
    isAuthenticated: boolean | null;
    username: string | null;
    //setAuth: (auth: boolean, user?: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }
    return context;
};