// ===========================================
// INCOME STATEMENT SERVICE
// Service untuk menangani laporan laba rugi
// ===========================================

import { supabase } from "../supabaseClient";
import UtilityService from "./UtilityServices.js";

export const IncomeStatementService = {
  // ===========================================
  // CALCULATION METHODS
  // ===========================================

  /**
   * Kalkulasi total revenue untuk periode tertentu
   * @param {string} startDate - Format: 'YYYY-MM-DD'
   * @param {string} endDate - Format: 'YYYY-MM-DD'
   * @returns {Promise<number>} Total revenue
   */
  async calculateRevenue(startDate, endDate) {
    const { data, error } = await supabase
    .from('sales')
    .select('total_price')
    .gte('sale_date', startDate)
    .lte('sale_date', endDate)
    .gt('total_price', 0);

    if (error) throw error;

    const totalRevenue = data.reduce((sum, sale) => sum + (sale.total_price || 0), 0);
    return totalRevenue;
  },

  /**
   * Kalkulasi total HPP (Cost of Goods Sold) untuk periode tertentu
   * @param {string} startDate - Format: 'YYYY-MM-DD'
   * @param {string} endDate - Format: 'YYYY-MM-DD'
   * @returns {Promise<number>} Total HPP
   */
  async calculateHPP(startDate, endDate) {
    const { data, error } = await supabase
    .from('sales')
    .select(`
        sale_items(
          quantity,
          product_variants(
            hpp
          )
        )
      `)
    .gte('sale_date', startDate)
    .lte('sale_date', endDate)
    .gt('total_price', 0);

    if (error) throw error;

    let totalHPP = 0;
    data.forEach(sale => {
      if (sale.sale_items) {
        sale.sale_items.forEach(item => {
          const hpp = item.product_variants?.hpp || 0;
          const quantity = item.quantity || 0;
          totalHPP += hpp * quantity;
        });
      }
    });

    return totalHPP;
  },

  /**
   * Kalkulasi total expenses untuk periode tertentu
   * @param {string} startDate - Format: 'YYYY-MM-DD'
   * @param {string} endDate - Format: 'YYYY-MM-DD'
   * @returns {Promise<number>} Total expenses
   */
  async calculateExpenses(startDate, endDate) {
    const { data, error } = await supabase
    .from('expenses')
    .select('cost')
    // .gte('created_at', startDate)
    // .lte('created_at', endDate + 'T23:59:59.999Z')
    .or('status.eq.active,status.is.null');

    if (error) throw error;

    const totalExpenses = data.reduce((sum, expense) => sum + (expense.cost || 0), 0);
    return totalExpenses;
  },

  /**
   * Kalkulasi lengkap profit loss untuk periode tertentu (tidak disimpan)
   * @param {string} startDate - Format: 'YYYY-MM-DD'
   * @param {string} endDate - Format: 'YYYY-MM-DD'
   * @returns {Promise<Object>} Object dengan semua kalkulasi
   */
  async calculateProfitLoss(startDate, endDate) {
    try {
      const [totalRevenue, totalHPP, totalExpenses] = await Promise.all([
        this.calculateRevenue(startDate, endDate),
        this.calculateHPP(startDate, endDate),
        this.calculateExpenses(startDate, endDate)
      ]);

      const grossProfit = totalRevenue - totalHPP;
      const netProfit = grossProfit - totalExpenses;

      // Kalkulasi profit margin dengan safety checks
      let profitMarginPercentage = 0;
      if (totalRevenue > 0) {
        const margin = (netProfit / totalRevenue) * 100;
        // Batasi antara -999999.99 sampai 999999.99 untuk NUMERIC(8,2)
        profitMarginPercentage = Math.max(-999999.99, Math.min(999999.99,
          Math.round(margin * 100) / 100
        ));
      }

      return {
        period_start_date: startDate,
        period_end_date: endDate,
        total_revenue: Math.round(totalRevenue * 100) / 100,
        total_cogs: Math.round(totalHPP * 100) / 100,
        gross_profit: Math.round(grossProfit * 100) / 100,
        total_expenses: Math.round(totalExpenses * 100) / 100,
        net_profit: Math.round(netProfit * 100) / 100,
        profit_margin_percentage: profitMarginPercentage
      };
    } catch (error) {
      throw new Error(`Error calculating profit loss: ${error.message}`);
    }
  },

  // ===========================================
  // GENERATE INCOME STATEMENT METHODS
  // ===========================================

  /**
   * Generate dan simpan laporan laba rugi ke database
   * @param {string} startDate - Format: 'YYYY-MM-DD'
   * @param {string} endDate - Format: 'YYYY-MM-DD'
   * @param {string} notes - Catatan tambahan (opsional)
   * @returns {Promise<Object>} Income statement yang tersimpan dengan detail expenses
   */
  async generateIncomeStatement(startDate, endDate, notes = null) {
    try {
      // Cek apakah laporan untuk periode ini sudah ada
      const existingReport = await this.checkExistingReport(startDate, endDate);
      if (existingReport) {
        throw new Error(`Laporan untuk periode ${startDate} - ${endDate} sudah ada`);
      }

      // Kalkulasi profit loss
      const calculation = await this.calculateProfitLoss(startDate, endDate);

      // Simpan laporan utama
      const { data: incomeStatement, error: statementError } = await supabase
      .from('income_statements')
      .insert([{
        period_start_date: startDate,
        period_end_date: endDate,
        total_revenue: calculation.total_revenue,
        total_cogs: calculation.total_cogs,
        gross_profit: calculation.gross_profit,
        total_expenses: calculation.total_expenses,
        net_profit: calculation.net_profit,
        profit_margin_percentage: calculation.profit_margin_percentage,
        notes: notes
      }])
      .select()
      .single();

      if (statementError) throw statementError;

      // Ambil detail expenses untuk snapshot
      const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('id, name, cost')
      // .gte('created_at', startDate)
      // .lte('created_at', endDate + 'T23:59:59.999Z')
      .or('status.eq.active,status.is.null');

      if (expensesError) throw expensesError;

      // Simpan detail expenses sebagai snapshot
      if (expenses && expenses.length > 0) {
        const expenseDetails = expenses.map(expense => ({
          income_statement_id: incomeStatement.id,
          expense_id: expense.id,
          expense_name: expense.name,
          expense_cost: expense.cost
        }));

        const { error: detailsError } = await supabase
        .from('income_statement_expense_details')
        .insert(expenseDetails);

        if (detailsError) throw detailsError;
      }

      // Return laporan lengkap dengan detail expenses
      return await this.getById(incomeStatement.id);

    } catch (error) {
      throw new Error(`Error generating income statement: ${error.message}`);
    }
  },

  /**
   * Generate laporan untuk periode default (26 bulan lalu - 25 bulan sekarang)
   * @param {string} notes - Catatan tambahan (opsional)
   * @returns {Promise<Object>} Income statement yang tersimpan
   */
  async generateCurrentPeriodStatement(notes = null) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-based (0 = January)

    // Hitung tanggal mulai: tanggal 26 bulan sebelumnya
    const startDate = new Date(currentYear, currentMonth - 1, 26);

    // Hitung tanggal akhir: tanggal 25 bulan ini
    const endDate = new Date(currentYear, currentMonth, 25);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    return await this.generateIncomeStatement(startDateStr, endDateStr, notes);
  },

  // ===========================================
  // CRUD METHODS
  // ===========================================

  /**
   * Ambil semua laporan laba rugi
   * @param {number} limit - Limit hasil (default: 50)
   * @param {number} offset - Offset untuk pagination (default: 0)
   * @returns {Promise<Array>} Array of income statements
   */
  async getAll(limit = 50, offset = 0) {
    const { data, error } = await supabase
    .from('income_statements')
    .select('*')
    .order('period_end_date', { ascending: false })
    .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  },

  /**
   * Ambil laporan laba rugi berdasarkan ID dengan detail expenses
   * @param {number} id - ID income statement
   * @returns {Promise<Object>} Income statement dengan detail expenses
   */
  async getById(id) {
    const { data, error } = await supabase
    .from('income_statements')
    .select(`
        *,
        income_statement_expense_details(
          id,
          expense_id,
          expense_name,
          expense_cost
        )
      `)
    .eq('id', id)
    .single();

    if (error) throw error;
    return data;
  },

  /**
   * Ambil detail perhitungan untuk laporan laba rugi tertentu
   * @param {number} id - ID income statement
   * @returns {Promise<Object>} Detail breakdown perhitungan
   */
  async getCalculationDetails(id) {
    try {
      // Ambil data income statement terlebih dahulu
      const statement = await this.getById(id);
      if (!statement) {
        throw new Error('Income statement tidak ditemukan');
      }

      const { period_start_date, period_end_date } = statement;

      // Fetch revenue details (sales data)
      const { data: salesData, error: salesError } = await supabase
      .from('sales')
      .select(`
          id,
          order_number,
          customer,
          sale_date,
          total_price,
          sale_items(
            id,
            quantity,
            unit_price,
            actual_price
          )
        `)
      .gte('sale_date', period_start_date)
      .lte('sale_date', period_end_date)
      .gt('total_price', 0)
      .order('sale_date', { ascending: false });

      if (salesError) throw salesError;

      // Fetch HPP details (sale items with product details)
      const { data: HPPData, error: HPPError } = await supabase
      .from('sales')
      .select(`
          order_number,
          sale_date,
          sale_items(
            id,
            quantity,
            unit_price,
            actual_price,
            product_variants(
              id,
              hpp,
              products(
                id,
                name
              ),
              sizes(name),
              colors(name)
            )
          )
        `)
      .gte('sale_date', period_start_date)
      .lte('sale_date', period_end_date)
      .gt('total_price', 0)
      .order('sale_date', { ascending: false });

      if (HPPError) throw HPPError;

      // Process revenue details
      const revenueDetails = {
        sales: salesData.map(sale => ({
          id: sale.id,
          order_number: sale.order_number,
          customer: sale.customer || 'Customer Umum',
          sale_date: sale.sale_date,
          total_price: sale.total_price,
          items_count: sale.sale_items?.length || 0
        })),
        total_sales_count: salesData.length,
        total_revenue: salesData.reduce((sum, sale) => sum + (sale.total_price || 0), 0)
      };

      // Process HPP details
      const HPPItems = [];
      let totalItemsSold = 0;
      let totalHPP = 0;

      HPPData.forEach(sale => {
        if (sale.sale_items) {
          sale.sale_items.forEach(item => {
            const product = item.product_variants?.products;
            const size = item.product_variants?.sizes?.name || '-';
            const color = item.product_variants?.colors?.name || '-';
            const hpp = item.product_variants?.hpp || 0;
            const quantity = item.quantity || 0;
            const itemHPP = hpp * quantity;

            HPPItems.push({
              id: item.id,
              order_number: sale.order_number,
              sale_date: sale.sale_date,
              product_name: product?.name || 'Unknown Product',
              size: size,
              color: color,
              quantity: quantity,
              hpp: hpp,
              selling_price: item.unit_price || 0,
              total_cogs: itemHPP
            });

            totalItemsSold += quantity;
            totalHPP += itemHPP;
          });
        }
      });

      const HPPDetails = {
        items: HPPItems,
        total_items_sold: totalItemsSold,
        total_cogs: totalHPP
      };

      // Expenses details sudah ada di statement.income_statement_expense_details
      const expensesDetails = {
        expenses: statement.income_statement_expense_details || [],
        total_expenses: statement.income_statement_expense_details?.reduce((sum, exp) => sum + (exp.expense_cost || 0), 0) || 0,
        expense_count: statement.income_statement_expense_details?.length || 0
      };

      return {
        statement_id: id,
        period: {
          start_date: period_start_date,
          end_date: period_end_date
        },
        revenue_details: revenueDetails,
        HPP_details: HPPDetails,
        expenses_details: expensesDetails,
        summary: {
          total_revenue: statement.total_revenue,
          total_cogs: statement.total_cogs,
          gross_profit: statement.gross_profit,
          total_expenses: statement.total_expenses,
          net_profit: statement.net_profit,
          profit_margin_percentage: statement.profit_margin_percentage
        }
      };

    } catch (error) {
      throw new Error(`Error fetching calculation details: ${error.message}`);
    }
  },

  /**
   * Update laporan laba rugi
   * @param {number} id - ID income statement
   * @param {Object} updateData - Data yang akan diupdate
   * @returns {Promise<Object>} Updated income statement
   */
  async update(id, updateData) {
    const { data, error } = await supabase
    .from('income_statements')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

    if (error) throw error;
    return data;
  },

  /**
   * Hapus laporan laba rugi
   * @param {number} id - ID income statement
   * @returns {Promise<boolean>} True jika berhasil
   */
  async delete(id) {
    const { error } = await supabase
    .from('income_statements')
    .delete()
    .eq('id', id);

    if (error) throw error;
    return true;
  },

  // ===========================================
  // UTILITY METHODS
  // ===========================================

  /**
   * Cek apakah laporan untuk periode tertentu sudah ada
   * @param {string} startDate - Format: 'YYYY-MM-DD'
   * @param {string} endDate - Format: 'YYYY-MM-DD'
   * @returns {Promise<Object|null>} Existing report atau null
   */
  async checkExistingReport(startDate, endDate) {
    const { data, error } = await supabase
    .from('income_statements')
    .select('*')
    .eq('period_start_date', startDate)
    .eq('period_end_date', endDate)
    .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Ambil laporan berdasarkan range tanggal
   * @param {string} startDate - Format: 'YYYY-MM-DD'
   * @param {string} endDate - Format: 'YYYY-MM-DD'
   * @returns {Promise<Array>} Array of income statements dalam range
   */
  async getByDateRange(startDate, endDate) {
    const { data, error } = await supabase
    .from('income_statements')
    .select('*')
    .gte('period_start_date', startDate)
    .lte('period_end_date', endDate)
    .order('period_start_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Ambil summary statistik dari semua laporan
   * @returns {Promise<Object>} Summary statistik
   */
  async getSummaryStats() {
    const { data, error } = await supabase
    .from('income_statements')
    .select('total_revenue, total_cogs, gross_profit, total_expenses, net_profit, profit_margin_percentage');

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        total_reports: 0,
        avg_revenue: 0,
        avg_profit: 0,
        avg_margin: 0,
        total_revenue: 0,
        total_profit: 0,
        best_month: null,
        worst_month: null
      };
    }

    const totalReports = data.length;
    const totalRevenue = data.reduce((sum, report) => sum + (report.total_revenue || 0), 0);
    const totalProfit = data.reduce((sum, report) => sum + (report.net_profit || 0), 0);
    const avgRevenue = totalRevenue / totalReports;
    const avgProfit = totalProfit / totalReports;
    const avgMargin = data.reduce((sum, report) => sum + (report.profit_margin_percentage || 0), 0) / totalReports;

    // Cari bulan terbaik dan terburuk berdasarkan net profit
    const sortedByProfit = [...data].sort((a, b) => (b.net_profit || 0) - (a.net_profit || 0));
    const bestMonth = sortedByProfit[0];
    const worstMonth = sortedByProfit[sortedByProfit.length - 1];

    return {
      total_reports: totalReports,
      avg_revenue: Math.round(avgRevenue * 100) / 100,
      avg_profit: Math.round(avgProfit * 100) / 100,
      avg_margin: Math.round(avgMargin * 100) / 100,
      total_revenue: totalRevenue,
      total_profit: totalProfit,
      best_month: {
        revenue: bestMonth.total_revenue,
        profit: bestMonth.net_profit,
        margin: bestMonth.profit_margin_percentage
      },
      worst_month: {
        revenue: worstMonth.total_revenue,
        profit: worstMonth.net_profit,
        margin: worstMonth.profit_margin_percentage
      }
    };
  },

  /**
   * Regenerate laporan laba rugi (hapus yang lama, buat yang baru)
   * @param {number} id - ID income statement yang akan di-regenerate
   * @returns {Promise<Object>} Income statement yang baru
   */
  async regenerateIncomeStatement(id) {
    try {
      // Ambil data laporan lama
      const oldReport = await this.getById(id);
      if (!oldReport) {
        throw new Error('Laporan tidak ditemukan');
      }

      const { period_start_date, period_end_date, notes } = oldReport;

      // Hapus laporan lama
      await this.delete(id);

      // Generate laporan baru dengan periode yang sama
      return await this.generateIncomeStatement(period_start_date, period_end_date, notes);

    } catch (error) {
      throw new Error(`Error regenerating income statement: ${error.message}`);
    }
  },

  /**
   * Batch generate laporan untuk beberapa periode sekaligus
   * @param {Array} periods - Array of {startDate, endDate, notes}
   * @returns {Promise<Array>} Array of generated income statements
   */
  async batchGenerateIncomeStatements(periods) {
    const results = [];
    const errors = [];

    for (const period of periods) {
      try {
        const result = await this.generateIncomeStatement(
          period.startDate,
          period.endDate,
          period.notes
        );
        results.push(result);
      } catch (error) {
        errors.push({
          period: period,
          error: error.message
        });
      }
    }

    return {
      success: results,
      errors: errors,
      total_processed: periods.length,
      success_count: results.length,
      error_count: errors.length
    };
  },

  // ===========================================
  // EXPORT/IMPORT METHODS
  // ===========================================

  /**
   * Export laporan laba rugi ke format yang bisa digunakan untuk Excel
   * @param {number} id - ID income statement
   * @param {boolean} includeDetails - Include calculation details (default: true)
   * @returns {Promise<Object>} Data formatted untuk export
   */
  async exportIncomeStatement(id, includeDetails = true) {
    const report = await this.getById(id);
    if (!report) {
      throw new Error('Laporan tidak ditemukan');
    }

    const exportData = {
      summary: {
        periode: `${report.period_start_date} - ${report.period_end_date}`,
        total_revenue: report.total_revenue,
        total_cogs: report.total_cogs,
        gross_profit: report.gross_profit,
        total_expenses: report.total_expenses,
        net_profit: report.net_profit,
        profit_margin: `${report.profit_margin_percentage}%`,
        catatan: report.notes
      },
      expense_details: report.income_statement_expense_details?.map(detail => ({
        nama_expense: detail.expense_name,
        biaya: detail.expense_cost
      })) || [],
      generated_at: new Date().toISOString()
    };

    // Include detailed breakdown if requested
    if (includeDetails) {
      try {
        const calculationDetails = await this.getCalculationDetails(id);

        exportData.revenue_breakdown = calculationDetails.revenue_details.sales.map(sale => ({
          order_number: sale.order_number,
          customer: sale.customer,
          tanggal: sale.sale_date,
          total_harga: sale.total_price,
          jumlah_item: sale.items_count
        }));

        exportData.HPP_breakdown = calculationDetails.HPP_details.items.map(item => ({
          order_number: item.order_number,
          tanggal: item.sale_date,
          produk: item.product_name,
          ukuran: item.size,
          warna: item.color,
          quantity: item.quantity,
          hpp: item.hpp,
          harga_jual: item.selling_price,
          total_cogs: item.total_cogs
        }));

        exportData.calculation_summary = {
          total_penjualan: calculationDetails.revenue_details.total_sales_count,
          total_item_terjual: calculationDetails.HPP_details.total_items_sold,
          total_expense_items: calculationDetails.expenses_details.expense_count
        };
      } catch (error) {
        console.warn('Could not fetch calculation details for export:', error);
        // Continue without details if there's an error
      }
    }

    return exportData;
  },

  /**
   * Format data untuk tampilan UI
   * @param {Object} incomeStatement - Raw income statement data
   * @returns {Object} Formatted data untuk UI
   */
  formatForUI(incomeStatement) {
    return {
      id: incomeStatement.id,
      periode: `${UtilityService.formatDate(incomeStatement.period_start_date)} - ${UtilityService.formatDate(incomeStatement.period_end_date)}`,
      total_revenue: UtilityService.formatCurrency(incomeStatement.total_revenue),
      total_cogs: UtilityService.formatCurrency(incomeStatement.total_cogs),
      gross_profit: UtilityService.formatCurrency(incomeStatement.gross_profit),
      total_expenses: UtilityService.formatCurrency(incomeStatement.total_expenses),
      net_profit: UtilityService.formatCurrency(incomeStatement.net_profit),
      profit_margin: `${incomeStatement.profit_margin_percentage}%`,
      profit_status: incomeStatement.net_profit >= 0 ? 'profit' : 'loss',
      notes: incomeStatement.notes,
      created_at: incomeStatement.created_at,
      updated_at: incomeStatement.updated_at,
      expense_count: incomeStatement.income_statement_expense_details?.length || 0
    };
  },

  /**
   * Helper function untuk format currency
   * @param {number} amount - Jumlah yang akan diformat
   * @returns {string} Formatted currency string
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  }
};

export default IncomeStatementService;