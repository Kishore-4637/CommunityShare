import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl select-none';

  const variants = {
    primary: 'bg-forest-800 text-white hover:bg-forest-900 active:bg-forest-950 focus:ring-forest-600 shadow-sm hover:shadow',
    secondary: 'bg-forest-50 text-forest-800 hover:bg-forest-100 active:bg-forest-200 border border-forest-200/60 focus:ring-forest-500',
    sage: 'bg-sage-100 text-forest-900 hover:bg-sage-200 active:bg-sage-300 border border-sage-300/50 focus:ring-sage-400',
    outline: 'bg-transparent text-charcoal-700 hover:bg-warmgray-100 active:bg-warmgray-200 border border-warmgray-300 focus:ring-forest-500',
    ghost: 'bg-transparent text-charcoal-700 hover:bg-forest-50 hover:text-forest-800 focus:ring-forest-500',
    danger: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 active:bg-rose-200 focus:ring-rose-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 font-medium',
    md: 'text-sm px-4 py-2.5 gap-2 font-medium',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  return (
    <motion.button
      type={type}
      whileHover={disabled || isLoading ? {} : { scale: 1.015 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.985 }}
      transition={{ duration: 0.15 }}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${disabled || isLoading ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 text-current" />}
          {children}
        </>
      )}
    </motion.button>
  );
};
