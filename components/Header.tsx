
import React from 'react';
import { Link } from 'react-router-dom';

const ShieldIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8"
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0V6zM12 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
      clipRule="evenodd"
    />
    <path d="M12 1.5a10.5 10.5 0 100 21 10.5 10.5 0 000-21zM11.13 8.13a.75.75 0 011.06 0l3.75 3.75a.75.75 0 11-1.06 1.06L12.5 10.56V16.5a.75.75 0 01-1.5 0v-5.94l-2.44 2.44a.75.75 0 01-1.06-1.06l3.75-3.75z" />
  </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-brand-blue-600 text-white">
                <ShieldIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-bold text-brand-blue-800 tracking-tight">NC Insurance Expert</span>
                <span className="text-sm text-gray-500">Statement of No Loss Portal</span>
            </div>
          </Link>
          <nav className="text-sm font-medium text-gray-500 hover:text-brand-blue-600">
            <Link to="/agent">Agent Portal</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
