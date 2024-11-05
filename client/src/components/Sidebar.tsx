import { useState } from "react";
import logo from "../assets/logosample1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsProgress, faXmark } from "@fortawesome/free-solid-svg-icons";

const navLinks = [
  {
    name: "History",
  },
  {
    name: "Calendar",
  },
  {
    name: "Profile",
  },
  {
    name: "About Us",
  },
];

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <header className="flex justify-between items-center text-black px-16 bg-vanilla drop-shadow-md h-16">
        <button onClick={toggleMenu} className="text-2xl">
          <FontAwesomeIcon icon={faBarsProgress} />
        </button>
      </header>

      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform transform flex-col px-4 py-2 flex z-10 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button onClick={toggleMenu} className=" text-2xl w-min self-end">
          <FontAwesomeIcon icon={faXmark} color="black" />
        </button>

        <nav className="flex flex-col items-start p-6 text-black">
          {navLinks.map(({ name }) => {
            return (
              <a
                href="#"
                className="py-2 px-2 text-lg font-semibold hover:bg-gray-200 w-full rounded-md"
              >
                {name}
              </a>
            );
          })}
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
