import React from 'react';

const Input = ({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  icon,
  className = '',
  ...props 
}) => {
  const inputClasses = [
    'form-input',
    error && 'form-input-error',
    disabled && 'form-input-disabled',
    icon && 'form-input-with-icon',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="input-container">
        {icon && (
          <span className="input-icon">
            {icon}
          </span>
        )}
        <input
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...props}
        />
      </div>
      {error && (
        <span className="form-error">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
