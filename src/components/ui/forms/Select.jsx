import {AlertCircle, ChevronDown} from 'lucide-react';
import {FieldError, HelperText} from "./index.js";
import React from "react";

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
                  size = 'md',
                  id,
                  // Dynamic props untuk options
                  valueKey = 'value',
                  labelKey = 'label',
                  // Optional group support
                  groupKey = null,
                  ...props
                }) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

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
    return option[valueKey];
  };

  // Helper function untuk extract label dari option
  const getOptionLabel = (option) => {
    if (typeof option === 'string' || typeof option === 'number') {
      return option;
    }
    return option[labelKey];
  };

  // Helper function untuk extract group dari option
  const getOptionGroup = (option) => {
    if (!groupKey || typeof option === 'string' || typeof option === 'number') {
      return null;
    }
    return option[groupKey];
  };

  // Group options jika ada groupKey
  const groupedOptions = React.useMemo(() => {
    if (!groupKey) {
      return { '': options };
    }

    return options.reduce((groups, option) => {
      const group = getOptionGroup(option) || 'Other';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(option);
      return groups;
    }, {});
  }, [options, groupKey]);

  const renderOptions = () => {
    // Jika tidak ada grouping, render options biasa
    if (!groupKey) {
      return options.map((option, index) => (
        <option key={index} value={getOptionValue(option)}>
          {getOptionLabel(option)}
        </option>
      ));
    }

    // Jika ada grouping, render dengan optgroup
    return Object.entries(groupedOptions).map(([groupName, groupOptions]) => {
      if (groupName === '') {
        // Options tanpa group
        return groupOptions.map((option, index) => (
          <option key={`no-group-${index}`} value={getOptionValue(option)}>
            {getOptionLabel(option)}
          </option>
        ));
      }

      return (
        <optgroup key={groupName} label={groupName}>
          {groupOptions.map((option, index) => (
            <option key={`${groupName}-${index}`} value={getOptionValue(option)}>
              {getOptionLabel(option)}
            </option>
          ))}
        </optgroup>
      );
    });
  };

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            ${baseClasses}
            ${sizeClasses[size]}
            ${errorClasses}
            ${className}
            pr-10
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {renderOptions()}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>

        {error && (
          <div className="absolute inset-y-0 right-8 flex items-center pr-3 pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>

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

/*
===========================================
USAGE EXAMPLES
===========================================

// 1. Basic usage (backward compatible)
const basicOptions = [
  { value: 'red', label: 'Merah' },
  { value: 'blue', label: 'Biru' },
  { value: 'green', label: 'Hijau' }
];

<Select
  label="Warna"
  options={basicOptions}
  value={selectedColor}
  onChange={(e) => setSelectedColor(e.target.value)}
/>

// 2. Custom value/label keys
const products = [
  { id: 1, name: 'T-Shirt', category: 'Pakaian' },
  { id: 2, name: 'Celana', category: 'Pakaian' },
  { id: 3, name: 'Sepatu', category: 'Alas Kaki' }
];

<Select
  label="Produk"
  options={products}
  valueKey="id"
  labelKey="name"
  value={selectedProduct}
  onChange={(e) => setSelectedProduct(e.target.value)}
/>

// 3. With grouping
<Select
  label="Produk (Grouped)"
  options={products}
  valueKey="id"
  labelKey="name"
  groupKey="category"
  value={selectedProduct}
  onChange={(e) => setSelectedProduct(e.target.value)}
/>

// 4. Simple string/number arrays
const sizes = ['S', 'M', 'L', 'XL'];
const numbers = [1, 2, 3, 4, 5];

<Select
  label="Ukuran"
  options={sizes}
  value={selectedSize}
  onChange={(e) => setSelectedSize(e.target.value)}
/>

<Select
  label="Jumlah"
  options={numbers}
  value={selectedNumber}
  onChange={(e) => setSelectedNumber(e.target.value)}
/>

// 5. Complex data structure (dari database)
const colors = [
  { id: 1, name: 'Merah', hex_code: '#ff0000', created_at: '2024-01-01' },
  { id: 2, name: 'Biru', hex_code: '#0000ff', created_at: '2024-01-02' }
];

<Select
  label="Warna"
  options={colors}
  valueKey="id"
  labelKey="name"
  value={formData.color_id}
  onChange={(e) => setFormData({...formData, color_id: e.target.value})}
  placeholder="Pilih warna"
  required
/>

// 6. Nested object properties
const users = [
  { id: 1, profile: { name: 'John Doe' }, department: { name: 'IT' } },
  { id: 2, profile: { name: 'Jane Smith' }, department: { name: 'HR' } }
];

// For nested properties, you can use dot notation or custom getter
<Select
  label="User"
  options={users}
  valueKey="id"
  labelKey={(user) => user.profile.name} // Custom getter function
  groupKey={(user) => user.department.name} // Custom getter function
  value={selectedUser}
  onChange={(e) => setSelectedUser(e.target.value)}
/>

// 7. Migration examples untuk project ini

// ConvectionForm.jsx - Before:
<select
  value={convection.color_id}
  onChange={(e) => handleInputChange("color_id", e.target.value)}
  className="w-full md:w-2/3 xl:w-5/6 p-3 border..."
>
  <option value="">Pilih Warna</option>
  {colors.map(color => (
    <option key={color.id} value={color.id}>
      {color.name}
    </option>
  ))}
</select>

// ConvectionForm.jsx - After:
<Select
  label="Warna"
  options={colors}
  valueKey="id"
  labelKey="name"
  value={convection.color_id}
  onChange={(e) => handleInputChange("color_id", e.target.value)}
  placeholder="Pilih Warna"
  required
/>

// AddProductModal.jsx - Before:
<select
  value={product.category}
  onChange={(e) => setProduct({...product, category: e.target.value})}
  className="w-full p-3 border..."
>
  <option value="">Pilih Kategori</option>
  {categories.map(category => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ))}
</select>

// AddProductModal.jsx - After:
<Select
  label="Kategori"
  options={categories}
  valueKey="id"
  labelKey="name"
  value={product.category}
  onChange={(e) => setProduct({...product, category: e.target.value})}
  placeholder="Pilih Kategori"
  required
  disabled={loading}
/>
*/