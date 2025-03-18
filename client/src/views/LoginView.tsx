import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { testLogin } from '../api/tempAuthAPI';
import { testLogout } from '../api/tempAuthAPI';
import { updateGameState } from '../api/gamesessionApi';
import { useAuth } from '../contexts/authContext';
import { toast } from 'react-hot-toast';

/**
 * Data Flow:
 * Frontend sends GET request to /team/players
 * - Frontend displays loading message while
 * Backend responds with the list of players on the user's team
 * - Error: frontend display error message
 * - Success: frontend displays the list of players on the team
*/

const LoginView: React.FC = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [tempUsername, setTempUsername] = useState<string>("");
  const { isAuthenticated, username } = useAuth();



  const handleLogin = async () => {
    try {
      if (!isAuthenticated) {
        await testLogin(tempUsername, password);
        await updateGameState(tempUsername);
        sessionStorage.setItem('username', tempUsername);
        window.location.reload();
      }
    } catch (error) {
      toast.error("Error logging in");
      console.log("Error logging in:", error);
    }
  };

  const handleLogout = async () => {
    try {
      if (isAuthenticated) {
        await testLogout();
        window.location.reload();
      }
    } catch (error) {
      toast.error("Error logging out");
      console.log("Error logging out:", error);
    }
  };


  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-sm preset-filled-surface-200-800 shadow-lg rounded-xl p-6">
          <h2 className="text-center text-2xl font-semibold">Welcome back, {username}!</h2>
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

  if (!isAuthenticated) {

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-sm preset-filled-surface-200-800 shadow-lg rounded-xl p-6">
          <h2 className="text-center text-2xl font-semibold">Login</h2>
          <form onSubmit={handleLogin} className="mt-4 space-y-4 flex flex-col items-end">
            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />

            {/* Register Link */}
            <Link to="/register" className="hover:underline text-blue-500 mx-2">
              Register
            </Link>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
};

export default LoginView;