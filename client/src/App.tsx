import { useState } from "react";
import logo from "./assets/logosample1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsProgress, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full h-full absolute bg-gradient-to-l from-orange-400 to-blue-400">
      <header className="flex justify-between items-center text-black py-3 px-4 md:px-8 lg:px-32 bg-white drop-shadow-md h-16">
        <button onClick={toggleMenu} className="md:hidden text-2xl">
          <FontAwesomeIcon icon={faBarsProgress} />
        </button>

        <a href="#">
          <img
            src={logo}
            alt="logo"
            className="w-24 md:w-32 lg:w-40 h-auto transition-all"
          />
        </a>

        <ul className="hidden md:flex items-center gap-6 font-semibold text-base">
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
        </ul>

        <div className="relative hidden md:flex items-center justify-center gap-3">
          <i className="bx bx-calendar"></i>
          <input
            type="date"
            className="py-2 pl-3 rounded-xl border-2 border-pink-300 focus:bg-slate-100 focus:outline-sky-500"
          />
        </div>
      </header>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform transform z-10 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-4 right-4 text-2xl"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <nav className="flex flex-col items-start p-6 text-black">
          <a
            href="#"
            className="py-2 text-lg font-semibold hover:bg-gray-200 w-full rounded-md"
          >
            History
          </a>
          <a
            href="#"
            className="py-2 text-lg font-semibold hover:bg-gray-200 w-full rounded-md"
          >
            Calendar
          </a>
          <a
            href="#"
            className="py-2 text-lg font-semibold hover:bg-gray-200 w-full rounded-md"
          >
            Profile
          </a>
          <a
            href="#"
            className="py-2 text-lg font-semibold hover:bg-gray-200 w-full rounded-md"
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
}
