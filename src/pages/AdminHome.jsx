// import React from 'react';
//
// const AdminHome = () => {
//   return (
//     <main className="w-full">
//         <h1 className="text-center">Admin Home</h1>
//
//         <div className="mt-10 me-10 flex gap-5 flex-wrap justify-center">
//         </div>
//     </main>
//   );
// };
//
// export default AdminHome;

// ===========================================
// HALAMAN DASHBOARD
// ===========================================

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Filter,
  Download,
  Eye
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Services
import { SaleService } from '../services/SaleService.js';
import { ProductService } from '../services/ProductService.js';
import UtilityService from '../services/UtilityServices.js';

// Components
import {LoadingSpinner, ErrorAlert} from '../components/common';

const DashboardPage = () => {
  // State untuk data
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalSales: 0,
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalProducts: 0,
      lowStockProducts: 0,
      averageOrderValue: 0,
      salesGrowth: 0
    },
    salesChart: [],
    revenueChart: [],
    topProducts: [],
    recentSales: [],
    stockAlerts: []
  });

  // State untuk filter dan kontrol
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [dateFilter, setDateFilter] = useState('30'); // 7, 30, 90 hari
  const [showDetails, setShowDetails] = useState({
    salesChart: false,
    revenueChart: false,
    topProducts: false
  });

  // Load data saat komponen mount
  useEffect(() => {
    loadDashboardData();
  }, [dateFilter]);

  // Load semua data dashboard
  const loadDashboardData = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Hitung tanggal range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(dateFilter));

      // Load data paralel
      const [
        salesData,
        productsData,
        salesStatsData,
        chartData
      ] = await Promise.all([
        SaleService.getAll(),
        ProductService.getAll(true),
        SaleService.getSalesStats(startDate.toISOString(), endDate.toISOString()),
        generateChartData(startDate, endDate)
      ]);

      // Process data
      const processedData = {
        stats: {
          ...salesStatsData,
          totalProducts: productsData?.length || 0,
          lowStockProducts: getLowStockCount(productsData),
          salesGrowth: calculateGrowth(salesData, dateFilter)
        },
        ...chartData,
        topProducts: getTopProducts(salesData),
        recentSales: getRecentSales(salesData),
        stockAlerts: getStockAlerts(productsData)
      };

      setDashboardData(processedData);

    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Gagal memuat data dashboard. Silakan coba lagi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Generate data untuk chart
  const generateChartData = async (startDate, endDate) => {
    // Simulasi data chart - dalam implementasi nyata, ambil dari API
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const salesChart = [];
    const revenueChart = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      salesChart.push({
        date: date.toISOString().split('T')[0],
        sales: Math.floor(Math.random() * 50) + 10,
        orders: Math.floor(Math.random() * 30) + 5
      });

      revenueChart.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 5000000) + 1000000,
        profit: Math.floor(Math.random() * 2000000) + 500000
      });
    }

    return { salesChart, revenueChart };
  };

  // Helper functions
  const getLowStockCount = (products) => {
    if (!products) return 0;
    return products.reduce((count, product) => {
      const lowStockVariants = product.product_variants?.filter(variant =>
        variant.stock <= 10
      ) || [];
      return count + lowStockVariants.length;
    }, 0);
  };

  const calculateGrowth = (salesData, period) => {
    // Simulasi perhitungan growth
    return Math.random() * 20 - 10; // -10% to +10%
  };

  const getTopProducts = (salesData) => {
    // Simulasi top products
    return [
      { name: 'T-Shirt Cotton', sales: 145, revenue: 7250000, growth: 12.5 },
      { name: 'Hoodie Premium', sales: 98, revenue: 9800000, growth: 8.3 },
      { name: 'Polo Shirt', sales: 76, revenue: 4560000, growth: -2.1 },
      { name: 'Jacket Denim', sales: 54, revenue: 8100000, growth: 15.2 },
      { name: 'Sweater Wool', sales: 43, revenue: 6450000, growth: 5.7 }
    ];
  };

  const getRecentSales = (salesData) => {
    // Ambil 5 penjualan terbaru
    return salesData?.slice(0, 5).map(sale => ({
      ...sale,
      timeAgo: getTimeAgo(sale.sale_date)
    })) || [];
  };

  const getStockAlerts = (products) => {
    const alerts = [];
    if (!products) return alerts;

    products.forEach(product => {
      product.product_variants?.forEach(variant => {
        if (variant.stock <= 5) {
          alerts.push({
            productName: product.name,
            variantName: `${variant.sizes?.name} - ${variant.colors?.name}`,
            stock: variant.stock,
            level: variant.stock === 0 ? 'critical' : variant.stock <= 2 ? 'danger' : 'warning'
          });
        }
      });
    });

    return alerts.slice(0, 10); // Limit to 10 alerts
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} jam yang lalu`;
    return `${Math.floor(diffInMinutes / 1440)} hari yang lalu`;
  };

  // Handle refresh
  const handleRefresh = () => {
    loadDashboardData(true);
  };

  if (loading) {
    return <LoadingSpinner message="Memuat dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Error Alert */}
        {error && (
          <ErrorAlert
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {/* Header */}
        <DashboardHeader
          onRefresh={handleRefresh}
          refreshing={refreshing}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />

        {/* Stats Cards */}
        <StatsCards stats={dashboardData.stats} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sales Chart */}
          <SalesChart
            data={dashboardData.salesChart}
            title="Penjualan Harian"
            period={dateFilter}
          />

          {/* Revenue Chart */}
          <RevenueChart
            data={dashboardData.revenueChart}
            title="Pendapatan Harian"
            period={dateFilter}
          />
        </div>

        {/* Data Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Top Products */}
          <TopProductsCard products={dashboardData.topProducts} />

          {/* Recent Sales */}
          <RecentSalesCard sales={dashboardData.recentSales} />

          {/* Stock Alerts */}
          <StockAlertsCard alerts={dashboardData.stockAlerts} />
        </div>

        {/* Additional Insights */}
        <InsightsSection data={dashboardData} />
      </div>
    </div>
  );
};

export default DashboardPage;

// ===========================================
// KOMPONEN MODULAR
// ===========================================

// Dashboard Header
const DashboardHeader = ({ onRefresh, refreshing, dateFilter, setDateFilter }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="mr-3 text-blue-600" />
          Dashboard Penjualan
        </h1>
        <p className="text-gray-600 mt-1">Ringkasan performa bisnis Anda</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Date Filter */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7">7 Hari Terakhir</option>
          <option value="30">30 Hari Terakhir</option>
          <option value="90">90 Hari Terakhir</option>
        </select>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>

        {/* Export Button */}
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>
    </div>
  </div>
);

// Stats Cards
const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Penjualan',
      value: stats.totalOrders,
      format: 'number',
      icon: ShoppingBag,
      color: 'blue',
      growth: stats.salesGrowth,
      subtitle: 'Orders bulan ini'
    },
    {
      title: 'Total Pendapatan',
      value: stats.totalRevenue,
      format: 'currency',
      icon: DollarSign,
      color: 'green',
      growth: 12.5,
      subtitle: 'Revenue bulan ini'
    },
    {
      title: 'Rata-rata Order',
      value: stats.averageOrderValue,
      format: 'currency',
      icon: TrendingUp,
      color: 'purple',
      growth: 8.3,
      subtitle: 'Per transaksi'
    },
    {
      title: 'Total Produk',
      value: stats.totalProducts,
      format: 'number',
      icon: Package,
      color: 'orange',
      growth: 0,
      subtitle: 'Aktif di sistem'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => (
        <StatsCard key={index} {...card} />
      ))}
    </div>
  );
};

// Individual Stats Card
const StatsCard = ({ title, value, format, icon: Icon, color, growth, subtitle }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200'
  };

  const formatValue = (val) => {
    if (format === 'currency') {
      return UtilityService.formatCurrency(val);
    }
    return val.toLocaleString('id-ID');
  };

  const isPositiveGrowth = growth > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatValue(value)}
          </p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>

          {growth !== 0 && (
            <div className={`flex items-center mt-2 text-xs ${
              isPositiveGrowth ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositiveGrowth ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
              <span>{Math.abs(growth).toFixed(1)}% vs periode sebelumnya</span>
            </div>
          )}
        </div>

        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

