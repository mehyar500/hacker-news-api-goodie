// pages/index.tsx
import React from 'react';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Dashboard from '../components/Dashboard';

const HomePage: React.FC = () => (
  <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
    <NavBar />
    <Hero />
    <Dashboard />
  </div>
);

export default HomePage;
