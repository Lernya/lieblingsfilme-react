import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow p-4">
      <div className="max-w-7xl mx-auto flex justify-around items-center">
        <nav>
          <ul className="flex p-2 space-x-2">
            <li>
              <Link to="/" className="text-gray-700 hover:text-blue-500">
                Home
              </Link>
            </li>
            <li>
              <Link to="/journal" className="text-gray-700 hover:text-blue-500">
                Journal
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
