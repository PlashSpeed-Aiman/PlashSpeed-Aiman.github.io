// src/components/Navbar.js
import Clock from "./Clock"
import React from "react";
import { Link} from "react-router-dom";
import {  useState } from 'react';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="  ">
      <div className=" flex flex-wrap p-6  flex-col md:flex-row items-center">
        <a className="title-font font-medium text-white mb-4 md:mb-0">
          <Link to="/" className="ml-3 text-xl text-gray-700">
            Aiman Rahim
          </Link>
        </a>
        <nav className="  md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-700	flex flex-wrap items-center text-base justify-center">
          <Link
            to="/lambda"
            className="inline-flex items-center mr-2 hover:text-white text-gray-700	 hover:bg-gray-700 p-2 rounded-md"
          >
            Lambda
          </Link>
          <button
            className="  inline-flex items-center mr-2 hover:text-white text-gray-700 hover:bg-gray-700 p-2 rounded-md focus:outline-none "
            onClick={toggleDropdown}
          >
            Gerakan Developer Tanahair
            <svg
              className="fill-current h-4 w-4 ml-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M6 8l4 4 4-4"></path>
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute bg-gray-100 py-2 rounded-md w-full mx-auto  md:mt-0 md:w-auto md:mx-3 lg:-translate-x-10 md:-translate-x-10 translate-y-20 ">
              <Link
                to="/skills"
                className="block px-4 py-2 text-gray-700 hover:text-gray-200"
              >
                Skill Sets
              </Link>
              <Link
                to="/projects"
                className="block px-4 py-2 text-gray-700 hover:text-gray-200"
              >
                Projects
              </Link>
            </div>
          )}
        </nav>
        <div className="inline-flex items-center bg-gray-800 border-0 p-2 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0">
          <Clock />
        </div>
      </div>
    </header>
  );}