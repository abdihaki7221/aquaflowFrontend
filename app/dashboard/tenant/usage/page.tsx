'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import {
  Droplets,
  TrendingUp,
  TrendingDown,
  Calendar,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Activity
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
  LineChart,
  Line
} from 'recharts'

export default function WaterUsagePage() {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'yearly'>('monthly')

  const user = {
    name: 'John Smith',
    email: 'john@example.com',
    role: 'Tenant'
  }

  const usageStats = {
    current: 250,
    previous: 230,
    average: 220,
    limit: 500,
    percentageUsed: 50,
    trend: 8.7
  }

  const weeklyData = [
    { name: 'Mon', usage: 32, average: 35 },
    { name: 'Tue', usage: 38, average: 35 },
    { name: 'Wed', usage: 35, average: 35 },
    { name: 'Thu', usage: 42, average: 35 },
    { name: 'Fri', usage: 45, average: 35 },
    { name: 'Sat', usage: 28, average: 35 },
    { name: 'Sun', usage: 30, average: 35 },
  ]

  const monthlyData = [
    { name: 'Week 1', usage: 52 },
    { name: 'Week 2', usage: 68 },
    { name: 'Week 3', usage: 61 },
    { name: 'Week 4', usage: 69 },
  ]

  const yearlyData = [
    { name: 'Jan', usage: 220 },
    { name: 'Feb', usage: 195 },
    { name: 'Mar', usage: 230 },
    { name: 'Apr', usage: 245 },
    { name: 'May', usage: 260 },
    { name: 'Jun', usage: 285 },
    { name: 'Jul', usage: 310 },
    { name: 'Aug', usage: 295 },
    { name: 'Sep', usage: 270 },
    { name: 'Oct', usage: 240 },
    { name: 'Nov', usage: 230 },
    { name: 'Dec', usage: 250 },
  ]

  const meterReadings = [
    { date: 'Jan 20, 2024', reading: 12500, usage: 250 },
    { date: 'Dec 20, 2023', reading: 12250, usage: 230 },
    { date: 'Nov 20, 2023', reading: 12020, usage: 220 },
    { date: 'Oct 20, 2023', reading: 11800, usage: 210 },
    { date: 'Sep 20, 2023', reading: 11590, usage: 240 },
  ]

  const getChartData = () => {
    switch (timeRange) {
      case 'weekly': return weeklyData
      case 'monthly': return monthlyData
      case 'yearly': return yearlyData
      default: return monthlyData
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-lg">
          <p className="text-sm font-medium text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value} L
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Water Usage" 
        subtitle="Monitor your water consumption"
        user={user}
      />
      
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Usage Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-water-500/20 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-water-400" />
              </div>
              <div className="flex items-center gap-1 text-rose-400 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                +{usageStats.trend}%
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{usageStats.current} L</p>
            <p className="text-sm text-white/60">Current Month Usage</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{usageStats.previous} L</p>
            <p className="text-sm text-white/60">Previous Month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{usageStats.average} L</p>
            <p className="text-sm text-white/60">Monthly Average</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Gauge className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">12,500 L</p>
            <p className="text-sm text-white/60">Current Meter Reading</p>
          </motion.div>
        </div>

        {/* Usage Gauge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Usage Progress</h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                  fill="none"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 440' }}
                  animate={{ strokeDasharray: `${usageStats.percentageUsed * 4.4} 440` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00a9ff" />
                    <stop offset="100%" stopColor="#4dc8ff" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{usageStats.percentageUsed}%</span>
                <span className="text-xs text-white/60">of limit</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Used this month</span>
                  <span className="text-white font-medium">{usageStats.current} L</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${usageStats.percentageUsed}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-water-400 to-water-500 rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Remaining allowance</span>
                  <span className="text-emerald-400 font-medium">{usageStats.limit - usageStats.current} L</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((usageStats.limit - usageStats.current) / usageStats.limit) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                  />
                </div>
              </div>
              <p className="text-xs text-white/40 mt-2">Monthly allowance: {usageStats.limit} L</p>
            </div>
          </div>
        </motion.div>

        {/* Usage Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Usage Trends</h3>
              <p className="text-sm text-white/60">Track your water consumption over time</p>
            </div>
            <div className="flex gap-2">
              {['weekly', 'monthly', 'yearly'].map((range) => (
                <motion.button
                  key={range}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTimeRange(range as typeof timeRange)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    timeRange === range
                      ? 'bg-water-500/20 text-water-400 border border-water-500/30'
                      : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {range}
                </motion.button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            {timeRange === 'weekly' ? (
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="usage" fill="#00a9ff" radius={[4, 4, 0, 0]} name="Usage" />
                <Bar dataKey="average" fill="rgba(255,255,255,0.2)" radius={[4, 4, 0, 0]} name="Average" />
              </BarChart>
            ) : (
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="usageGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00a9ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00a9ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="usage" stroke="#00a9ff" fill="url(#usageGradient2)" strokeWidth={2} name="Usage" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </motion.div>

        {/* Meter Reading History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-water-400" />
              Meter Reading History
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase">Meter Reading</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase">Usage</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase">Trend</th>
                </tr>
              </thead>
              <tbody>
                {meterReadings.map((reading, index) => {
                  const prevReading = meterReadings[index + 1]
                  const trend = prevReading ? reading.usage - prevReading.usage : 0
                  return (
                    <motion.tr
                      key={reading.date}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="py-3 px-4 text-sm text-white">{reading.date}</td>
                      <td className="py-3 px-4 text-sm font-mono text-water-400">{reading.reading.toLocaleString()} L</td>
                      <td className="py-3 px-4 text-sm text-white">{reading.usage} L</td>
                      <td className="py-3 px-4">
                        {trend !== 0 && (
                          <span className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {Math.abs(trend)} L
                          </span>
                        )}
                        {trend === 0 && <span className="text-white/40 text-sm">-</span>}
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Usage Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border-emerald-500/20"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Water Saving Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { tip: 'Fix leaky faucets - A dripping tap wastes up to 15 liters per day', savings: '450 L/month' },
              { tip: 'Take shorter showers - Reducing by 2 minutes saves significant water', savings: '300 L/month' },
              { tip: 'Only run full loads - Wait for full dishwasher/washing machine loads', savings: '200 L/month' },
            ].map((item, index) => (
              <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-white mb-2">{item.tip}</p>
                <p className="text-xs text-emerald-400 font-medium">Potential savings: {item.savings}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}