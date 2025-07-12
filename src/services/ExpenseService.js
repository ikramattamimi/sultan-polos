// ===========================================
// EXPENSE SERVICE
// Service untuk menangani manajemen expenses
// ===========================================

import { supabase } from "../supabaseClient";

export const ExpenseService = {
  // ===========================================
  // CRUD METHODS
  // ===========================================

  /**
   * Ambil semua expenses
   * @param {number} limit - Limit hasil (default: 50)
   * @param {number} offset - Offset untuk pagination (default: 0)
   * @param {string} status - Filter berdasarkan status (optional)
   * @returns {Promise<Array>} Array of expenses
   */
  async getAll(limit = 50, offset = 0, status = null) {
    let query = supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  /**
   * Ambil expense berdasarkan ID
   * @param {number} id - ID expense
   * @returns {Promise<Object>} Expense data
   */
  async getById(id) {
    const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', id)
    .single();

    if (error) throw error;
    return data;
  },

  /**
   * Buat expense baru
   * @param {Object} expenseData - Data expense
   * @param {string} expenseData.name - Nama expense
   * @param {number} expenseData.cost - Biaya
   * @param {string} expenseData.status - Status (default: 'active')
   * @returns {Promise<Object>} Created expense
   */
  async create(expenseData) {
    const dataToInsert = {
      name: expenseData.name,
      cost: expenseData.cost,
      status: expenseData.status || 'active'
    };

    const { data, error } = await supabase
    .from('expenses')
    .insert([dataToInsert])
    .select()
    .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update expense
   * @param {number} id - ID expense
   * @param {Object} expenseData - Data expense yang akan diupdate
   * @returns {Promise<Object>} Updated expense
   */
  async update(id, expenseData) {
    const { data, error } = await supabase
    .from('expenses')
    .update(expenseData)
    .eq('id', id)
    .select()
    .single();

    if (error) throw error;
    return data;
  },

  /**
   * Hapus expense
   * @param {number} id - ID expense
   * @returns {Promise<boolean>} True jika berhasil
   */
  async delete(id) {
    const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

    if (error) throw error;
    return true;
  },

  // ===========================================
  // FILTERING & SEARCH METHODS
  // ===========================================

  /**
   * Ambil expenses berdasarkan range tanggal
   * @param {string} startDate - Format: 'YYYY-MM-DD'
   * @param {string} endDate - Format: 'YYYY-MM-DD'
   * @param {string} status - Filter status (optional)
   * @returns {Promise<Array>} Array of expenses dalam range
   */
  async getByDateRange(startDate, endDate, status = null) {
    let query = supabase
    .from('expenses')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate + 'T23:59:59.999Z')
    .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  /**
   * Search expenses berdasarkan nama
   * @param {string} searchTerm - Term pencarian
   * @param {number} limit - Limit hasil (default: 20)
   * @returns {Promise<Array>} Array of matching expenses
   */
  async searchByName(searchTerm, limit = 20) {
    const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .ilike('name', `%${searchTerm}%`)
    .order('created_at', { ascending: false })
    .limit(limit);

    if (error) throw error;
    return data;
  },

  /**
   * Ambil expenses berdasarkan status
   * @param {string} status - Status expense
   * @returns {Promise<Array>} Array of expenses dengan status tertentu
   */
  async getByStatus(status) {
    const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // ===========================================
  // CALCULATION & ANALYTICS METHODS
  // ===========================================

  /**
   * Hitung total expenses untuk periode tertentu
   * @param {string} startDate - Format: 'YYYY-MM-DD'
   * @param {string} endDate - Format: 'YYYY-MM-DD'
   * @param {string} status - Filter status (default: 'active')
   * @returns {Promise<Object>} Summary expenses
   */
  async calculateTotalExpenses(startDate, endDate, status = 'active') {
    let query = supabase
    .from('expenses')
    .select('cost')
    .gte('created_at', startDate)
    .lte('created_at', endDate + 'T23:59:59.999Z');

    if (status) {
      query = query.eq('status', status);
    } else {
      // Jika status null, ambil yang active atau null
      query = query.or('status.eq.active,status.is.null');
    }

    const { data, error } = await query;
    if (error) throw error;

    const total = data.reduce((sum, expense) => sum + (expense.cost || 0), 0);
    const count = data.length;
    const average = count > 0 ? total / count : 0;

    return {
      total_amount: total,
      expense_count: count,
      average_amount: Math.round(average * 100) / 100,
      period_start: startDate,
      period_end: endDate
    };
  },

  /**
   * Ambil summary expenses per bulan
   * @param {number} monthsBack - Berapa bulan ke belakang (default: 6)
   * @returns {Promise<Array>} Array of monthly summaries
   */
  async getMonthlyExpenseSummary(monthsBack = 6) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsBack);

    const { data, error } = await supabase
    .from('expenses')
    .select('cost, created_at')
    .gte('created_at', startDate.toISOString().split('T')[0])
    .lte('created_at', endDate.toISOString().split('T')[0] + 'T23:59:59.999Z')
    .or('status.eq.active,status.is.null')
    .order('created_at', { ascending: true });

    if (error) throw error;

    // Group by month
    const monthlyData = {};
    data.forEach(expense => {
      const date = new Date(expense.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          total_amount: 0,
          expense_count: 0,
          expenses: []
        };
      }

      monthlyData[monthKey].total_amount += expense.cost || 0;
      monthlyData[monthKey].expense_count += 1;
      monthlyData[monthKey].expenses.push(expense);
    });

    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  },

  /**
   * Ambil top expenses (berdasarkan cost)
   * @param {number} limit - Jumlah top expenses (default: 10)
   * @param {string} startDate - Filter start date (optional)
   * @param {string} endDate - Filter end date (optional)
   * @returns {Promise<Array>} Array of top expenses
   */
  async getTopExpenses(limit = 10, startDate = null, endDate = null) {
    let query = supabase
    .from('expenses')
    .select('*')
    .or('status.eq.active,status.is.null')
    .order('cost', { ascending: false })
    .limit(limit);

    if (startDate && endDate) {
      query = query
      .gte('created_at', startDate)
      .lte('created_at', endDate + 'T23:59:59.999Z');
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // ===========================================
  // BULK OPERATIONS
  // ===========================================

  /**
   * Bulk create expenses
   * @param {Array} expensesData - Array of expense data
   * @returns {Promise<Array>} Array of created expenses
   */
  async bulkCreate(expensesData) {
    const dataToInsert = expensesData.map(expense => ({
      name: expense.name,
      cost: expense.cost,
      status: expense.status || 'active'
    }));

    const { data, error } = await supabase
    .from('expenses')
    .insert(dataToInsert)
    .select();

    if (error) throw error;
    return data;
  },

  /**
   * Bulk update status expenses
   * @param {Array} expenseIds - Array of expense IDs
   * @param {string} newStatus - Status baru
   * @returns {Promise<Array>} Array of updated expenses
   */
  async bulkUpdateStatus(expenseIds, newStatus) {
    const { data, error } = await supabase
    .from('expenses')
    .update({ status: newStatus })
    .in('id', expenseIds)
    .select();

    if (error) throw error;
    return data;
  },

  /**
   * Bulk delete expenses
   * @param {Array} expenseIds - Array of expense IDs
   * @returns {Promise<boolean>} True jika berhasil
   */
  async bulkDelete(expenseIds) {
    const { error } = await supabase
    .from('expenses')
    .delete()
    .in('id', expenseIds);

    if (error) throw error;
    return true;
  },

  // ===========================================
  // UTILITY METHODS
  // ===========================================

  /**
   * Validasi data expense sebelum create/update
   * @param {Object} expenseData - Data expense
   * @returns {Object} Validation result
   */
  validateExpenseData(expenseData) {
    const errors = [];

    if (!expenseData.name || expenseData.name.trim() === '') {
      errors.push('Nama expense tidak boleh kosong');
    }

    if (!expenseData.cost || expenseData.cost <= 0) {
      errors.push('Cost harus lebih besar dari 0');
    }

    if (expenseData.status && !['active', 'inactive', 'pending'].includes(expenseData.status)) {
      errors.push('Status harus salah satu dari: active, inactive, pending');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  },

  /**
   * Format expense data untuk UI
   * @param {Object} expense - Raw expense data
   * @returns {Object} Formatted expense data
   */
  formatForUI(expense) {
    return {
      id: expense.id,
      name: expense.name,
      cost: this.formatCurrency(expense.cost),
      cost_raw: expense.cost,
      status: expense.status || 'active',
      status_label: this.getStatusLabel(expense.status),
      created_at: expense.created_at,
      created_date: new Date(expense.created_at).toLocaleDateString('id-ID'),
      created_time: new Date(expense.created_at).toLocaleTimeString('id-ID')
    };
  },

  /**
   * Get label untuk status
   * @param {string} status - Status expense
   * @returns {string} Label status
   */
  getStatusLabel(status) {
    const statusLabels = {
      'active': 'Aktif',
      'inactive': 'Tidak Aktif',
      'pending': 'Pending',
      null: 'Aktif'
    };
    return statusLabels[status] || 'Tidak Diketahui';
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
  },

  /**
   * Export expenses ke format yang bisa digunakan untuk Excel
   * @param {string} startDate - Start date (optional)
   * @param {string} endDate - End date (optional)
   * @param {string} status - Filter status (optional)
   * @returns {Promise<Object>} Data formatted untuk export
   */
  async exportExpenses(startDate = null, endDate = null, status = null) {
    let expenses;

    if (startDate && endDate) {
      expenses = await this.getByDateRange(startDate, endDate, status);
    } else {
      expenses = await this.getAll(1000, 0, status); // Max 1000 records
    }

    const summary = await this.calculateTotalExpenses(
      startDate || '2000-01-01',
      endDate || new Date().toISOString().split('T')[0],
      status
    );

    return {
      summary: {
        periode: startDate && endDate ? `${startDate} - ${endDate}` : 'Semua Data',
        total_expenses: summary.total_amount,
        expense_count: summary.expense_count,
        average_expense: summary.average_amount,
        status_filter: status || 'Semua Status'
      },
      expenses: expenses.map(expense => ({
        nama: expense.name,
        biaya: expense.cost,
        status: this.getStatusLabel(expense.status),
        tanggal: new Date(expense.created_at).toLocaleDateString('id-ID')
      })),
      generated_at: new Date().toISOString()
    };
  }
};

export default ExpenseService;