import React from 'react';
import './Card.css';

const Card = ({ children, className = '', padding = 'medium', ...props }) => {
  const paddingClasses = {
    none: 'p-0',
    small: 'p-2',
    medium: 'p-4',
    large: 'p-6'
  };
  
  return (
    <div className={`card ${paddingClasses[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;