import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { checkAuthenticated } from "../api/tempAuthAPI.ts";
import axios from "axios";

interface ProtectedRouteProps {
    children: ReactNode;
}

axios.defaults.withCredentials = true;

// Returns the children if logged in, and redirects if not.
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get("http://localhost:8080/user/check-session"); // Borde använda apin
                setIsAuthenticated(res.data.loggedIn); // Is either true or false based on result of previous get
            } catch (error) {
                setIsAuthenticated(false); // Assume not authenticated on error
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) return <p>Loading...</p>;

    if (!isAuthenticated) {
        return <Navigate to="/user" replace />;
    }

    return children;
};

export default ProtectedRoute;
