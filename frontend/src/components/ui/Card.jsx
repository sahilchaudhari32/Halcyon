import React from 'react';
import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  animateHover = true,
  ...props
}) {
  return (
    <motion.div
      whileHover={animateHover ? { y: -3, scale: 1.005 } : undefined}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`bg-surface dark:bg-glass-gradient-dark dark:backdrop-blur-md rounded-3xl p-8 border border-border-light shadow-md transition-all duration-300 ${
        animateHover ? 'hover:shadow-md-hover' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
