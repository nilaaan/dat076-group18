import { testLogin } from '../api/tempLoginAPI.ts';

const TempLogin = () => {
    const handleLogin = () => {
        testLogin("hugo", "123"); 
    };

    return (
        <button className='p-2' onClick={handleLogin}>test login</button>
    );
};

export default TempLogin;
