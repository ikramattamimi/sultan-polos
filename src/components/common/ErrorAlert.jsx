import { AlertCircle, X } from "lucide-react";

// ErrorAlert Component
const ErrorAlert = ({ message, onClose }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
    <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
    <span className="text-red-700">{message}</span>
    <button
      onClick={onClose}
      className="ml-auto text-red-500 hover:text-red-700"
    >
      <X className="h-4 w-4" />
    </button>
  </div>
);

export default ErrorAlert;