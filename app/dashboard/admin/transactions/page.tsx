'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/layout/Header'
import {
  CreditCard,
  Download,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  X,
  RefreshCw
} from 'lucide-react'

export default function TransactionsPage() {
  const [dateFilter, setDateFilter] = useState<'daily' | 'weekly' | 'monthly' | '6months' | 'custom'>('monthly')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCustomDate, setShowCustomDate] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all')

  const user = {
    name: 'Admin User',
    email: 'admin@aquaflow.com',
    role: 'System Admin'
  }

  const dateFilters = [
    { id: 'daily', label: 'Today' },
    { id: 'weekly', label: 'This Week' },
    { id: 'monthly', label: 'This Month' },
    { id: '6months', label: '6 Months' },
    { id: 'custom', label: 'Custom' },
  ]

  const transactions = [
    { id: 'TXN-2024-001', tenant: 'John Smith', unit: '4A', meter: 'M-1001', amount: 2500, waterUnits: 250, method: 'M-Pesa', status: 'Completed', date: '2024-01-15', time: '14:32' },
    { id: 'TXN-2024-002', tenant: 'Sarah Johnson', unit: '7B', meter: 'M-1024', amount: 1850, waterUnits: 185, method: 'Bank Transfer', status: 'Completed', date: '2024-01-15', time: '12:15' },
    { id: 'TXN-2024-003', tenant: 'Michael Brown', unit: '2C', meter: 'M-1056', amount: 3200, waterUnits: 320, method: 'M-Pesa', status: 'Pending', date: '2024-01-15', time: '10:45' },
    { id: 'TXN-2024-004', tenant: 'Emily Davis', unit: '9A', meter: 'M-1089', amount: 1500, waterUnits: 150, method: 'Card', status: 'Completed', date: '2024-01-14', time: '16:20' },
    { id: 'TXN-2024-005', tenant: 'David Wilson', unit: '5D', meter: 'M-1102', amount: 2100, waterUnits: 210, method: 'M-Pesa', status: 'Failed', date: '2024-01-14', time: '09:30' },
    { id: 'TXN-2024-006', tenant: 'Alice Cooper', unit: '3B', meter: 'M-1033', amount: 1750, waterUnits: 175, method: 'Bank Transfer', status: 'Completed', date: '2024-01-14', time: '08:15' },
    { id: 'TXN-2024-007', tenant: 'Bob Martin', unit: '6C', meter: 'M-1067', amount: 2800, waterUnits: 280, method: 'M-Pesa', status: 'Completed', date: '2024-01-13', time: '17:45' },
    { id: 'TXN-2024-008', tenant: 'Carol White', unit: '8A', meter: 'M-1082', amount: 1950, waterUnits: 195, method: 'Card', status: 'Pending', date: '2024-01-13', time: '15:00' },
    { id: 'TXN-2024-009', tenant: 'Dan Green', unit: '1D', meter: 'M-1015', amount: 2300, waterUnits: 230, method: 'M-Pesa', status: 'Completed', date: '2024-01-13', time: '11:30' },
    { id: 'TXN-2024-010', tenant: 'Eva Martinez', unit: '5A', meter: 'M-1045', amount: 1650, waterUnits: 165, method: 'Bank Transfer', status: 'Completed', date: '2024-01-12', time: '14:00' },
  ]

  const stats = {
    totalTransactions: transactions.length,
    totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
    completed: transactions.filter(t => t.status === 'Completed').length,
    pending: transactions.filter(t => t.status === 'Pending').length,
    failed: transactions.filter(t => t.status === 'Failed').length,
  }

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.meter.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || t.status.toLowerCase() === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleExportExcel = async () => {
    setIsExporting(true)
    
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Create CSV content
    const headers = ['Transaction ID', 'Tenant', 'Unit', 'Meter', 'Amount (KSH)', 'Water Units (L)', 'Method', 'Status', 'Date', 'Time']
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => 
        [t.id, t.tenant, t.unit, t.meter, t.amount, t.waterUnits, t.method, t.status, t.date, t.time].join(',')
      )
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
    link.click()

    setIsExporting(false)
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

  return (
    <div className="min-h-screen">
      <Header 
        title="Transactions" 
        subtitle="View and manage all water payment transactions"
        user={user}
      />
      
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-water-500/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-water-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalTransactions}</p>
                <p className="text-xs text-white/60">Total</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">KSH {(stats.totalAmount / 1000).toFixed(1)}K</p>
                <p className="text-xs text-white/60">Revenue</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">{stats.completed}</p>
                <p className="text-xs text-white/60">Completed</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
                <p className="text-xs text-white/60">Pending</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-400">{stats.failed}</p>
                <p className="text-xs text-white/60">Failed</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters & Actions */}
        <div className="glass-card p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Date Filters */}
            <div className="flex flex-wrap gap-2">
              {dateFilters.map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setDateFilter(filter.id as typeof dateFilter)
                    if (filter.id === 'custom') {
                      setShowCustomDate(true)
                    } else {
                      setShowCustomDate(false)
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    dateFilter === filter.id
                      ? 'bg-water-500/20 text-water-400 border border-water-500/30'
                      : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {filter.id === 'custom' && <Calendar className="w-4 h-4" />}
                  {filter.label}
                </motion.button>
              ))}
            </div>

            {/* Search & Export */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search transactions..."
                  className="glass-input pl-10 pr-4 py-2 text-sm w-full sm:w-64"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="bg-slate-800 text-white border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-water-400 flex-1 sm:flex-none"
                >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportExcel}
                disabled={isExporting}
                className="glass-button-primary flex items-center justify-center gap-2 py-2 disabled:opacity-50"
              >
                {isExporting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <FileSpreadsheet className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Export Excel</span>
              </motion.button>
              </div>
            </div>
          </div>

          {/* Custom Date Range */}
          <AnimatePresence>
            {showCustomDate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-slate-800 text-white border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-water-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/60 mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-slate-800 text-white border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-water-400"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-button py-2 mt-5"
                  >
                    Apply
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Tenant</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Meter</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Water Units</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => {
                  const statusStyles = getStatusStyles(transaction.status)
                  const StatusIcon = statusStyles.icon
                  return (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-water-400">{transaction.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-white">{transaction.tenant}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-white/80">{transaction.unit}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-white/60 font-mono">{transaction.meter}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-white">KSH {transaction.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-white/80">{transaction.waterUnits} L</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-lg bg-white/5 text-xs text-white/70">{transaction.method}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-white">{transaction.date}</p>
                          <p className="text-xs text-white/50">{transaction.time}</p>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-sm text-white/60">
              Showing <span className="font-medium text-white">1-{filteredTransactions.length}</span> of{' '}
              <span className="font-medium text-white">{filteredTransactions.length}</span> transactions
            </p>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
                disabled
              >
                <ChevronLeft className="w-4 h-4 text-white/70" />
              </motion.button>
              
              {[1, 2, 3].map((page) => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    page === 1 ? 'bg-water-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {page}
                </motion.button>
              ))}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white/70" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}