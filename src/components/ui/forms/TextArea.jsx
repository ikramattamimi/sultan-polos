import {AlertCircle} from "lucide-react";
import {FieldError, HelperText} from "./index.js";
import React from "react";

const TextArea = ({
                    label,
                    placeholder,
                    value,
                    onChange,
                    error,
                    helperText,
                    required = false,
                    disabled = false,
                    rows = 4,
                    className = '',
                    size = 'md',
                    id,
                    ...props
                  }) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  };

  const baseClasses = `
    w-full border rounded-md shadow-sm transition-colors duration-200 resize-vertical
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400
  `;

  const errorClasses = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 dark:border-gray-600';

  return (
    <div className="form-group">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <textarea
          id={textareaId}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          rows={rows}
          className={`
            ${baseClasses}
            ${sizeClasses[size]}
            ${errorClasses}
            ${className}
          `}
          {...props}
        />

        {error && (
          <div className="absolute top-2 right-0 pr-3 flex items-start pointer-events-none">
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

export default TextArea;