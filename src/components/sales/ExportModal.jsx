import {useEffect, useState} from "react";
import UtilityService from "../../services/UtilityServices.js";
import {Download, X} from "lucide-react";
import {jsPDF} from 'jspdf';
import {autoTable} from 'jspdf-autotable';

const ExportModal = ({ sales, onClose }) => {
  const [exportFormat, setExportFormat] = useState('excel');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [exporting, setExporting] = useState(false);
  const [filteredCount, setFilteredCount] = useState(sales.length);

  // Update filtered count whenever date range changes
  useEffect(() => {
    let filtered = [...sales];

    // Filter berdasarkan tanggal jika ada
    if (dateRange.startDate || dateRange.endDate) {
      filtered = sales.filter(sale => {
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

    setFilteredCount(filtered.length);
  }, [dateRange, sales]);

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

      if (exportFormat === 'excel') {
        exportToExcel(filteredSales);
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

  const exportToExcel = (data) => {
    try {
      // Calculate summary data
      const totalRevenue = data.reduce((sum, sale) => sum + (sale.total_price || 0), 0);
      const avgTransaction = data.length > 0 ? totalRevenue / data.length : 0;

      // Prepare items data
      const itemsData = [];
      let itemNo = 1;

      data.forEach(sale => {
        if (sale.sale_items && sale.sale_items.length > 0) {
          sale.sale_items.forEach(item => {
            const printPrice = item.is_printed && item.print_types ? item.print_types.price : 0;
            const totalItemPrice = (item.unit_price * item.quantity) + (printPrice * item.quantity);

            itemsData.push({
              no: itemNo++,
              orderNumber: sale.order_number || '',
              productName: item.product_variants?.products?.name || '',
              category: item.product_variants?.products?.categories?.name || '',
              size: item.product_variants?.sizes?.name || '',
              quantity: item.quantity || 0,
              unitPrice: item.unit_price || 0,
              isPrinted: item.is_printed ? 'Ya' : 'Tidak',
              printType: item.is_printed && item.print_types ? item.print_types.name : '',
              printPrice: printPrice,
              totalPrice: totalItemPrice
            });
          });
        }
      });

      // Create Excel content using HTML table approach
      const excelContent = createExcelHTMLContent(data, totalRevenue, avgTransaction, itemsData);

      // Generate filename
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `laporan-penjualan-${timestamp}.xls`;

      // Create and download file
      downloadExcelFile(excelContent, filename);

      // Success notification
      // alert(`File Excel berhasil di-export: ${filename}`);

    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw new Error('Gagal export ke Excel: ' + error.message);
    }
  };

  const createExcelHTMLContent = (data, totalRevenue, avgTransaction, itemsData) => {
    // Excel HTML template with proper number formatting
    return `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:x="urn:schemas-microsoft-com:office:excel" 
            xmlns="http://www.w3.org/TR/REC-html40" lang="">
        <head>
          <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Laporan Penjualan</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
          <style>
            .header { 
              background-color: #366092; 
              color: white; 
              font-weight: bold; 
              text-align: center;
              padding: 8px;
            }
            .subheader {
              background-color: #4472C4;
              color: white;
              font-weight: bold;
              padding: 6px;
            }
            .summary-label {
              background-color: #E7E6E6;
              font-weight: bold;
              padding: 6px;
            }
            .even-row { 
              background-color: #F2F2F2; 
            }
            .odd-row { 
              background-color: #FFFFFF; 
            }
            .currency { 
              text-align: right;
              mso-number-format: "#,##0";
            }
            .number { 
              text-align: center;
              mso-number-format: "0";
            }
            .center { text-align: center; }
            .border { border: 1px solid #B7B7B7; }
            td { 
              padding: 4px; 
              border: 1px solid #B7B7B7;
              mso-number-format: "@";  /* Default text format */
            }
          </style>
        </head>
        <body>
          <!-- Ringkasan -->
          
          <!-- Ringkasan -->
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td colspan="2" class="header">LAPORAN PENJUALAN</td>
            </tr>
            <tr>
              <td class="summary-label">Periode:</td>
              <td>${dateRange.startDate && dateRange.endDate ?
      `${UtilityService.formatDate(dateRange.startDate)} - ${UtilityService.formatDate(dateRange.endDate)}` :
      'Semua Data'}</td>
            </tr>
            <tr>
              <td class="summary-label">Tanggal Export:</td>
              <td>${UtilityService.formatDate(new Date().toISOString())}</td>
            </tr>
            <tr><td colspan="2"></td></tr>
            <tr>
              <td colspan="2" class="subheader">RINGKASAN</td>
            </tr>
            <tr>
              <td class="summary-label">Total Transaksi:</td>
              <td style="text-align: center; mso-number-format: '0';">${data.length}</td>
            </tr>
            <tr>
              <td class="summary-label">Total Revenue:</td>
              <td style="text-align: right; mso-number-format: '#,##0';">${totalRevenue}</td>
            </tr>
            <tr>
              <td class="summary-label">Rata-rata per Transaksi:</td>
              <td style="text-align: right; mso-number-format: '#,##0';">${Math.round(avgTransaction)}</td>
            </tr>
          </table>

          <br><br>

          <!-- Detail Penjualan -->
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td colspan="7" class="header">DETAIL PENJUALAN</td>
            </tr>
            <tr class="subheader">
              <td class="center">No</td>
              <td class="center">Nomor Order</td>
              <td class="center">Tanggal</td>
              <td class="center">Pelanggan</td>
              <td class="center">Total Harga</td>
              <td class="center">Status</td>
              <td class="center">Jumlah Item</td>
            </tr>
            ${data.map((sale, index) => {
      const rowClass = (index + 1) % 2 === 0 ? 'even-row' : 'odd-row';
      return `
                <tr class="${rowClass}">
                  <td style="text-align: center; mso-number-format: '0';">${index + 1}</td>
                  <td style="mso-number-format: '@';">${sale.order_number || ''}</td>
                  <td style="mso-number-format: '@';">${UtilityService.formatDate(sale.sale_date)}</td>
                  <td style="mso-number-format: '@';">${sale.customer || 'Customer Umum'}</td>
                  <td style="text-align: right; mso-number-format: '#,##0';">${sale.total_price || 0}</td>
                  <td style="text-align: center; mso-number-format: '@';">Selesai</td>
                  <td style="text-align: center; mso-number-format: '0';">${sale.sale_items?.length || 0}</td>
                </tr>
              `;
    }).join('')}
          </table>

          ${itemsData.length > 0 ? `
            <br><br>

            <!-- Detail Item -->
            <table style="border-collapse: collapse; width: 100%;">
              <tr>
                <td colspan="11" class="header">DETAIL ITEM</td>
              </tr>
              <tr class="subheader">
                <td class="center">No</td>
                <td class="center">Order</td>
                <td class="center">Produk</td>
                <td class="center">Kategori</td>
                <td class="center">Ukuran</td>
                <td class="center">Qty</td>
                <td class="center">Harga Satuan</td>
                <td class="center">Print</td>
                <td class="center">Jenis Print</td>
                <td class="center">Harga Print</td>
                <td class="center">Total</td>
              </tr>
              ${itemsData.map((item, index) => {
      const rowClass = (index + 1) % 2 === 0 ? 'even-row' : 'odd-row';
      return `
                  <tr class="${rowClass}">
                    <td style="text-align: center; mso-number-format: '0';">${item.no}</td>
                    <td style="mso-number-format: '@';">${item.orderNumber}</td>
                    <td style="mso-number-format: '@';">${item.productName}</td>
                    <td style="mso-number-format: '@';">${item.category}</td>
                    <td style="mso-number-format: '@';">${item.size}</td>
                    <td style="text-align: center; mso-number-format: '0';">${item.quantity}</td>
                    <td style="text-align: right; mso-number-format: '#,##0';">${item.unitPrice}</td>
                    <td style="text-align: center; mso-number-format: '@';">${item.isPrinted}</td>
                    <td style="mso-number-format: '@';">${item.printType}</td>
                    <td style="text-align: right; mso-number-format: '#,##0';">${item.printPrice}</td>
                    <td style="text-align: right; mso-number-format: '#,##0';">${item.totalPrice}</td>
                  </tr>
                `;
    }).join('')}
            </table>
          ` : ''}
        </body>
                  
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
          }
          .header { 
            background-color: #366092; 
            color: white; 
            font-weight: bold; 
            text-align: center;
            padding: 8px;
          }
          .subheader {
            background-color: #4472C4;
            color: white;
            font-weight: bold;
            padding: 6px;
          }
          .summary-label {
            background-color: #E7E6E6;
            font-weight: bold;
            padding: 6px;
          }
          .even-row { 
            background-color: #F2F2F2; 
          }
          .odd-row { 
            background-color: #FFFFFF; 
          }
          .currency { 
            text-align: right;
            mso-number-format: "#,##0";
          }
          .number { 
            text-align: center;
            mso-number-format: "0";
          }
          .center { text-align: center; }
          .border { border: 1px solid #B7B7B7; }
          td { 
            padding: 4px; 
            border: 1px solid #B7B7B7;
            mso-number-format: "@";  /* Default text format */
          }
        </style>
      </html>
    `;
  };

  const downloadExcelFile = (content, filename) => {
    // Create blob with Excel content
    const blob = new Blob([content], {
      type: 'application/vnd.ms-excel;charset=utf-8'
    });

    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
  };

  const exportToPDF = (data) => {
    try {
      generatePDF(data);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error saat generate PDF: ' + error.message + '\n\nPastikan library sudah terinstall:\nnpm install jspdf jspdf-autotable');
    }
  };


  const generatePDF = (data) => {
    try {
      // Calculate summary data
      const totalRevenue = data.reduce((sum, sale) => sum + (sale.total_price || 0), 0);
      const avgTransaction = data.length > 0 ? totalRevenue / data.length : 0;

      // Prepare items data
      const itemsData = [];
      let itemNo = 1;

      data.forEach(sale => {
        if (sale.sale_items && sale.sale_items.length > 0) {
          sale.sale_items.forEach(item => {
            const printPrice = item.is_printed && item.print_types ? item.print_types.price : 0;
            const totalItemPrice = (item.unit_price * item.quantity) + (printPrice * item.quantity);

            itemsData.push([
              itemNo++,
              sale.order_number || '',
              item.product_variants?.products?.name || '',
              item.product_variants?.products?.categories?.name || '',
              item.product_variants?.sizes?.name || '',
              item.quantity || 0,
              UtilityService.formatCurrency(item.unit_price || 0),
              item.is_printed ? 'Ya' : 'Tidak',
              item.is_printed && item.print_types ? item.print_types.name : '',
              UtilityService.formatCurrency(printPrice),
              UtilityService.formatCurrency(totalItemPrice)
            ]);
          });
        }
      });

      // Create new PDF document in landscape orientation
      const doc = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape
      let currentY = 20;

      // Define colors matching Excel design
      const colors = {
        header: [54, 96, 146], // #366092
        subheader: [68, 114, 196], // #4472C4
        summaryLabel: [231, 230, 230], // #E7E6E6
        evenRow: [242, 242, 242], // #F2F2F2
        oddRow: [255, 255, 255], // #FFFFFF
        text: [0, 0, 0],
        white: [255, 255, 255]
      };

      // Define consistent margins for all tables
      const tableMargins = { left: 20, right: 20 };

      // === HEADER SECTION ===
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.header);
      doc.text('LAPORAN PENJUALAN', 148, currentY, { align: 'center' }); // Center for landscape (297/2 = 148.5)
      currentY += 15;

      // Period info
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.text);
      const periodText = dateRange.startDate && dateRange.endDate ?
        `Periode: ${UtilityService.formatDate(dateRange.startDate)} - ${UtilityService.formatDate(dateRange.endDate)}` :
        'Periode: Semua Data';
      doc.text(periodText, 20, currentY);
      currentY += 6;

      doc.text(`Tanggal Export: ${UtilityService.formatDate(new Date().toISOString())}`, 20, currentY);
      currentY += 15;

      // === RINGKASAN TABLE ===
      autoTable(doc, {
        startY: currentY,
        head: [['', 'RINGKASAN']],
        body: [
          ['Total Transaksi', data.length.toString()],
          ['Total Revenue', UtilityService.formatCurrency(totalRevenue)],
          ['Rata-rata per Transaksi', UtilityService.formatCurrency(Math.round(avgTransaction))]
        ],
        headStyles: {
          fillColor: colors.header,
          textColor: colors.white,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 9
        },
        columnStyles: {
          0: { fillColor: colors.summaryLabel, fontStyle: 'bold', cellWidth: 50 },
          1: { cellWidth: 60, halign: 'right' }
        },
        margin: tableMargins,
        tableWidth: 110
      });

      currentY = doc.lastAutoTable.finalY + 15;

      // === DETAIL PENJUALAN TABLE ===
      const salesHeaders = ['No', 'Nomor Order', 'Tanggal', 'Pelanggan', 'Total Harga', 'Status', 'Jumlah Item'];
      const salesData = data.map((sale, index) => [
        index + 1,
        sale.order_number || '',
        UtilityService.formatDate(sale.sale_date),
        sale.customer || 'Customer Umum',
        UtilityService.formatCurrency(sale.total_price || 0),
        'Selesai',
        sale.sale_items?.length || 0
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [salesHeaders],
        body: salesData,
        headStyles: {
          fillColor: colors.header,
          textColor: colors.white,
          fontStyle: 'bold',
          halign: 'center',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8
        },
        alternateRowStyles: {
          fillColor: colors.evenRow
        },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' }, // No
          1: { cellWidth: 40 }, // Nomor Order
          2: { cellWidth: 35 }, // Tanggal
          3: { cellWidth: 50 }, // Pelanggan
          4: { cellWidth: 40, halign: 'right' }, // Total Harga
          5: { cellWidth: 25, halign: 'center' }, // Status
          6: { cellWidth: 20, halign: 'center' } // Jumlah Item
        },
        margin: tableMargins,
        tableWidth: 'auto',
        didDrawPage: function (data) {
          // Add title for this section
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...colors.header);
          doc.text('DETAIL PENJUALAN', 20, data.settings.startY - 5);
        }
      });

      // === DETAIL ITEM TABLE (if exists) ===
      if (itemsData.length > 0) {
        // Check if we need a new page
        if (doc.lastAutoTable.finalY > 180) { // Adjusted for landscape
          doc.addPage();
          currentY = 20;
        } else {
          currentY = doc.lastAutoTable.finalY + 15;
        }

        // Add title for DETAIL ITEM section once before the table
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...colors.header);
        doc.text('DETAIL ITEM', 20, currentY - 5);

        const itemHeaders = ['No', 'Order', 'Produk', 'Kategori', 'Ukuran', 'Qty', 'Harga Satuan', 'Print', 'Jenis Print', 'Harga Print', 'Total'];

        autoTable(doc, {
          startY: currentY,
          head: [itemHeaders],
          body: itemsData,
          headStyles: {
            fillColor: colors.header,
            textColor: colors.white,
            fontStyle: 'bold',
            halign: 'center',
            fontSize: 8
          },
          bodyStyles: {
            fontSize: 7
          },
          alternateRowStyles: {
            fillColor: colors.evenRow
          },
          columnStyles: {
            0: { cellWidth: 15, halign: 'center' }, // No - reduced from 12
            1: { cellWidth: 40 }, // Order - reduced from 25
            2: { cellWidth: 35 }, // Produk - reduced from 30
            3: { cellWidth: 30 }, // Kategori - reduced from 20
            4: { cellWidth: 15 }, // Ukuran - reduced from 18
            5: { cellWidth: 10, halign: 'center' }, // Qty - reduced from 12
            6: { cellWidth: 22, halign: 'right' }, // Harga Satuan - reduced from 25
            7: { cellWidth: 12, halign: 'center' }, // Print - reduced from 15
            8: { cellWidth: 20 }, // Jenis Print - reduced from 25
            9: { cellWidth: 20, halign: 'right' }, // Harga Print - reduced from 25
            10: { cellWidth: 25, halign: 'right' } // Total - reduced from 30
          },
          margin: tableMargins,
          // Let jsPDF auto-fit the table if it still doesn't fit
          tableWidth: 'auto',
          styles: {
            overflow: 'linebreak',
            cellWidth: 'wrap'
          }
        });
      }

      // === FOOTER ===
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Halaman ${i} dari ${pageCount}`, 148, 200, { align: 'center' }); // Adjusted for landscape
        doc.text(`Generated by Sales Management System - ${new Date().toLocaleDateString('id-ID')}`, 148, 195, { align: 'center' });
      }

      // Generate filename and save
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `laporan-penjualan-${timestamp}.pdf`;

      doc.save(filename);

      // Success notification
      // alert(`File PDF berhasil di-export: ${filename}`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Gagal generate PDF: ' + error.message);
    }
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
                <option value="excel">Excel (.xls)</option>
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

            {/* Excel Features Info */}
            {exportFormat === 'excel' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-green-800 mb-2">File Excel akan berisi:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Ringkasan (Total transaksi & revenue)</li>
                  <li>• Detail Penjualan (Data penjualan lengkap)</li>
                  <li>• Detail Item (Breakdown per produk)</li>
                </ul>
              </div>
            )}

            {/* PDF Features Info */}
            {exportFormat === 'pdf' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-blue-800 mb-2">File PDF akan berisi:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Header laporan dengan periode</li>
                  <li>• Ringkasan (Statistics & summary)</li>
                  <li>• Detail Penjualan</li>
                  <li>• Detail Item</li>
                </ul>
              </div>
            )}

            {/* Info - Updated to show filtered count */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">{filteredCount}</span> data penjualan akan di-export
                {(dateRange.startDate || dateRange.endDate) && (
                  <span className="text-blue-600"> (dengan filter tanggal)</span>
                )}
              </p>
              {filteredCount !== sales.length && (
                <p className="text-xs text-blue-600 mt-1">
                  Total data asli: {sales.length} • Terfilter: {filteredCount}
                </p>
              )}
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
              disabled={exporting || filteredCount === 0}
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
                  Export {filteredCount > 0 && `(${filteredCount})`}
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