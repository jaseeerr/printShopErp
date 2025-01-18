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
           
            <div className="max-w-screen-xl flex flex-wrap items-center justify-center mx-auto p-4">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse ">
                    <img src={logo} className="w-52" alt="Flowbite Logo" />
                    {/* <span className="self-center text-2xl font-semibold whitespace-nowrap ">Print Shop ERP</span> */}
                </a>
              
            </div>
            <Toaster/>
        </nav>
    );
};

export default Navbar;
