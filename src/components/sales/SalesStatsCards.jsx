
// SalesStatsCards Component
import React from "react";
import {DollarSign, ShoppingBag, TrendingUp, Users} from "lucide-react";
import {StatsCard} from "./index.js";

const SalesStatsCards = ({ stats }) => {
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
      value: stats.totalCustomers, // Bisa diganti dengan unique customers
      icon: Users,
      color: "orange",
      format: "number",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => (
        <StatsCard key={index} {...card} />
      ))}
    </div>
  );
};

export default SalesStatsCards;