// Sales Chart Component
const SalesChart = ({ data, title, period }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <span className="text-sm text-gray-500">{period} hari terakhir</span>
    </div>

    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            stroke="#666"
            fontSize={12}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
          />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip
            labelFormatter={(value) => UtilityService.formatDate(value)}
            formatter={(value, name) => [
              name === 'sales' ? `${value} penjualan` : `${value} order`,
              name === 'sales' ? 'Penjualan' : 'Order'
            ]}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.1}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// Revenue Chart Component
const RevenueChart = ({ data, title, period }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <span className="text-sm text-gray-500">{period} hari terakhir</span>
    </div>

    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            stroke="#666"
            fontSize={12}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
          />
          <YAxis
            stroke="#666"
            fontSize={12}
            tickFormatter={(value) => UtilityService.formatCurrency(value).replace('Rp ', 'Rp')}
          />
          <Tooltip
            labelFormatter={(value) => UtilityService.formatDate(value)}
            formatter={(value, name) => [
              UtilityService.formatCurrency(value),
              name === 'revenue' ? 'Pendapatan' : 'Profit'
            ]}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// Top Products Card
const TopProductsCard = ({ products }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Produk Terlaris</h3>
      <button className="text-blue-600 hover:text-blue-800 text-sm">
        <Eye className="h-4 w-4 inline mr-1" />
        Lihat Semua
      </button>
    </div>

    <div className="space-y-3">
      {products.map((product, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <p className="font-medium text-gray-900">{product.name}</p>
            <p className="text-sm text-gray-600">{product.sales} terjual</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-green-600">
              {UtilityService.formatCurrency(product.revenue)}
            </p>
            <div className={`text-xs flex items-center ${
              product.growth > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.growth > 0 ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
              {Math.abs(product.growth).toFixed(1)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Recent Sales Card
const RecentSalesCard = ({ sales }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Penjualan Terbaru</h3>
      <button className="text-blue-600 hover:text-blue-800 text-sm">
        <Eye className="h-4 w-4 inline mr-1" />
        Lihat Semua
      </button>
    </div>

    <div className="space-y-3">
      {sales.map((sale, index) => (
        <div key={index} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
          <div>
            <p className="font-medium text-gray-900">{sale.order_number}</p>
            <p className="text-sm text-gray-600">{sale.customer_name || 'Customer Umum'}</p>
            <p className="text-xs text-gray-500">{sale.timeAgo}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-green-600">
              {UtilityService.formatCurrency(sale.total_price)}
            </p>
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Selesai
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Stock Alerts Card
const StockAlertsCard = ({ alerts }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
        Peringatan Stok
      </h3>
      <span className="text-sm text-gray-500">{alerts.length} item</span>
    </div>

    <div className="space-y-3 max-h-64 overflow-y-auto">
      {alerts.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Tidak ada peringatan stok</p>
        </div>
      ) : (
        alerts.map((alert, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{alert.productName}</p>
              <p className="text-sm text-gray-600">{alert.variantName}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                alert.level === 'critical' ? 'bg-red-100 text-red-800' :
                  alert.level === 'danger' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
              }`}>
                Stok: {alert.stock}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

// Insights Section
const InsightsSection = ({ data }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Activity className="h-5 w-5 text-blue-600 mr-2" />
      Insights Bisnis
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <InsightCard
        title="Performa Terbaik"
        description="Penjualan meningkat 12.5% dibanding periode sebelumnya"
        type="success"
        icon={TrendingUp}
      />

      <InsightCard
        title="Perlu Perhatian"
        description={`${data.stats.lowStockProducts} produk dengan stok rendah`}
        type="warning"
        icon={AlertTriangle}
      />

      <InsightCard
        title="Rekomendasi"
        description="Tambah stok produk terlaris untuk memaksimalkan penjualan"
        type="info"
        icon={Package}
      />
    </div>
  </div>
);

// Insight Card
const InsightCard = ({ title, description, type, icon: Icon }) => {
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className={`p-4 rounded-lg border ${typeClasses[type]}`}>
      <div className="flex items-start">
        <Icon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h4 className="font-medium mb-1">{title}</h4>
          <p className="text-sm opacity-90">{description}</p>
        </div>
      </div>
    </div>
  );
};