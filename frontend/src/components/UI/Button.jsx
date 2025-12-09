import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  className = '',
  type = 'button',
  icon: Icon,
  ...props 
}) => {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost'
  };
  
  const sizeClasses = {
    small: 'btn-sm',
    medium: 'btn-md',
    large: 'btn-lg'
  };
  
  return (
    <button
      type={type}
      className={`btn ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon size={16} className="btn-icon" />}
      {children}
    </button>
  );
};

export default Button;