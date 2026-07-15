import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  className = '',
  variant = 'primary',
  disabled = false,
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold rounded-sm focus-ring transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variants = {
    primary:
      'bg-text-primary text-surface hover:opacity-90 shadow-none active:scale-[0.98]',
    secondary:
      'bg-surface text-text-primary border border-border-light hover:bg-border-light/50 active:scale-[0.98]',
    outline:
      'bg-transparent border border-border-light hover:bg-border-light/50 text-text-primary active:scale-[0.98]',
    text: 'text-text-muted hover:text-text-primary hover:bg-border-light/30 px-3.5 py-2',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};
