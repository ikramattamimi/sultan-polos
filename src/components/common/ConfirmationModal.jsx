import React from 'react';
import {AlertTriangle, CheckCircle} from "lucide-react";


// ===========================================
// CONFIRMATION MODAL
// ===========================================

const ConfirmationModal = ({
   title,
   message,
   onConfirm,
   onCancel,
   confirmText = 'Konfirmasi',
   cancelText = 'Batal',
   type = 'default'
}) => {
    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: AlertTriangle,
                    iconColor: 'text-red-600',
                    buttonColor: 'bg-red-600 hover:bg-red-700'
                };
            case 'warning':
                return {
                    icon: AlertTriangle,
                    iconColor: 'text-yellow-600',
                    buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
                };
            default:
                return {
                    icon: CheckCircle,
                    iconColor: 'text-blue-600',
                    buttonColor: 'bg-blue-600 hover:bg-blue-700'
                };
        }
    };

    const { icon: Icon, iconColor, buttonColor } = getTypeStyles();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <Icon className={`h-6 w-6 ${iconColor} mr-3`} />
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    </div>

                    <p className="text-gray-600 mb-6">{message}</p>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 text-white rounded-lg transition-colors ${buttonColor}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ConfirmationModal;