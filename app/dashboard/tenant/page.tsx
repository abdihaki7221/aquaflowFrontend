'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import StatCard from '@/components/ui/StatCard'
import {
  Droplets,
  CreditCard,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Sparkles,
  PartyPopper,
  Receipt,
  Gauge,
  ArrowUpRight,
  Bell,
  Download,
  Eye,
  XCircle,
  Hash
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function TenantDashboard() {
  const [showPayModal, setShowPayModal] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('mpesa')

  const user = {
    name: 'John Smith',
    email: 'john@example.com',
    role: 'Tenant'
  }

  const tenantInfo = {
    unit: '4A',
    meter: 'M-1001',
    address: 'Building A, Floor 4'
  }

  const currentBill = {
    amount: 2500,
    dueDate: 'Jan 25, 2024',
    status: 'Pending',
    usage: 250,
    rate: 10
  }

  // All transactions data
  const allTransactions = [
    { id: 'TXN-2024-001', date: 'Jan 15, 2024', time: '14:32', amount: 1850, method: 'M-Pesa', status: 'Completed', reference: 'MPESA-ABC123', billPeriod: 'December 2023' },
    { id: 'TXN-2023-012', date: 'Dec 18, 2023', time: '10:15', amount: 2100, method: 'Bank Transfer', status: 'Completed', reference: 'BANK-XYZ789', billPeriod: 'November 2023' },
    { id: 'TXN-2023-011', date: 'Nov 20, 2023', time: '16:45', amount: 1950, method: 'M-Pesa', status: 'Completed', reference: 'MPESA-DEF456', billPeriod: 'October 2023' },
    { id: 'TXN-2023-010', date: 'Oct 22, 2023', time: '09:20', amount: 2200, method: 'Card', status: 'Completed', reference: 'CARD-GHI789', billPeriod: 'September 2023' },
    { id: 'TXN-2023-009', date: 'Sep 24, 2023', time: '11:30', amount: 2400, method: 'M-Pesa', status: 'Completed', reference: 'MPESA-JKL012', billPeriod: 'August 2023' },
    { id: 'TXN-2023-008', date: 'Aug 20, 2023', time: '15:10', amount: 2650, method: 'Bank Transfer', status: 'Completed', reference: 'BANK-MNO345', billPeriod: 'July 2023' },
    { id: 'TXN-2023-007', date: 'Jul 15, 2023', time: '13:25', amount: 2300, method: 'M-Pesa', status: 'Completed', reference: 'MPESA-PQR678', billPeriod: 'June 2023' },
    { id: 'TXN-2023-006', date: 'Jun 18, 2023', time: '10:50', amount: 2150, method: 'Card', status: 'Completed', reference: 'CARD-STU901', billPeriod: 'May 2023' },
  ]

  // Transaction Statistics
  const transactionStats = {
    total: allTransactions.length,
    completed: allTransactions.filter(t => t.status === 'Completed').length,
    pending: allTransactions.filter(t => t.status === 'Pending').length,
    failed: allTransactions.filter(t => t.status === 'Failed').length,
    totalAmount: allTransactions.reduce((sum, t) => sum + t.amount, 0),
    avgAmount: Math.round(allTransactions.reduce((sum, t) => sum + t.amount, 0) / allTransactions.length)
  }

  const stats = [
    {
      title: 'Current Bill',
      value: `KSH ${currentBill.amount.toLocaleString()}`,
      icon: CreditCard,
      color: 'amber' as const,
      subtitle: `Due: ${currentBill.dueDate}`,
      trend: { value: 12, isPositive: false }
    },
    {
      title: 'Water Usage',
      value: `${currentBill.usage} L`,
      icon: Droplets,
      color: 'water' as const,
      subtitle: 'This month',
      trend: { value: 8, isPositive: false }
    },
    {
      title: 'Total Transactions',
      value: transactionStats.total.toString(),
      icon: Receipt,
      color: 'purple' as const,
      subtitle: `KSH ${(transactionStats.totalAmount / 1000).toFixed(1)}K total paid`
    },
    {
      title: 'Meter Reading',
      value: '12,500 L',
      icon: Gauge,
      color: 'emerald' as const,
      subtitle: 'Last recorded'
    },
  ]

  const usageData = [
    { name: 'Week 1', usage: 52 },
    { name: 'Week 2', usage: 68 },
    { name: 'Week 3', usage: 61 },
    { name: 'Week 4', usage: 69 },
  ]

  const notifications = [
    { id: 1, type: 'warning', title: 'Bill Due Soon', message: 'Your bill of KSH 2,500 is due in 5 days', time: '2h ago' },
    { id: 2, type: 'info', title: 'Meter Reading Updated', message: 'Your meter was read on Jan 20, 2024', time: '2 days ago' },
    { id: 3, type: 'success', title: 'Payment Received', message: 'Thank you for your payment of KSH 1,850', time: 'Jan 15' },
  ]

  const handlePayment = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2500))
    setIsProcessing(false)
    setShowPayModal(false)
    setShowSuccessPopup(true)
    setTimeout(() => setShowSuccessPopup(false), 5000)
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'M-Pesa': return '📱'
      case 'Bank Transfer': return '🏦'
      case 'Card': return '💳'
      default: return '💰'
    }
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Completed':
        return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: CheckCircle }
      case 'Pending':
        return { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: Clock }
      case 'Failed':
        return { bg: 'bg-rose-500/20', text: 'text-rose-400', icon: XCircle }
      default:
        return { bg: 'bg-white/10', text: 'text-white/60', icon: Clock }
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-lg">
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-water-400">{payload[0].value} Liters</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen">
      <Header 
        title={`Welcome back, ${user.name.split(' ')[0]}!`}
        subtitle="Monitor your water usage and manage bills"
        user={user}
      />
      
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Account Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 bg-gradient-to-r from-water-500/10 to-water-600/5 border-water-500/20"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-water-400 to-water-600 flex items-center justify-center">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Unit {tenantInfo.unit}</h2>
                <p className="text-white/60">Meter: {tenantInfo.meter}</p>
                <p className="text-sm text-white/40">{tenantInfo.address}</p>
              </div>
            </div>
            
            {currentBill.status === 'Pending' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPayModal(true)}
                className="glass-button-primary flex items-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Pay KSH {currentBill.amount.toLocaleString()}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={stat.title} {...stat} delay={index * 0.1} />
          ))}
        </div>

        {/* Transaction Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 border border-water-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-water-500/20 flex items-center justify-center">
                <Hash className="w-5 h-5 text-water-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-water-400">{transactionStats.total}</p>
                <p className="text-xs text-white/60">Total Transactions</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4 border border-emerald-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">{transactionStats.completed}</p>
                <p className="text-xs text-white/60">Completed</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 border border-purple-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">KSH {(transactionStats.totalAmount / 1000).toFixed(1)}K</p>
                <p className="text-xs text-white/60">Total Paid</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-4 border border-amber-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-400">KSH {transactionStats.avgAmount.toLocaleString()}</p>
                <p className="text-xs text-white/60">Avg. Payment</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Usage Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Weekly Water Usage</h3>
                <p className="text-sm text-white/60">This month's consumption pattern</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-water-500/20">
                <TrendingUp className="w-4 h-4 text-water-400" />
                <span className="text-sm font-medium text-water-400">250 L Total</span>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00a9ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00a9ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="usage" stroke="#00a9ff" fill="url(#usageGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-water-400" />
                Notifications
              </h3>
              <span className="px-2 py-1 rounded-full bg-water-500/20 text-water-400 text-xs">
                {notifications.filter(n => n.type === 'warning').length} new
              </span>
            </div>
            
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-xl border transition-colors ${
                    notification.type === 'warning' 
                      ? 'bg-amber-500/10 border-amber-500/20' 
                      : notification.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/20'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      notification.type === 'warning' ? 'bg-amber-500/20' :
                      notification.type === 'success' ? 'bg-emerald-500/20' :
                      'bg-water-500/20'
                    }`}>
                      {notification.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                      {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                      {notification.type === 'info' && <Gauge className="w-4 h-4 text-water-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{notification.title}</p>
                      <p className="text-xs text-white/60 mt-0.5">{notification.message}</p>
                      <p className="text-xs text-white/40 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Full Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-400" />
                  Transaction History
                </h3>
                <p className="text-sm text-white/60 mt-1">
                  You have made <span className="text-water-400 font-semibold">{transactionStats.total} transactions</span> totaling <span className="text-emerald-400 font-semibold">KSH {transactionStats.totalAmount.toLocaleString()}</span>
                </p>
              </div>
              <Link href="/dashboard/tenant/transactions">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-button flex items-center gap-2 text-sm"
                >
                  View All
                  <ArrowUpRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Mobile View - Cards */}
          <div className="md:hidden divide-y divide-white/10">
            {allTransactions.slice(0, 5).map((txn, index) => {
              const statusStyles = getStatusStyles(txn.status)
              const StatusIcon = statusStyles.icon
              return (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getMethodIcon(txn.method)}</span>
                      <div>
                        <p className="font-mono text-sm text-water-400">{txn.id}</p>
                        <p className="text-xs text-white/50">{txn.date} • {txn.time}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${statusStyles.bg} ${statusStyles.text}`}>
                      <StatusIcon className="w-3 h-3" />
                      {txn.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/50">Bill Period</p>
                      <p className="text-sm text-white/80">{txn.billPeriod}</p>
                    </div>
                    <p className="text-lg font-bold text-white">KSH {txn.amount.toLocaleString()}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-white/60 uppercase">#</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-white/60 uppercase">Transaction ID</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-white/60 uppercase">Date & Time</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-white/60 uppercase">Bill Period</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-white/60 uppercase">Amount</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-white/60 uppercase">Method</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-white/60 uppercase">Reference</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-white/60 uppercase">Status</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-white/60 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allTransactions.map((txn, index) => {
                  const statusStyles = getStatusStyles(txn.status)
                  const StatusIcon = statusStyles.icon
                  return (
                    <motion.tr
                      key={txn.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t border-white/5 hover:bg-white/5"
                    >
                      <td className="py-4 px-6">
                        <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/60">
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-sm text-water-400">{txn.id}</td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-white">{txn.date}</p>
                        <p className="text-xs text-white/50">{txn.time}</p>
                      </td>
                      <td className="py-4 px-6 text-sm text-white/80">{txn.billPeriod}</td>
                      <td className="py-4 px-6 text-sm font-semibold text-white">KSH {txn.amount.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <span className="flex items-center gap-2 text-sm text-white/80">
                          <span>{getMethodIcon(txn.method)}</span>
                          {txn.method}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-white/60">{txn.reference}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          {txn.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-white/60" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            title="Download Receipt"
                          >
                            <Download className="w-4 h-4 text-white/60" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 border-t border-white/10 bg-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-sm text-white/60">
                Showing <span className="font-medium text-white">{allTransactions.length}</span> of{' '}
                <span className="font-medium text-white">{allTransactions.length}</span> transactions
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white/60">Total:</span>
                  <span className="font-bold text-emerald-400">KSH {transactionStats.totalAmount.toLocaleString()}</span>
                </div>
                <Link href="/dashboard/tenant/transactions">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-sm text-water-400 hover:text-water-300 flex items-center gap-1"
                  >
                    View All Transactions
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPayModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-glass p-4 sm:p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Pay Bill</h2>
                    <p className="text-sm text-white/60">Select payment method</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPayModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Bill Summary */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/60">Water Usage</span>
                  <span className="text-white">{currentBill.usage} L × KSH {currentBill.rate}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-white font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-emerald-400">KSH {currentBill.amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-white/70">Payment Method</p>
                
                {[
                  { id: 'mpesa', name: 'M-Pesa', icon: '📱', description: 'Pay via M-Pesa' },
                  { id: 'bank', name: 'Bank Transfer', icon: '🏦', description: 'Direct bank transfer' },
                  { id: 'card', name: 'Card Payment', icon: '💳', description: 'Visa / Mastercard' },
                ].map((method) => (
                  <motion.button
                    key={method.id}
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full p-4 rounded-xl border transition-all flex items-center gap-4 ${
                      paymentMethod === method.id
                        ? 'bg-emerald-500/20 border-emerald-500/50 ring-2 ring-emerald-500/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <div className="text-left">
                      <p className="font-medium text-white">{method.name}</p>
                      <p className="text-xs text-white/50">{method.description}</p>
                    </div>
                    <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === method.id ? 'border-emerald-400 bg-emerald-400' : 'border-white/30'
                    }`}>
                      {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* M-Pesa Phone Number */}
              {paymentMethod === 'mpesa' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/70 mb-2">M-Pesa Phone Number</label>
                  <input
                    type="tel"
                    defaultValue="+254 700 000 000"
                    className="glass-input w-full"
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPayModal(false)}
                  className="flex-1 glass-button"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 glass-button-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay Now
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 50 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-glass p-5 sm:p-8 w-full max-w-sm text-center relative overflow-hidden"
            >
              {/* Confetti */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(25)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: ['#10b981', '#00a9ff', '#f59e0b', '#ec4899'][i % 4],
                      left: `${Math.random() * 100}%`,
                      top: `-10%`,
                    }}
                    animate={{
                      y: ['0vh', '100vh'],
                      x: [0, (Math.random() - 0.5) * 100],
                      rotate: [0, 360],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      delay: Math.random() * 0.5,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>

              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="relative mx-auto mb-6"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -top-2 -right-2"
                >
                  <PartyPopper className="w-8 h-8 text-amber-400" />
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white mb-2"
              >
                Payment Successful! 🎉
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/60 mb-6"
              >
                Your payment of KSH {currentBill.amount.toLocaleString()} has been processed successfully.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6"
              >
                <p className="text-xs text-white/50 mb-1">Transaction Reference</p>
                <p className="font-mono text-water-400">TXN-2024-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-6"
              >
                <p className="text-sm text-emerald-400">
                  This is your <span className="font-bold">{transactionStats.total + 1}th</span> successful transaction!
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSuccessPopup(false)}
                className="w-full glass-button-primary"
              >
                Done
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}