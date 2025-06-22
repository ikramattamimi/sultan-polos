
import {useState} from "react";
import utilityService from "../../services/UtilityServices.js";
import {Download, X} from "lucide-react";

const ExportModal = ({ sales, onClose }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);

      let filteredSales = [...sales];

      // Filter berdasarkan tanggal jika ada
      if (dateRange.startDate || dateRange.endDate) {
        filteredSales = sales.filter(sale => {
          const saleDate = new Date(sale.sale_date);

          if (dateRange.startDate) {
            const startDate = new Date(dateRange.startDate);
            if (saleDate < startDate) return false;
          }

          if (dateRange.endDate) {
            const endDate = new Date(dateRange.endDate);
            endDate.setHours(23, 59, 59, 999);
            if (saleDate > endDate) return false;
          }

          return true;
        });
      }

      if (exportFormat === 'csv') {
        exportToCSV(filteredSales);
      } else if (exportFormat === 'pdf') {
        exportToPDF(filteredSales);
      }

      onClose();
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Gagal melakukan export. Silakan coba lagi.');
    } finally {
      setExporting(false);
    }
  };

  const exportToCSV = (data) => {
    const headers = [
      'Nomor Order',
      'Tanggal',
      'Pelanggan',
      'Total',
      'Status'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(sale => [
        sale.order_number,
        utilityService.formatDate(sale.sale_date),
        sale.customer || 'Customer Umum',
        sale.total_price,
        'Selesai'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `laporan-penjualan-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // Implementasi export PDF (bisa menggunakan library seperti jsPDF)
    alert('Fitur export PDF akan segera hadir!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Export Data Penjualan
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Format Export */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format Export
              </label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rentang Tanggal (Opsional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tanggal mulai"
                />
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tanggal akhir"
                />
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                {sales.length} data penjualan akan di-export
                {(dateRange.startDate || dateRange.endDate) && ' (dengan filter tanggal)'}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              disabled={exporting}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;