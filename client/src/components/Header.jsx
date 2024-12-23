import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {Toaster} from "react-hot-toast"
import logo from '../assets/notebooklogo.png'
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [isDropdownOpen,setIsDropdownOpen] = useState(false)
    const [isDropdownOpen1,setIsDropdownOpen1] = useState(false)


    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleDropdownToggle = ()=>{
        setIsDropdownOpen(!isDropdownOpen)
    }

    const handleDropdownToggle1 = ()=>{
      setIsDropdownOpen1(!isDropdownOpen1)
  }

    return (
        <nav className="bg-white shadow-xl border-gray-200 ">
           
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse ">
                    <img src={logo} className="w-52" alt="Flowbite Logo" />
                    {/* <span className="self-center text-2xl font-semibold whitespace-nowrap ">Print Shop ERP</span> */}
                </a>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    {/* <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center ">Get started</button> */}
                    <button
                        onClick={handleToggle}
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
                        aria-controls="navbar-cta"
                        aria-expanded={isOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
                <div className={`items-center justify-between ${isOpen ? 'block' : 'hidden'} w-full md:flex md:w-auto md:order-1`} id="navbar-cta">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white ">
                       
                        <li>
                            <Link to="/products" className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700  ">Home</Link>
                        </li>
                        <li>
                            <Link to="/scanner" className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700  ">Scanner</Link>
                        </li>
                        {/* <li>
                            <Link to="/qr" className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700  ">QR</Link>
                        </li> */}
                        <li>
                            <Link to="/addProduct" className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700  ">Add Product</Link>
                        </li>
                        {/* <li>
                            <Link to="/products" className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700  ">Products</Link>
                        </li> */}
                        {/* <li className="relative">
              <button
                onClick={handleDropdownToggle1}
                className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 "
              >
                Price Calculator
              </button>
              {isDropdownOpen1 && (
                <div className="absolute left-0 mt-2 w-48 z-30 bg-white rounded-md shadow-lg ">
                  <a
                    href="/businesscard"
                    className="block px-4 py-2 text-gray-800  hover:bg-gray-100 "
                  >
                    Business Card
                  </a>
                  <a
                    href="/uniform"
                    className="block px-4 py-2 text-gray-800  hover:bg-gray-100 "
                  >
                    Uniform
                  </a>
                  <a
                    href="/billBook"
                    className="block px-4 py-2 text-gray-800  hover:bg-gray-100 "
                  >
                    Bill Book
                  </a>
                  <a
                    href="/keychain"
                    className="block px-4 py-2 text-gray-800  hover:bg-gray-100 "
                  >
                    Keychain
                  </a>
                  <a
                    href="/flyer"
                    className="block px-4 py-2 text-gray-800  hover:bg-gray-100 "
                  >
                    Flyer
                  </a>
                  <a
                    href="/weddingCard"
                    className="block px-4 py-2 text-gray-800  hover:bg-gray-100 "
                  >
                    Wedding Card
                  </a>
                  
                 
                </div>
              )}
            </li> */}
                        {/* <li className="relative">
              <button
                onClick={handleDropdownToggle}
                className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 "
              >
                Add New Item
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 z-30 bg-white rounded-md shadow-lg ">
                  <a
                    href="/businesscardForm"
                    className="block px-4 py-2 text-gray-800  hover:bg-gray-100 "
                  >
                    Business Card
                  </a>
                  <a
                    href="/addUniformPriceData"
                    className="block px-4 py-2 text-gray-800  hover:bg-gray-100 "
                  >
                    Uniform
                  </a>
                  <a
                    href="/addBillBookPriceData"
                    className="block px-4 py-2 text-gray-800  hover:bg-gray-100 "
                  >
                    Bill Book
                  </a>
                  <a
                    href="/addKeychainPriceData"
                    className="block px-4 py-2 text-gray-800  hover:bg-gray-100 "
                  >
                    Keychain
                  </a>
                  <a
                    href="/addFlyerPriceData"
                    className="block px-4 py-2 text-gray-800  hover:bg-gray-100 "
                  >
                    Flyer
                  </a>
                  <a
                    href="/addWeddingCardPriceData"
                    className="block px-4 py-2 text-gray-800  hover:bg-gray-100 "
                  >
                    Wedding Card
                  </a>

                 
                </div>
              )}
            </li> */}
                        {/* <li>
                            <Link to="/businessCardPriceData" className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700">Add Item</Link>
                        </li> */}
                        
                    </ul>
                </div>
            </div>
            <Toaster/>
        </nav>
    );
};

export default Navbar;
