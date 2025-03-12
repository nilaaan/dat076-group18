import LucideCircleUser from './LucideCircleUser';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext.ts';

const LoginOrBalance = () => {
    const { isAuthenticated, balance } = useAuth();

    if (!isAuthenticated) {
        return (
            <Link to="/login">
                <button className="btn preset-outlined-primary-500">Sign In</button>
            </Link>
        );
    }

    return (
        <>
            {balance ? <p><b>£</b>{balance}</p> : <p>Loading...</p>}
            <Link to="/login" className="hover:text-primary-400-600">
                <LucideCircleUser />
            </Link>
        </>
    );
};

export default LoginOrBalance;
