import React from 'react';

const Input = ({
  placeholder = "placeholder",
  type = "text",
  className = "input",
  value,
  id = placeholder,
  onChange,
  label = placeholder,
  required = false
}) =>
{

  return (
    <div>
      <div className="my-4 flex flex-wrap items-center">
        <label htmlFor={id} className='text-sm font-medium mb-2 inline-block w-full md:w-1/3 xl:w-1/6'>
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
        <input
          id={id}
          type={type}
          className={className}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default Input;