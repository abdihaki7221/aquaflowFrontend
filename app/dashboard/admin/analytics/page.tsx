'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import {
  Users,
  Droplets,
  CreditCard,
  Gauge,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Building,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | '6months'>('monthly')

  const user = {
    name: 'Admin User',
    email: 'admin@aquaflow.com',
    role: 'System Admin'
  }

  const timeRanges = [
    { id: 'daily', label: 'Today' },
    { id: 'weekly', label: 'This Week' },
    { id: 'monthly', label: 'This Month' },
    { id: '6months', label: '6 Months' },
  ]

  // Stats Data
  const statsCards = [
    {
      title: 'Total Users',
      value: '1,284',
      change: '+12.5%',
      isPositive: true,
      icon: Users,
      color: 'water',
      subtitle: '48 new this month'
    },
    {
      title: 'Active Meters',
      value: '1,156',
      change: '+8.2%',
      isPositive: true,
      icon: Gauge,
      color: 'emerald',
      subtitle: '98 pending installation'
    },
    {
      title: 'Water Distributed',
      value: '847,520 L',
      change: '+15.3%',
      isPositive: true,
      icon: Droplets,
      color: 'purple',
      subtitle: 'This month'
    },
    {
      title: 'Revenue Collected',
      value: 'KSH 2.4M',
      change: '+18.7%',
      isPositive: true,
      icon: CreditCard,
      color: 'amber',
      subtitle: 'This month'
    },
  ]

  // Monthly Water Usage Data
  const waterUsageData = [
    { name: 'Jan', usage: 720000, revenue: 1800000 },
    { name: 'Feb', usage: 680000, revenue: 1700000 },
    { name: 'Mar', usage: 750000, revenue: 1875000 },
    { name: 'Apr', usage: 820000, revenue: 2050000 },
    { name: 'May', usage: 790000, revenue: 1975000 },
    { name: 'Jun', usage: 847520, revenue: 2400000 },
  ]

  // User Distribution Data
  const userDistribution = [
    { name: 'Tenants', value: 1180, color: '#00a9ff' },
    { name: 'Staff', value: 85, color: '#10b981' },
    { name: 'Admins', value: 19, color: '#8b5cf6' },
  ]

  // Payment Status Data
  const paymentStatus = [
    { name: 'Paid', value: 892, color: '#10b981' },
    { name: 'Pending', value: 245, color: '#f59e0b' },
    { name: 'Overdue', value: 147, color: '#ef4444' },
  ]

  // Meter Status Data
  const meterStatus = [
    { name: 'Active', value: 1156, color: '#10b981' },
    { name: 'Inactive', value: 45, color: '#6b7280' },
    { name: 'Maintenance', value: 28, color: '#f59e0b' },
    { name: 'Faulty', value: 12, color: '#ef4444' },
  ]

  // Daily Readings Data
  const dailyReadings = [
    { day: 'Mon', readings: 245 },
    { day: 'Tue', readings: 312 },
    { day: 'Wed', readings: 289 },
    { day: 'Thu', readings: 356 },
    { day: 'Fri', readings: 298 },
    { day: 'Sat', readings: 178 },
    { day: 'Sun', readings: 89 },
  ]

  // Transaction Trends
  const transactionTrends = [
    { month: 'Jan', successful: 856, failed: 23 },
    { month: 'Feb', successful: 912, failed: 31 },
    { month: 'Mar', successful: 978, failed: 18 },
    { month: 'Apr', successful: 1045, failed: 27 },
    { month: 'May', successful: 1123, failed: 22 },
    { month: 'Jun', successful: 1198, failed: 19 },
  ]

  // Top Consuming Units
  const topConsumers = [
    { unit: '4A', tenant: 'John Smith', usage: 12500, percentage: 85 },
    { unit: '7B', tenant: 'Sarah Johnson', usage: 11200, percentage: 76 },
    { unit: '2C', tenant: 'Michael Brown', usage: 10800, percentage: 73 },
    { unit: '9A', tenant: 'Emily Davis', usage: 9500, percentage: 64 },
    { unit: '5D', tenant: 'David Wilson', usage: 8900, percentage: 60 },
  ]

  // Recent Activity
  const recentActivity = [
    { type: 'payment', message: 'Unit 4A paid KSH 2,500', time: '5 min ago', icon: CreditCard, color: 'emerald' },
    { type: 'reading', message: 'Meter M-1024 reading recorded', time: '12 min ago', icon: Gauge, color: 'water' },
    { type: 'user', message: 'New tenant onboarded: Alice Cooper', time: '1 hour ago', icon: UserCheck, color: 'purple' },
    { type: 'alert', message: '3 meters due for maintenance', time: '2 hours ago', icon: AlertTriangle, color: 'amber' },
    { type: 'payment', message: 'Unit 7B payment failed', time: '3 hours ago', icon: CreditCard, color: 'rose' },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-lg">
          <p className="text-sm font-medium text-white mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; glow: string }> = {
      water: { bg: 'bg-water-500/20', text: 'text-water-400', glow: 'shadow-water-500/20' },
      emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
      purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
      amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
      rose: { bg: 'bg-rose-500/20', text: 'text-rose-400', glow: 'shadow-rose-500/20' },
    }
    return colors[color] || colors.water
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Analytics Dashboard" 
        subtitle="Comprehensive insights and statistics"
        user={user}
      />
      
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Time Range Filter */}
        <div className="flex flex-wrap gap-2">
          {timeRanges.map((range) => (
            <motion.button
              key={range.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTimeRange(range.id as typeof timeRange)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                timeRange === range.id
                  ? 'bg-water-500/20 text-water-400 border border-water-500/30'
                  : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
              }`}
            >
              {range.label}
            </motion.button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {statsCards.map((stat, index) => {
            const colors = getColorClasses(stat.color)
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-card p-4 sm:p-6 relative overflow-hidden group hover:shadow-lg ${colors.glow}`}
              >
                <div className="flex items-start justify-between mb-2 sm:mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${stat.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-white/60">{stat.title}</p>
                <p className="text-xs text-white/40 mt-1">{stat.subtitle}</p>
                
                {/* Background Decoration */}
                <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full ${colors.bg} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />
              </motion.div>
            )
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Water Usage & Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Water Usage & Revenue</h3>
                <p className="text-sm text-white/60">Monthly comparison</p>
              </div>
              <Activity className="w-5 h-5 text-water-400" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={waterUsageData}>
                <defs>
                  <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00a9ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00a9ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="usage" name="Usage (L)" stroke="#00a9ff" fill="url(#usageGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="revenue" name="Revenue (KSH)" stroke="#10b981" fill="url(#revenueGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Transaction Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Transaction Trends</h3>
                <p className="text-sm text-white/60">Successful vs Failed</p>
              </div>
              <BarChart3 className="w-5 h-5 text-emerald-400" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={transactionTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="successful" name="Successful" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" name="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charts Row 2 - Pie Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* User Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">User Distribution</h3>
              <Users className="w-5 h-5 text-water-400" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {userDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-white/70">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Payment Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Payment Status</h3>
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={paymentStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {paymentStatus.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-white/70">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Meter Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Meter Status</h3>
              <Gauge className="w-5 h-5 text-purple-400" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={meterStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {meterStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {meterStatus.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-white/70">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Daily Readings Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Daily Readings</h3>
              <Calendar className="w-5 h-5 text-water-400" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dailyReadings}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="readings" fill="#00a9ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top Consumers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Top Consumers</h3>
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div className="space-y-3">
              {topConsumers.map((consumer, index) => (
                <div key={consumer.unit} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-water-500/20 flex items-center justify-center text-xs font-bold text-water-400">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">Unit {consumer.unit}</span>
                      <span className="text-xs text-white/60">{consumer.usage.toLocaleString()} L</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${consumer.percentage}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-water-400 to-water-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => {
                const colors = getColorClasses(activity.color)
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <activity.icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{activity.message}</p>
                      <p className="text-xs text-white/40">{activity.time}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}