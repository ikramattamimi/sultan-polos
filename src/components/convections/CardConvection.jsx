import React from 'react';
import { Link } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";
import { formatPrice } from "../../common.js";

const CardConvection = ({ convection: { id, name, category, purchase_price, stock }, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden group">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {category && (
              <span className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium mb-2">
                {category}
              </span>
            )}
            <Link to={id?.toString()} className="block">
              <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors mb-1 line-clamp-1">
                {name}
              </h3>
            </Link>
            <p className="text-base font-semibold text-green-600">
              {formatPrice(purchase_price)}
            </p>
          </div>

          {/* Action buttons - show on hover */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                onEdit?.();
              }}
              className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              title="Edit"
            >
              <Edit2 className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete?.();
              }}
              className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              title="Hapus"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">Stock:</span>
          <span className="text-sm font-bold text-gray-900">{stock}</span>
        </div>
      </div>
    </div>
  );
};

export default CardConvection;