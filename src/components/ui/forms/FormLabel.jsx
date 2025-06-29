// src/components/ui/forms/FormLabel.jsx
const FormLabel = ({ children, required = false, htmlFor, className = '' }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default FormLabel;