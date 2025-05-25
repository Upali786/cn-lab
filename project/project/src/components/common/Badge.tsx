import React from 'react';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  text, 
  variant = 'primary', 
  size = 'md',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-full font-medium';
  
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-900',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-teal-100 text-teal-800',
  };
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return <span className={classes}>{text}</span>;
};

export default Badge;