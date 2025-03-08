import { useState, useEffect } from 'react';

import { getTeamBalance } from '../api/teamPlayersApi.ts';
import { checkAuthenticated } from '../api/tempAuthAPI.ts';
import LucideCircleUser from './LucideCircleUser';
import { Link } from 'react-router-dom';

const LoginOrBalance = () => {
    const [teamBalance, setTeamBalance] = useState<number | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const fetchAuthStatus = async () => {
        const resAuth = await checkAuthenticated();
        setIsAuthenticated(resAuth);
    };
    fetchAuthStatus();

    useEffect(() => {
        checkAuthenticated().then((resAuthenticated) => {
            setIsAuthenticated(resAuthenticated);
        }).catch(() => {
            setError(true);
        });

        getTeamBalance().then((data: { balance: number }) => {
            setTeamBalance(data.balance);
        }).catch(() => {
            setError(true);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    if (!isAuthenticated) {
        return (
            <Link to="/login">
                <button className="btn preset-outlined-primary-500">Sign In</button>
            </Link>
        );
    }

    if (error) {
        return <p>Error</p>
    }

    return (
        <>
            <p>{isLoading ? "Loading" : <p><b>£</b>{teamBalance}</p>}</p>
            <Link to="/login" className="hover:text-primary-400-600">
                <LucideCircleUser />
            </Link>
        </>
    );
};

export default LoginOrBalance;
