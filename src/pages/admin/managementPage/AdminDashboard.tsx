"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  DollarSign,
  BookOpen,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal,
} from "lucide-react";
import DateFilter, { type FilterPeriod } from "@/components/admin/dashboard/DateFilter";
import { useGetAllDashboardDataMutation } from "@/hooks/AdminCustomHooks";
import { WalletTransactionGraph } from "@/components/common/dashboard-tracking/RevenewTracking";

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: "up" | "down";
  color: string;
}

interface DashboardData {
  totalEvents: number;
  totalClients: number;
  totalRevenue: number;
  totalBookings: number;
  totalVendors: number;
}

interface Transaction {
  _id: string;
  amount: number;
  currency: string;
  paymentStatus: "credit" | "debit";
  paymentType: string;
  walletId: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}




const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, trend, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        <div className={`flex items-center gap-1 text-sm ${trend === "up" ? "text-green-400" : "text-red-400"}`}>
          {trend === "up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {change > 0 ? "+" : ""}
          {change}%
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
      <div className="mt-4 h-8 flex items-end gap-1">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm ${trend === "up" ? "bg-green-500" : "bg-red-500"}`}
            style={{ height: `${Math.random() * 100}%`, opacity: 0.3 + Math.random() * 0.7 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

const AdminDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<FilterPeriod>("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const getAllDashboardDataMutation = useGetAllDashboardDataMutation();


  useEffect(() => {
    getAllDashboardDataMutation.mutate(
       selectedPeriod,
       {
      onSuccess: (response) => {
        setDashboardData(response.data);
      },
      onError: (error) => {
        console.log("error while admin get all dashboard data", error);
      },
    });
  }, [selectedPeriod]);


  const formatValue = (value: number, type: "currency" | "number" = "number") => {
    if (type === "currency") {
      if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
      return `₹${value}`;
    }

    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (getAllDashboardDataMutation.isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  if (getAllDashboardDataMutation.isError) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <p className="text-white text-lg">
          Error loading dashboard data: {(getAllDashboardDataMutation.error as Error).message}
        </p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <p className="text-white text-lg">No data available.</p>
      </div>
    );
  }

  // Map backend data to StatCardProps format
  const formattedStats: StatCardProps[] = [
    {
      title: "Total Events",
      value: formatValue(dashboardData.totalEvents),
      change: 10,
      trend: "up",
      icon: <Calendar size={24} className="text-blue-400" />,
      color: "bg-blue-500/20",
    },
    {
      title: "Total Clients",
      value: formatValue(dashboardData.totalClients),
      change: 5,
      trend: "up",
      icon: <Users size={24} className="text-green-400" />,
      color: "bg-green-500/20",
    },
    {
      title: "Total Revenue",
      value: formatValue(dashboardData.totalRevenue, "currency"),
      change: 15,
      trend: "up",
      icon: <IndianRupee size={24} className="text-yellow-400" />,
      color: "bg-yellow-500/20",
    },
    {
      title: "Total Bookings",
      value: formatValue(dashboardData.totalBookings),
      change: 8,
      trend: "up",
      icon: <BookOpen size={24} className="text-purple-400" />,
      color: "bg-purple-500/20",
    },
    {
      title: "Total Vendors",
      value: formatValue(dashboardData.totalVendors),
      change: 3,
      trend: "up",
      icon: <Users size={24} className="text-teal-400" />,
      color: "bg-teal-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back! Here's what's happening with your platform.</p>
          </div>

          <DateFilter
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            theme="dark"
          />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          key={`stats-${selectedPeriod}-${selectedDate.getTime()}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {formattedStats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </motion.div>

        {/* Wallet Transaction Graph */}
        <WalletTransactionGraph transactions={dashboardData?.transactions} period={selectedPeriod} theme="dark" />
      </motion.div>
    </div>
  );
};

export default AdminDashboard;


