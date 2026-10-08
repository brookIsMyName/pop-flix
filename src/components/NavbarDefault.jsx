import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'
import Search from './search'

const NavbarMain = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <header className="absolute top-0 left-0 w-full z-50 nav-nav">
      
      <div className="w-full flex justify-between py-6 px-9 items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2" style={{textDecoration: "none", color: "white"}}>
        <div className="text-white text-2xl font-serif">
          PopFlix
        </div>
        </Link>

        {/* Hamburger Icon (mobile only) */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? (
              <img src='./search1.png' className="h-6 w-6 text-white" />
            ) : (
              <img src='./search1.png'className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Menu (hidden on small screens) */}
        <nav className="hidden md:flex space-x-8 text-white text-xl font-serif">
          {/* <Link to="/" style={{textDecoration: "none", color: "white"}}  className="a hover:text-gray-300">Movies</Link>
          <Link to="/" style={{textDecoration: "none", color: "white"}}  className="a hover:text-gray-300">Tv-Series</Link>
          <Link to="/about-us/" style={{textDecoration: "none", color: "white"}}  className="a hover:text-gray-300">About-Us</Link>
        */} 
        <Search /> 
        </nav>
      </div>

      {/* Dropdown (visible only on mobile) */}
      {isOpen && (
        <div className="md:hidden pb-4">
          <nav className="flex flex-col space-y-4 text-white text-lg font-serif">
            {/* <Link to="/" className="text-white hover:text-gray-300" onClick={toggleMenu}>Movies</Link>
            <Link to="/" className="text-white hover:text-gray-300" onClick={toggleMenu}>Tv-Series</Link>
            <Link to="/about-us/" className="text-white hover:text-gray-300" onClick={toggleMenu}>About-Us</Link>
          */}  
          <Search /> 
          </nav>
        </div>
      )}

        </header>
  )
}

export default NavbarMain
