import { testRegister, testLogin, testLogout } from '../api/tempAuthAPI.ts';

const TempRegister = () => {
    const handleRegister = () => {
        testRegister("hugo", "123"); 
    };

    const handleLogin = () => {
        testLogin("hugo", "123"); 
    };

    // if logged in... return

    return (
        <div>
            <button className='p-2 bg-orange-300 hover:border' onClick={handleRegister}>Register</button>
            <button className='p-2 bg-orange-300 hover:border' onClick={handleLogin}>Login</button>
            <button className='p-2 bg-orange-300 hover:border' onClick={testLogout}>Logout</button>
        </div>
    );
};

export default TempRegister;
