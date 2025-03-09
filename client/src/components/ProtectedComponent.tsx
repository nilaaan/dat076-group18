import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import axios from "axios";
import { useAuth } from "../contexts/authContext.ts";

interface ProtectedRouteProps {
    children: ReactNode;
}

axios.defaults.withCredentials = true;

// Returns the children if logged in, and redirects if not.
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) return <p>Loading...</p>;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
