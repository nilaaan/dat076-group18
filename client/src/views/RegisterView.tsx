import { useState } from 'react';
import { testRegister } from '../api/tempAuthAPI';
import { useNavigate } from 'react-router-dom';


/**
 * Data Flow:
 * Frontend sends GET request to /team/players
 * - Frontend displays loading message while
 * Backend responds with the list of players on the user's team
 * - Error: frontend display error message
 * - Success: frontend displays the list of players on the team
*/

const RegisterView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegistration = async () => {
    testRegister(email, password);
    navigate('/login')
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm preset-filled-surface-200-800 shadow-lg rounded-xl p-6">
        <h2 className="text-center text-2xl font-semibold">Register</h2>
        <form onSubmit={handleRegistration} className="mt-4 space-y-4">
          {/* Email / Username */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <button
            type="submit"
            className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterView;