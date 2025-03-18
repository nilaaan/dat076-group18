import { Link } from 'react-router-dom'; 
import footballBG from '../assets/footballBG.jpg';

const StartView = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${footballBG})` }} 
      aria-label="Football background"
    >
      {/* Overlay for frosted glass effect */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-40 backdrop-blur-sm z-10"></div>

      <div className="relative z-20 flex flex-col justify-center items-center h-full text-white text-center p-6">
        <div className="mb-12">
          <h1 className="text-5xl font-semibold mb-6 tracking-wider">Fantasy Football</h1>
          <p className="text-lg sm:text-xl md:text-2xl font-light max-w-lg mx-auto leading-relaxed">
            Become José Mourinho!
          </p>
        </div>


        <Link to="/register">
          <button className="mt-8 py-3 px-6 bg-white text-black font-semibold rounded-xl shadow-lg backdrop-blur-sm bg-opacity-40 hover:bg-opacity-60 hover:scale-105 transform transition duration-300">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StartView;
