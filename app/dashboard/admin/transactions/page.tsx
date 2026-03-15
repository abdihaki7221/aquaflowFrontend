'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import { transactionsApi, type StkPushResponse } from '@/lib/api'
import {
  CreditCard, Search, CheckCircle, Clock, XCircle, RefreshCw,
  WifiOff, Banknote, TrendingUp, Download
} from 'lucide-react'

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<StkPushResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'SUCCESS' | 'PENDING' | 'FAILED' | 'CANCELLED'>('all')

  const user = { name: 'Admin User', email: 'admin@aquaflow.com', role: 'System Admin' }

  const fetchTransactions = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const resp = await transactionsApi.getAll()
      if (resp.success && resp.data) {
        setTransactions(resp.data)
      } else { setError(resp.message || 'Failed to load') }
    } catch (err: any) { setError(err.message || 'Server error') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  const filtered = transactions.filter(t => {
    const q = searchQuery.toLowerCase()
    const matchSearch = !q ||
      t.meterNumber?.toLowerCase().includes(q) ||
      t.phone?.includes(q) ||
      t.mpesaReceiptNumber?.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total: transactions.length,
    success: transactions.filter(t => t.status === 'SUCCESS').length,
    pending: transactions.filter(t => t.status === 'PENDING').length,
    failed: transactions.filter(t => t.status === 'FAILED' || t.status === 'CANCELLED').length,
    revenue: transactions.filter(t => t.status === 'SUCCESS').reduce((s, t) => s + (t.amount || 0), 0),
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'SUCCESS': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: CheckCircle }
      case 'PENDING': return { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: Clock }
      case 'FAILED': return { bg: 'bg-rose-500/20', text: 'text-rose-400', icon: XCircle }
      case 'CANCELLED': return { bg: 'bg-slate-500/20', text: 'text-slate-400', icon: XCircle }
      default: return { bg: 'bg-white/10', text: 'text-white/60', icon: Clock }
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="Transactions" subtitle="All M-Pesa payment records" user={user} />
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 space-y-4 sm:space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: 'Total Txns', value: stats.total, icon: CreditCard, color: 'water' },
            { label: 'Successful', value: stats.success, icon: CheckCircle, color: 'emerald' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'amber' },
            { label: 'Failed', value: stats.failed, icon: XCircle, color: 'rose' },
            { label: 'Total Revenue', value: `KSh ${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'emerald' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${s.color}-500/20 flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 text-${s.color}-400`} />
                </div>
                <div>
                  <p className={`text-xl font-bold ${s.color === 'water' ? 'text-white' : `text-${s.color}-400`}`}>{s.value}</p>
                  <p className="text-xs text-white/60">{s.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search / Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by meter, phone, receipt..." className="glass-input w-full pl-12" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'SUCCESS', 'PENDING', 'FAILED'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-lg text-xs font-medium ${statusFilter === s ? 'bg-water-500/20 text-water-400 border border-water-500/30' : 'bg-white/5 text-white/70 border border-white/10'}`}>
                {s === 'all' ? 'All' : s}
              </button>
            ))}
            <button onClick={fetchTransactions} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10" title="Refresh">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* States */}
        {loading && transactions.length === 0 && (
          <div className="glass-card p-12 text-center"><RefreshCw className="w-8 h-8 text-water-400 animate-spin mx-auto mb-4" /><p className="text-white/60">Loading transactions...</p></div>
        )}
        {error && (
          <div className="glass-card p-6 border border-rose-500/30 bg-rose-500/10">
            <div className="flex items-start gap-3"><WifiOff className="w-5 h-5 text-rose-400" /><div><p className="text-rose-400">{error}</p><button onClick={fetchTransactions} className="mt-2 text-sm text-rose-400 underline">Retry</button></div></div>
          </div>
        )}

        {/* Table */}
        {!loading && filtered.length > 0 && (
          <div className="glass-card overflow-hidden">
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-white/10">
                  {['#', 'Receipt / Ref', 'Meter', 'Phone', 'Amount (KSh)', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filtered.map((t, i) => {
                    const ss = getStatusStyle(t.status); const Icon = ss.icon
                    return (
                      <tr key={t.id || i} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3 text-sm text-white/40">{i + 1}</td>
                        <td className="px-4 py-3 text-sm font-mono text-water-400">{t.mpesaReceiptNumber || t.checkoutRequestId?.substring(0, 18) || '—'}</td>
                        <td className="px-4 py-3 text-sm text-white font-mono">{t.meterNumber}</td>
                        <td className="px-4 py-3 text-sm text-white/70">{t.phone}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-white">{t.amount?.toLocaleString()}</td>
                        <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${ss.bg} ${ss.text}`}><Icon className="w-3 h-3" />{t.status}</span></td>
                        <td className="px-4 py-3 text-sm text-white/60">{t.createdAt ? new Date(t.createdAt).toLocaleString() : '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="lg:hidden divide-y divide-white/5">
              {filtered.map((t, i) => {
                const ss = getStatusStyle(t.status); const Icon = ss.icon
                return (
                  <div key={t.id || i} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono text-water-400">{t.mpesaReceiptNumber || t.checkoutRequestId?.substring(0, 12) || '—'}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${ss.bg} ${ss.text}`}><Icon className="w-3 h-3" />{t.status}</span>
                    </div>
                    <div className="flex justify-between text-sm"><span className="text-white/60">Meter: <span className="text-white font-mono">{t.meterNumber}</span></span><span className="text-white font-semibold">KSh {t.amount?.toLocaleString()}</span></div>
                    <div className="flex justify-between text-xs text-white/50"><span>{t.phone}</span><span>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ''}</span></div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {!loading && filtered.length === 0 && transactions.length > 0 && (
          <div className="glass-card p-12 text-center"><CreditCard className="w-12 h-12 text-white/20 mx-auto mb-4" /><p className="text-white/60">No transactions match your search</p></div>
        )}
        {!loading && transactions.length === 0 && !error && (
          <div className="glass-card p-12 text-center"><CreditCard className="w-12 h-12 text-white/20 mx-auto mb-4" /><p className="text-white/60">No transactions recorded yet</p></div>
        )}
      </div>
    </div>
  )
}
