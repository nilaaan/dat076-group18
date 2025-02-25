import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { testLogin } from '../api/tempAuthAPI';

/**
 * Data Flow:
 * Frontend sends GET request to /team/players
 * - Frontend displays loading message while
 * Backend responds with the list of players on the user's team
 * - Error: frontend display error message
 * - Success: frontend displays the list of players on the team
*/

const LoginView: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Logging in with", email, password);

    testLogin(email, password);

    /*Hashfunc password

    //if (getLogin(email, hashedPwd)){
        //Load profile page
    //}
    else{return <Error/>}*/
  };



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-center text-2xl font-semibold">Login</h2>
        <div className="mt-4 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
          <button
            className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            onClick={handleLogin}
          >
            Login
          </button>

          <button
            className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;