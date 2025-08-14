import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium',
  color = 'primary',
  className = '',
  ...props 
}) => {
  const baseClasses = 'loading-spinner';
  const sizeClasses = {
    small: 'loading-spinner-sm',
    medium: 'loading-spinner-md',
    large: 'loading-spinner-lg'
  };
  
  const colorClasses = {
    primary: 'loading-spinner-primary',
    secondary: 'loading-spinner-secondary',
    white: 'loading-spinner-white'
  };

  const classes = [
    baseClasses,
    sizeClasses[size],
    colorClasses[color],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props} />
  );
};

export default LoadingSpinner;
