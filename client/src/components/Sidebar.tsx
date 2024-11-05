import { useState } from "react";
import logo from "../assets/logosample1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsProgress, faXmark } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <header className="flex justify-between items-center text-black px-16 bg-white drop-shadow-md h-16">
        <button onClick={toggleMenu} className="text-2xl">
          <FontAwesomeIcon icon={faBarsProgress} />
        </button>

        {/* <a href="#">
          <img
            src={logo}
            alt="logo"
            className="w-24 md:w-32 lg:w-40 h-auto transition-all"
          />
        </a> */}

        {/* <ul className="hidden md:flex items-center gap-6 font-semibold text-base">
          <li className="p-2 hover:bg-gray-400 hover:text-white rounded-md transition-all cursor-pointer">
            Home
          </li>
          <li className="p-2 hover:bg-gray-400 hover:text-white rounded-md transition-all cursor-pointer">
            History
          </li>
          <li className="p-2 hover:bg-gray-400 hover:text-white rounded-md transition-all cursor-pointer">
            Profile
          </li>
          <li className="p-2 hover:bg-gray-400 hover:text-white rounded-md transition-all cursor-pointer">
            About Us
          </li>
        </ul> */}

        
      </header>

      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform transform flex-col px-4 py-2 flex z-10 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={toggleMenu}
          className=" text-2xl w-min self-end"
        >
          <FontAwesomeIcon
          
          icon={faXmark} />
        </button>

        <nav className="flex flex-col items-start p-6 text-black">
          <a
            href="#"
            className="py-2 px-2 text-lg font-semibold hover:bg-gray-200 w-full rounded-md"
          >
            History
          </a>
          <a
            href="#"
            className="py-2 px-2 text-lg font-semibold hover:bg-gray-200 w-full rounded-md"
          >
            Calendar
          </a>
          <a
            href="#"
            className="py-2 px-2 text-lg font-semibold hover:bg-gray-200 w-full rounded-md"
          >
            Profile
          </a>
          <a
            href="#"
            className="py-2 px-2 text-lg font-semibold hover:bg-gray-200 w-full rounded-md"
          >
            About Us
          </a>
        </nav>
      </div>

      {isMenuOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black bg-opacity-50 "
        />
      )}
    </div>
  );
};

export default Sidebar;
