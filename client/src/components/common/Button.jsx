import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick, 
  type = 'button',
  fullWidth = false,
  disabled = false,
  icon = null
}) => {
  return (
    <button 
      className={`
        button 
        ${variant} 
        ${size} 
        ${fullWidth ? 'full-width' : ''}
        ${disabled ? 'disabled' : ''}
      `}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {icon && <i className={`fas ${icon}`}></i>}
      <span>{children}</span>
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onClick: PropTypes.func,
  type: PropTypes.string,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.string
};

export default Button; 