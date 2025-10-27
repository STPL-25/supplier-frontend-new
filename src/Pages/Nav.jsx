

import React, { useContext, useState } from 'react';
import { DashBoardContext } from '../DashBoardContext/DashBoardContext';
import "../App.css";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { token, setToken, user, setUser, handleLogOut } = useContext(DashBoardContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
const signoutImg = "/images/signout.png";
const  logo = "/images/space1.png";
const  userImg = "./images/user.png";


  return (
    <nav className="navbar w-full bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 text-white z-20 bg-opacity-75">
      <div className="nav-container px-5  py-4  flex flex-wrap items-center justify-between">
        {/* Logo - Always visible */}
        <div className="logo flex-shrink-0 m-auto">
          <img src={logo} alt="SPACE TEXTILES" className="h-10 w-auto opacity-100" />
        </div>
        
        {/* Logout Button - Visible on larger screens, hidden on mobile */}
       <div className="log-out hidden md:flex items-center text-white">
  <button onClick={handleLogOut} className="flex items-center">
    <img src={signoutImg} alt="log Out" className="w-8 h-8 rounded-full mr-2" />
    <strong>Log Out</strong>
  </button>
</div>
        
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg  text-white hover:bg-indigo-700 transition-colors"
        >
         <img src={userImg} alt="User" className="w-8 h-8 rounded-full" />
          {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg> */}
        </button>
      </div>
      
      {/* Mobile Dropdown Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-indigo-600 text-white py-4`}>
        <ul className="space-y-4 px-4">
          {/* User Info */}
          <li className="flex items-center space-x-2 mb-4">
            
            <strong className='text-white'>{user}</strong>
          </li>
          
          {/* Mobile Logout Option */}
          <li>
            <button 
              onClick={handleLogOut} 
              className="flex items-center w-full text-left hover:bg-indigo-700 px-3 py-2 rounded"
            >
              <img src={signoutImg} alt="log Out" className="w-6 h-6 rounded-full mr-2" />
              <strong>Log Out</strong>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;