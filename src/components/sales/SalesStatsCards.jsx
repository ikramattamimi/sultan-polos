import React, { useState } from "react";
import { DollarSign, ShoppingBag, TrendingUp, Users, ChevronDown, ChevronUp } from "lucide-react";
import { StatsCard } from "./index.js";

const SalesStatsCards = ({ stats }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cards = [
    {
      title: "Total Penjualan",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "blue",
      format: "number",
    },
    {
      title: "Total Pendapatan",
      value: stats.totalRevenue,
      icon: DollarSign,
      color: "green",
      format: "currency",
    },
    {
      title: "Rata-rata Order",
      value: stats.averageOrderValue,
      icon: TrendingUp,
      color: "purple",
      format: "currency",
    },
    {
      title: "Pelanggan",
      value: stats.totalCustomers,
      icon: Users,
      color: "orange",
      format: "number",
    },
  ];

  return (
    <div className="mb-6">
      {/* Desktop View - Grid Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 2xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* Mobile View - Accordion */}
      <div className="lg:hidden">
        {/* Accordion Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Statistik Penjualan</h3>
              <p className="text-sm text-gray-500">
                {cards.length} metrik tersedia
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {/* Accordion Content */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {cards.map((card, index) => (
              <StatsCard key={index} {...card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesStatsCards;