// frontend/components/Hero.tsx
import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => (
  <section className="pt-24 pb-12 text-center">
    <motion.h1
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-400 to-yellow-300 bg-clip-text text-transparent"
    >
      Discover Hacker News Trends
    </motion.h1>
    <motion.p
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-4 text-lg text-gray-600 dark:text-gray-300"
    >
      Real-time insights with a smart, vibrant dashboard.
    </motion.p>
  </section>
);

export default Hero;
