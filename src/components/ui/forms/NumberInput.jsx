import {AlertCircle, Minus, Plus} from 'lucide-react';
import {FieldError, HelperText} from "./index.js";
import React from "react";

const NumberInput = ({
                       label,
                       value,
                       onChange,
                       error,
                       helperText,
                       min,
                       max,
                       step = 1,
                       required = false,
                       disabled = false,
                       showControls = false,
                       className = '',
                       size = 'md',
                       id,
                       ...props
                     }) => {
  const numberId = id || `number-${Math.random().toString(36).substr(2, 9)}`;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  };

  const baseClasses = `
    w-full border rounded-md shadow-sm transition-colors duration-200 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400
  `;

  const errorClasses = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 dark:border-gray-600';

  const handleIncrement = () => {
    const newValue = (parseFloat(value) || 0) + step;
    if (max === undefined || newValue <= max) {
      onChange({ target: { value: newValue.toString() } });
    }
  };

  const handleDecrement = () => {
    const newValue = (parseFloat(value) || 0) - step;
    if (min === undefined || newValue >= min) {
      onChange({ target: { value: newValue.toString() } });
    }
  };

  return (
    <div className="form-group">
      {label && (
        <label
          htmlFor={numberId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={numberId}
          type="number"
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          required={required}
          className={`
            ${baseClasses}
            ${sizeClasses[size]}
            ${errorClasses}
            ${showControls ? 'pr-16' : 'pr-10'}
            ${className}
          `}
          {...props}
        />

        {showControls && !disabled && (
          <div className="absolute inset-y-0 right-0 flex">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={min !== undefined && (parseFloat(value) || 0) <= min}
              className="px-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={max !== undefined && (parseFloat(value) || 0) >= max}
              className="px-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>

      {error && (
        <FieldError children={error} />
      )}

      {helperText && !error && (
        <HelperText children={helperText} />
      )}
    </div>
  );
};

export default NumberInput;
