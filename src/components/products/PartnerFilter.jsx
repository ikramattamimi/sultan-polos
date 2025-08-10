import React from 'react';
import Select from '../ui/forms/Select.jsx';

const options = [
  // { value: 'all', label: 'Filter Mitra' },
  { value: 'with', label: 'Dengan Mitra' },
  { value: 'without', label: 'Tanpa Mitra' },
];

const PartnerFilter = ({ value = 'all', onChange, className = '', size = 'md' }) => {
  return (
    <div className={className}>
      <Select
        options={options}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Filter Mitra"
        size={size}
        className="md:w-56 h-full"
        marginBottom={false}
      />
    </div>
  );
};

export default PartnerFilter;