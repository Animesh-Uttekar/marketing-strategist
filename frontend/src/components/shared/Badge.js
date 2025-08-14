import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'medium',
  className = '',
  ...props 
}) => {
  const baseClasses = 'badge';
  const variantClasses = {
    default: 'badge-default',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    recommended: 'badge-recommended',
    experimental: 'badge-experimental'
  };
  
  const sizeClasses = {
    small: 'badge-sm',
    medium: 'badge-md',
    large: 'badge-lg'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;
