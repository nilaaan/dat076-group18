import { testRegister, testLogin, testLogout } from '../api/tempAuthAPI.ts';

const TempRegister = () => {
    const handleRegister = () => {
        testRegister("hugo", "123"); 
    };

    const handleLogin = () => {
        testLogin("hugo", "123"); 
    };

    return (
        <div>
            <button className='p-2 bg-orange-300 hover:border' onClick={handleRegister}>test register</button>
            <button className='p-2 bg-orange-300 hover:border' onClick={handleLogin}>test login</button>
            <button className='p-2 bg-orange-300 hover:border' onClick={testLogout}>test login</button>
        </div>
    );
};

export default TempRegister;
