const HelperText = ({ children, className = '' }) => {
  if (!children) return null;

  return (
    <p className={`mt-1 text-sm text-gray-500 dark:text-gray-400 ${className}`}>
      {children}
    </p>
  );
};

export default HelperText;