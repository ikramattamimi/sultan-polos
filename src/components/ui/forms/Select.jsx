import {AlertCircle, ChevronDown, Search} from 'lucide-react';
import React, { useState, useRef, useEffect, useMemo } from "react";

const Select = ({
  label,
  options = [],
  value,
  onChange,
  error,
  helperText,
  placeholder = 'Pilih option',
  required = false,
  disabled = false,
  className = '',
  marginBottom = true,
  size = 'md',
  id,
  valueKey = 'value',
  labelKey = 'label',
  renderOption,
  renderSelected, // Tambahkan prop baru
  searchable = true,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

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
    appearance-none cursor-pointer
  `;

  const errorClasses = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 dark:border-gray-600';

  // Helper function untuk extract value dari option
  const getOptionValue = (option) => {
    if (typeof option === 'string' || typeof option === 'number') {
      return option;
    }
    return typeof valueKey === 'function' ? valueKey(option) : option[valueKey];
  };

  // Helper function untuk extract label dari option
  const getOptionLabel = (option) => {
    if (typeof option === 'string' || typeof option === 'number') {
      return option;
    }
    return typeof labelKey === 'function' ? labelKey(option) : option[labelKey];
  };

  // Filter options by search
  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter(option => {
      const label = getOptionLabel(option);
      return label?.toString().toLowerCase().includes(search.toLowerCase());
    });
  }, [options, search, labelKey]);

  // Handle click outside to close dropdown
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Get selected option object
  const selectedOption = options.find(opt => getOptionValue(opt) === value);

  return (
    <div className={`${marginBottom ? 'mb-4' : ''} relative`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <button
        type="button"
        id={selectId}
        className={`
          ${baseClasses}
          ${sizeClasses[size]}
          ${errorClasses}
          ${className}
          pr-10 flex items-center justify-between
        `}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((v) => !v)}
      >
        <span className={selectedOption ? '' : 'text-gray-400'}>
          {selectedOption
            ? (renderSelected
                ? renderSelected(selectedOption)
                : (renderOption
                    ? renderOption(selectedOption)
                    : getOptionLabel(selectedOption)))
            : placeholder}
        </span>
        <ChevronDown className="h-5 w-5 text-gray-400 ml-2" />
      </button>
      {open && (
        <div
          ref={dropdownRef}
          className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg"
        >
          {searchable && (
            <div className="relative p-2 border-b border-gray-100 dark:border-gray-600">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Cari..."
                autoFocus
                disabled={disabled}
              />
              <Search className="absolute right-4 top-5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          )}
          <ul
            tabIndex={-1}
            role="listbox"
            className="max-h-56 overflow-auto py-1"
          >
            {filteredOptions.length === 0 && (
              <li className="px-4 py-2 text-gray-400 text-sm">Tidak ditemukan</li>
            )}
            {filteredOptions.map((option, idx) => (
              <li
                key={getOptionValue(option)}
                role="option"
                aria-selected={getOptionValue(option) === value}
                className={`px-4 py-2 cursor-pointer flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900 ${
                  getOptionValue(option) === value
                    ? 'bg-blue-100 dark:bg-blue-800 font-semibold'
                    : ''
                }`}
                onClick={() => {
                  if (disabled) return;
                  onChange({
                    target: {
                      value: getOptionValue(option),
                    },
                  });
                  setOpen(false);
                  setSearch('');
                }}
              >
                {renderOption ? renderOption(option) : getOptionLabel(option)}
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Select;