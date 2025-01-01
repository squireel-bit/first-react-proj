import React, { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [generemenu, nogenere] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <div className='navbar'>
      <NavLink to="/"><h1 className='logo'>Book<span> Reviews</span></h1></NavLink>
      <div className="menu-icon" onClick={toggleMobileMenu}>
        <MenuIcon />
      </div>
      <ul className={mobileMenu ? "nav-menu active" : "nav-menu"}>
        <li><NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Home</NavLink></li>
        <li><NavLink to="/addbooks" className={({isActive}) => isActive ? "active" : ""}>AddBook</NavLink></li>
        <li><NavLink to="/about" className={({isActive}) => isActive ? "active" : ""}>About</NavLink></li>
        <li><NavLink to="/contact" className={({isActive}) => isActive ? "active" : ""}>Contact us</NavLink></li>
      </ul>
    </div>
  );
};

export default Navbar;
