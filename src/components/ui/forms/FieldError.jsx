
// src/components/ui/forms/FieldError.jsx
const FieldError = ({ children, className = '' }) => {
  if (!children) return null;

  return (
    <p className={`mt-1 text-sm text-red-600 dark:text-red-400 ${className}`}>
      {children}
    </p>
  );
};

export default FieldError;