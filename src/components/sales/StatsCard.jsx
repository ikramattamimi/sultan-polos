
// StatsCard Component
import {Filter} from "lucide-react";
import React from "react";
import UtilityService from "../../services/UtilityServices.js";

const StatsCard = ({ title, value, icon: Icon, color, format }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  };

  const formatValue = (val) => {
    if (format === "currency") {
      return UtilityService.formatCurrency(val);
    }
    return val.toLocaleString("id-ID");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatValue(value)}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard