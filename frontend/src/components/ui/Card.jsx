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
      whileHover={animateHover ? { backgroundColor: "var(--background)" } : undefined}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={`bg-surface rounded-md p-6 border border-border-light shadow-none transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
