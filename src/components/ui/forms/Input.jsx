import React from 'react';
import {AlertCircle} from 'lucide-react';
import {FieldError, HelperText} from "./index.js";

const Input = ({
                 label,
                 type = 'text',
                 placeholder,
                 value,
                 onChange,
                 error,
                 helperText,
                 required = false,
                 disabled = false,
                 className = '',
                 size = 'md',
                 id,
                 leftIcon,
                 rightIcon,
                 onRightIconClick,
                 rightIconClassName = '',
                 leftIconClassName = '',
                 ...props
               }) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Core classes yang tidak bisa di-override (essential functionality)
  const coreClasses = `
    w-full transition-colors duration-200 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400
  `;

  const errorClasses = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : '';

  // Function untuk mengecek apakah className mengandung class tertentu
  const hasClass = (classNames, targetClass) => {
    return classNames.split(' ').some(cls => cls.includes(targetClass.split('-')[0]));
  };

  // Conditional default classes - hanya apply jika tidak ada override di className
  const getConditionalDefaults = () => {
    const classes = [];

    // Shadow - apply default jika tidak ada shadow class di className
    if (!hasClass(className, 'shadow')) {
      classes.push('shadow-sm');
    }

    // Border - apply default jika tidak ada border class di className
    if (!hasClass(className, 'border-gray') && !hasClass(className, 'border-red')) {
      classes.push('border-gray-300 dark:border-gray-600');
    }

    // Border style - apply default jika tidak ada border class di className
    if (!hasClass(className, 'border') && !className.includes('border-')) {
      classes.push('border');
    }

    // Border radius - apply default jika tidak ada rounded class di className
    if (!hasClass(className, 'rounded')) {
      classes.push('rounded-md');
    }

    return classes.join(' ');
  };

  // Size classes dengan padding adjustment untuk icon
  const getSizeClasses = () => {
    let sizeClass = sizeClasses[size];

    // Override padding jika ada custom py-* di className
    if (hasClass(className, 'py-')) {
      const sizeParts = sizeClasses[size].split(' ');
      sizeClass = sizeParts.filter(cls => cls.startsWith('px-')).join(' ') + ' ' + sizeParts.filter(cls => cls.startsWith('text-')).join(' ');
    }

    // Adjust padding berdasarkan icon yang ada
    if (leftIcon || rightIcon) {
      const sizeParts = sizeClass.split(' ');
      let paddingClass = sizeParts.find(cls => cls.startsWith('px-'));
      let textClass = sizeParts.find(cls => cls.startsWith('text-'));
      let pyClass = sizeParts.find(cls => cls.startsWith('py-'));

      // Jika ada custom pl-* atau pr-* di className, gunakan itu
      if (hasClass(className, 'pl-') || hasClass(className, 'pr-')) {
        return `${pyClass || ''} ${textClass || ''}`;
      }

      // Calculate padding berdasarkan icon
      const leftPadding = leftIcon ?
        (size === 'sm' ? 'pl-8' : size === 'md' ? 'pl-10' : 'pl-12') :
        (paddingClass ? paddingClass.replace('px-', 'pl-') : 'pl-3');

      const rightPadding = rightIcon || error ?
        (size === 'sm' ? 'pr-8' : size === 'md' ? 'pr-10' : 'pr-12') :
        (paddingClass ? paddingClass.replace('px-', 'pr-') : 'pr-3');

      return `${leftPadding} ${rightPadding} ${pyClass || ''} ${textClass || ''}`;
    }

    return sizeClass;
  };

  // Icon positioning
  const getIconPosition = (position) => {
    const basePosition = 'absolute top-1/2 transform -translate-y-1/2 text-gray-400';
    const sizePosition = size === 'sm' ? '1.5' : size === 'md' ? '2' : '2.5';

    if (position === 'left') {
      return `${basePosition} left-${sizePosition}`;
    } else {
      return `${basePosition} right-${sizePosition}`;
    }
  };

  return (
    <div className="">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className={`${getIconPosition('left')} pointer-events-none z-10 ${leftIconClassName}`}>
            {React.cloneElement(leftIcon, {
              className: `${iconSizeClasses[size]} ${leftIcon.props?.className || ''}`
            })}
          </div>
        )}

        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            ${coreClasses}
            ${getSizeClasses()}
            ${getConditionalDefaults()}
            ${errorClasses}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          {...props}
        />

        {/* Right Icon (custom) */}
        {rightIcon && !error && (
          <div
            className={`${getIconPosition('right')} z-10 ${onRightIconClick ? 'cursor-pointer' : 'pointer-events-none'} ${rightIconClassName}`}
            onClick={onRightIconClick}
          >
            {React.cloneElement(rightIcon, {
              className: `${iconSizeClasses[size]} ${rightIcon.props?.className || ''}`
            })}
          </div>
        )}

        {/* Error Icon (prioritas tertinggi) */}
        {error && (
          <div className={`${getIconPosition('right')} pointer-events-none z-20`}>
            <AlertCircle className={`${iconSizeClasses[size]} text-red-500`} />
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

export default Input;