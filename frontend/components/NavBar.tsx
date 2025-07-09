// frontend/components/NavBar.tsx
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { FaRegSun, FaRegMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';

const NavBar: React.FC = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full z-30 backdrop-blur bg-white/60 dark:bg-gray-900/60"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
          HN Analytics
        </span>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        >
          {darkMode ? <FaRegSun /> : <FaRegMoon />}
        </button>
      </div>
    </motion.nav>
  );
};

export default NavBar;
