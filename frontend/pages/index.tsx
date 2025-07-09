// pages/index.tsx
import React from 'react';
import Dashboard from '../components/Dashboard';

const HomePage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
    <main className="w-11/12 max-w-7xl mx-auto py-8 px-4">
      <Dashboard />
    </main>
  </div>
);

export default HomePage;
