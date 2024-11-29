import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from './logo.jpg'; // Correctly importing the image

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const handleClick = () => {
    navigate('/'); // Navigate to Home
  };

  // Determine the title based on the current path
  const getTitle = () => {
    switch (location.pathname) {
      case '/generate-invoice':
        return 'Generate Invoice';
      case '/saved-invoices':
        return 'Saved Invoices';
      case '/monthly-sales':
        return 'Monthly Sales';
      case '/firm-report':
        return 'Firm Wise Sales';
      default:
        return ''; // No title for home or other pages
    }
  };

  const isHomePage = location.pathname === '/';

  return (
    <header 
      className="bg-gray-300 text-gray-800 py-4 px-8 flex items-center justify-between shadow-md" // Light gray background
    >
      {/* Left side: Logo and Project Name */}
      <div className="flex items-center space-x-4 mx-4 cursor-pointer" onClick={handleClick}>
        <img 
          src={logo} 
          alt="ThreadTrack Logo" 
          className="h-16 w-32" // Increase logo size to 64x64px
        />
      </div>

      {/* Center: Dynamic Title or Project Name */}
      <div className="flex-grow text-center mx-4">
        {isHomePage ? (
          <h1 className="text-3xl font-bold">ThreadTrack</h1> // Center on home page
        ) : (
          <h2 className="text-3xl font-bold">{getTitle()}</h2> // Center title on other pages
        )}
      </div>

      {/* Right side: Shree Ganesh Enterprise */}
      <div className="text-right mx-4">
        <h2 className="text-2xl font-bold">Shree Ganesh Enterprise</h2> {/* Semi-bold text */}
      </div>
    </header>
  );
};

export default Header;
