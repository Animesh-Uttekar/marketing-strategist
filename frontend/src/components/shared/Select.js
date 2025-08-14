import React from 'react';

const Select = ({ 
  label,
  options = [],
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  placeholder = 'Select an option...',
  className = '',
  ...props 
}) => {
  const selectClasses = [
    'form-select',
    error && 'form-select-error',
    disabled && 'form-select-disabled',
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
      <select
        className={selectClasses}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="form-error">
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;
