
// SalesTableRow Component
import utilityService from "../../../services/utilityServices.js";
import {Eye, Trash2} from "lucide-react";
import React from "react";

const SalesTableRow = ({ sale, onViewDetail, onDeleteSale }) => (
    <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="font-medium text-gray-900">{sale.order_number}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">
                {utilityService.formatDate(sale.sale_date)}
            </div>
            <div className="text-sm text-gray-500">
                {utilityService.formatTime(sale.sale_date)}
            </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">
                {sale.customer || "-"}
            </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-semibold text-green-600">
                {utilityService.formatCurrency(sale.total_price)}
            </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        Selesai
      </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex justify-end space-x-2">
                <button
                    onClick={() => onViewDetail(sale)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                    title="Lihat Detail"
                >
                    <Eye className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onDeleteSale(sale)}
                    className="text-red-600 hover:text-red-900 p-1"
                    title="Hapus"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </td>
    </tr>
);

export default SalesTableRow;