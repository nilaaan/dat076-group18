import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthenticated, getUsername, testLogin } from '../api/tempAuthAPI';
import { testLogout } from '../api/tempAuthAPI';

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);


  useEffect(() => {
    const fetchAuthStatus = async () => {
        const resAuth = await checkAuthenticated();
        setIsAuthenticated(resAuth);

        const username = await getUsername();
        setEmail(username);
    };
    fetchAuthStatus();
}, []);


const handleLogin = async () => {
  try {
      if (!isAuthenticated) {
          await testLogin(email, password);
          

          const resAuth = await checkAuthenticated();
          setIsAuthenticated(resAuth);

          if (resAuth) {
            window.location.reload();
          }
      }
  } catch (error) {
      console.log("Error logging in:", error);
  }
};

const handleLogout = async () => {
  try {
      if (isAuthenticated) {
          await testLogout();
          

          const resAuth = await checkAuthenticated();
          setIsAuthenticated(resAuth);
          setEmail("");

          if (!resAuth) {
            window.location.reload();
          }
      }
  } catch (error) {
      console.log("Error logging out:", error);
  }
};


  if(isAuthenticated){
    return(
      <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-sm preset-filled-surface-200-800 shadow-lg rounded-xl p-6">
            <h2 className="text-center text-2xl font-semibold">{email}</h2>
            <div className="mt-4 space-y-4">
              
              <button
                className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                onClick={handleLogout}
              >
                Logout
              </button>
    
            </div>
          </div>
        </div>
      );
  }

  if(!isAuthenticated){

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-sm preset-filled-surface-200-800 shadow-lg rounded-xl p-6">
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

  }
  


  

  
};

export default LoginView;