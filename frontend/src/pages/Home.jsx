import React from 'react';
import { useNavigate } from 'react-router-dom';
import ganeshImage from '../components/image.png'; // Ensure this path is correct
import '../App.css'

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-100 to-gray-300 overflow-hidden"> {/* Smooth background gradient */}
      {/* Left side - Buttons */}
      <div className="w-1/2 flex flex-col justify-center items-start pl-24 space-y-8"> 
        <h1 className="text-4xl font-semibold text-gray-800 mb-8">Welcome to ThreadTrack</h1> {/* Adding a heading */}
        <button
          onClick={() => navigate('/generate-invoice')}
          className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-2xl transition duration-300 transform hover:scale-105 text-xl font-medium tracking-wide">
          Generate Invoice
        </button>
        <button
          onClick={() => navigate('/saved-invoices')}
          className="w-full px-8 py-4 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 hover:shadow-2xl transition duration-300 transform hover:scale-105 text-xl font-medium tracking-wide">
          Show Saved Invoices
        </button>
        <button
          onClick={() => navigate('/monthly-sales')}
          className="w-full px-8 py-4 bg-teal-600 text-white rounded-lg shadow-lg hover:bg-teal-700 hover:shadow-2xl transition duration-300 transform hover:scale-105 text-xl font-medium tracking-wide">
          Monthly Sales
        </button>
        <button
          onClick={() => navigate('/firm-report')}
          className="w-full px-8 py-4 bg-yellow-600 text-white rounded-lg shadow-lg hover:bg-yellow-700 hover:shadow-2xl transition duration-300 transform hover:scale-105 text-xl font-medium tracking-wide">
          Firm-wise Report
        </button>
      </div>

      {/* Right side - Ganesh Ji Image */}
      <div className="w-1/2 flex justify-center items-center">
        <img 
          src={ganeshImage} 
          alt="Ganesh Ji" 
          className="h-[65vh] w-auto object-contain shadow-lg rounded-lg" // Added shadow and rounded corners
        />
      </div>
    </div>
  );
};

export default Home;
