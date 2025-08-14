import React from 'react';

const TextArea = ({ 
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  rows = 4,
  className = '',
  ...props 
}) => {
  const textareaClasses = [
    'form-textarea',
    error && 'form-textarea-error',
    disabled && 'form-textarea-disabled',
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
      <textarea
        className={textareaClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        rows={rows}
        {...props}
      />
      {error && (
        <span className="form-error">
          {error}
        </span>
      )}
    </div>
  );
};

export default TextArea;
