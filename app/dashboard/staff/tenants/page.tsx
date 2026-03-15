'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/layout/Header'
import { smsApi } from '@/lib/api'
import {
  Users, Search, Eye, Edit, CheckCircle, Clock, AlertTriangle, Phone, Mail,
  Home, Gauge, CreditCard, X, MapPin, Calendar, Droplets, Send, MessageSquare,
  Smartphone, Loader2, Bell
} from 'lucide-react'

// Local billing calc for display
function calcBill(litres: number) {
  const u = litres / 1000; let r = u, t = 0
  if (r > 0) { const x = Math.min(r, 6); t += x * 45; r -= x }
  if (r > 0) { const x = Math.min(r, 14); t += x * 55; r -= x }
  if (r > 0) { const x = Math.min(r, 30); t += x * 70; r -= x }
  if (r > 0) { t += r * 80 }
  return Math.round(t)
}

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'overdue'>('all')
  const [selectedTenant, setSelectedTenant] = useState<any>(null)
  const [showTenantModal, setShowTenantModal] = useState(false)

  // SMS notification state
  const [showSmsModal, setShowSmsModal] = useState(false)
  const [smsTenant, setSmsTenant] = useState<any>(null)
  const [smsPhone, setSmsPhone] = useState('')
  const [smsStep, setSmsStep] = useState<'form' | 'sending' | 'success' | 'error'>('form')
  const [smsError, setSmsError] = useState('')

  const user = { name: 'Staff Member', email: 'staff@aquaflow.com', role: 'Staff Admin' }

  const tenants = [
    { id: 'T001', name: 'John Smith', email: 'john@example.com', phone: '+254700010101', unit: '4A', meter: 'M-1001', address: 'Building A, Floor 4', previousReading: 9200, lastReading: 12500, currentUsage: 3300, status: 'Active', dueAmount: 0, joinedDate: '2023-06-15', lastPayment: '2024-01-10' },
    { id: 'T003', name: 'Michael Brown', email: 'michael@example.com', phone: '+254700010103', unit: '2C', meter: 'M-1056', address: 'Building C, Floor 2', previousReading: 8100, lastReading: 15600, currentUsage: 7500, status: 'Overdue', dueAmount: 3200, joinedDate: '2023-05-10', lastPayment: '2023-12-05' },
    { id: 'T002', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+254700010102', unit: '7B', meter: 'M-1024', address: 'Building B, Floor 7', previousReading: 7600, lastReading: 9850, currentUsage: 2250, status: 'Active', dueAmount: 0, joinedDate: '2023-07-22', lastPayment: '2024-01-15' },
    { id: 'T004', name: 'Emily Davis', email: 'emily@example.com', phone: '+254700010104', unit: '9A', meter: 'M-1089', address: 'Building A, Floor 9', previousReading: 5500, lastReading: 8720, currentUsage: 3220, status: 'Active', dueAmount: 1750, joinedDate: '2023-08-01', lastPayment: '2024-01-12' },
    { id: 'T005', name: 'David Wilson', email: 'david@example.com', phone: '+254700010105', unit: '5D', meter: 'M-1102', address: 'Building D, Floor 5', previousReading: 10000, lastReading: 14200, currentUsage: 4200, status: 'Pending', dueAmount: 2840, joinedDate: '2023-09-15', lastPayment: '2024-01-08' },
    { id: 'T006', name: 'Alice Cooper', email: 'alice@example.com', phone: '+254700010106', unit: '3B', meter: 'M-1033', address: 'Building B, Floor 3', previousReading: 9800, lastReading: 11300, currentUsage: 1500, status: 'Active', dueAmount: 0, joinedDate: '2023-10-20', lastPayment: '2024-01-14' },
    { id: 'T007', name: 'Bob Martin', email: 'bob@example.com', phone: '+254700010107', unit: '6C', meter: 'M-1067', address: 'Building C, Floor 6', previousReading: 3400, lastReading: 7650, currentUsage: 4250, status: 'Overdue', dueAmount: 1530, joinedDate: '2023-11-05', lastPayment: '2023-12-20' },
    { id: 'T008', name: 'Carol White', email: 'carol@example.com', phone: '+254700010108', unit: '8A', meter: 'M-1082', address: 'Building A, Floor 8', previousReading: 11200, lastReading: 13400, currentUsage: 2200, status: 'Active', dueAmount: 0, joinedDate: '2023-12-01', lastPayment: '2024-01-15' },
    { id: 'T009', name: 'Dan Green', email: 'dan@example.com', phone: '+254700010109', unit: '1D', meter: 'M-1015', address: 'Building D, Floor 1', previousReading: 7800, lastReading: 9200, currentUsage: 1400, status: 'Overdue', dueAmount: 630, joinedDate: '2023-04-15', lastPayment: '2023-11-25' },
  ]

  const stats = {
    total: tenants.length,
    active: tenants.filter(t => t.status === 'Active').length,
    pending: tenants.filter(t => t.status === 'Pending').length,
    overdue: tenants.filter(t => t.status === 'Overdue').length,
  }

  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.meter.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || t.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Active': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: CheckCircle }
      case 'Pending': return { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: Clock }
      case 'Overdue': return { bg: 'bg-rose-500/20', text: 'text-rose-400', icon: AlertTriangle }
      default: return { bg: 'bg-white/10', text: 'text-white/60', icon: Clock }
    }
  }

  // ---- SMS Notify ----
  const openSmsModal = (tenant: any) => {
    setSmsTenant(tenant); setSmsPhone(tenant.phone); setSmsStep('form'); setSmsError(''); setShowSmsModal(true)
  }

  const handleSendSms = async () => {
    if (!smsTenant || !smsPhone.trim()) return
    setSmsStep('sending'); setSmsError('')
    const consumed = Math.round(smsTenant.currentUsage / 1000)
    const amount = calcBill(smsTenant.currentUsage)
    try {
      const resp = await smsApi.sendNotification({
        phone: smsPhone,
        meterNumber: smsTenant.meter,
        tenantName: smsTenant.name,
        previousReading: smsTenant.previousReading,
        currentReading: smsTenant.lastReading,
        consumed,
        amount,
      })
      if (resp.success) {
        setSmsStep('success')
      } else {
        setSmsError(resp.message || 'SMS delivery failed')
        setSmsStep('error')
      }
    } catch (err: any) {
      setSmsError(err.message || 'Failed to send SMS')
      setSmsStep('error')
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="Tenants" subtitle="Manage and view all tenant information" user={user} />
      
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 space-y-4 sm:space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Total', value: stats.total, icon: Users, color: 'water' },
            { label: 'Active', value: stats.active, icon: CheckCircle, color: 'emerald' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'amber' },
            { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'rose' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${s.color}-500/20 flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 text-${s.color}-400`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${s.color === 'water' ? 'text-white' : `text-${s.color}-400`}`}>{s.value}</p>
                  <p className="text-xs text-white/60">{s.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tenants by name, unit, or meter..." className="glass-input w-full pl-12" />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'pending', 'overdue'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${statusFilter === s ? 'bg-water-500/20 text-water-400 border border-water-500/30' : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Tenant Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredTenants.map((tenant, index) => {
            const statusStyles = getStatusStyles(tenant.status)
            const StatusIcon = statusStyles.icon
            const billAmount = calcBill(tenant.currentUsage)
            const isOverdue = tenant.status === 'Overdue'

            return (
              <motion.div key={tenant.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                className="glass-card p-5 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-water-400/20 to-water-600/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-water-400">{tenant.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{tenant.name}</h3>
                      <p className="text-xs text-white/50">Unit {tenant.unit}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}>
                    <StatusIcon className="w-3 h-3" />{tenant.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm"><Gauge className="w-4 h-4 text-white/40" /><span className="text-white/60">Meter:</span><span className="text-white font-mono">{tenant.meter}</span></div>
                  <div className="flex items-center gap-2 text-sm"><Droplets className="w-4 h-4 text-white/40" /><span className="text-white/60">Usage:</span><span className="text-water-400">{tenant.currentUsage.toLocaleString()} L</span></div>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="w-4 h-4 text-white/40" /><span className="text-white/60">Bill:</span>
                    <span className={billAmount > 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400'}>KSh {billAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setSelectedTenant(tenant); setShowTenantModal(true) }}
                    className="flex-1 py-2 rounded-lg bg-water-500/20 text-water-400 text-sm font-medium hover:bg-water-500/30 flex items-center justify-center gap-1.5">
                    <Eye className="w-4 h-4" />View
                  </motion.button>

                  {isOverdue && (
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => openSmsModal(tenant)}
                      className="flex-1 py-2 rounded-lg bg-rose-500/20 text-rose-400 text-sm font-medium hover:bg-rose-500/30 flex items-center justify-center gap-1.5">
                      <Bell className="w-4 h-4" />Notify
                    </motion.button>
                  )}

                  <motion.button whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10">
                    <Edit className="w-4 h-4 text-white/60" />
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {filteredTenants.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white/80">No tenants found</h3>
            <p className="text-sm text-white/50 mt-1">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* ==================== SMS NOTIFICATION MODAL ==================== */}
      <AnimatePresence>
        {showSmsModal && smsTenant && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSmsModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-glass p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>

              {/* FORM */}
              {smsStep === 'form' && (() => {
                const consumed = Math.round(smsTenant.currentUsage / 1000)
                const billAmt = calcBill(smsTenant.currentUsage)
                return (<>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div><h2 className="text-lg font-display font-bold text-white">SMS Bill Notification</h2><p className="text-sm text-white/60">Notify overdue tenant</p></div>
                    </div>
                    <button onClick={() => setShowSmsModal(false)} className="p-2 rounded-lg hover:bg-white/10"><X className="w-5 h-5 text-white/60" /></button>
                  </div>

                  {/* Tenant info */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-2 rounded-lg bg-white/5"><p className="text-xs text-white/50">Tenant</p><p className="font-semibold text-white">{smsTenant.name}</p></div>
                      <div className="p-2 rounded-lg bg-white/5"><p className="text-xs text-white/50">Meter</p><p className="font-mono font-semibold text-water-400">{smsTenant.meter}</p></div>
                    </div>
                  </div>

                  {/* Editable phone */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white/70 mb-2">Phone Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input type="tel" value={smsPhone} onChange={e => setSmsPhone(e.target.value)} placeholder="0712345678"
                        className="glass-input w-full pl-12" />
                    </div>
                    <p className="text-xs text-white/40 mt-1">SMS will be sent to this number via FluxSMS</p>
                  </div>

                  {/* Message preview */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-rose-500/20 mb-6">
                    <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Message Preview</h3>
                    <div className="text-sm text-white/80 whitespace-pre-line leading-relaxed font-mono bg-white/5 rounded-lg p-3 text-xs">
{`Dear ${smsTenant.name},
Your water bill as of ${new Date().toLocaleDateString('en-GB')}
Acc No: ${smsTenant.meter}
Prev Read: ${smsTenant.previousReading} | Curr Read: ${smsTenant.lastReading}
Consumed: ${consumed} units
Total Bill: KSh ${billAmt.toLocaleString()}
Pay before: ${new Date(Date.now() + 14 * 86400000).toLocaleDateString('en-GB')}
Pay via M-Pesa Paybill: 4010159
Account No: ${smsTenant.meter}
Thank You - AquaFlow`}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button whileTap={{ scale: 0.98 }} onClick={() => setShowSmsModal(false)} className="flex-1 glass-button">Cancel</motion.button>
                    <motion.button whileTap={{ scale: 0.98 }} onClick={handleSendSms} disabled={!smsPhone.trim()}
                      className="flex-1 glass-button-primary flex items-center justify-center gap-2 disabled:opacity-50 bg-rose-500/80 hover:bg-rose-500">
                      <Send className="w-5 h-5" />Send SMS
                    </motion.button>
                  </div>
                </>)
              })()}

              {/* SENDING */}
              {smsStep === 'sending' && (
                <div className="py-12 text-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-500/20 flex items-center justify-center">
                    <Send className="w-10 h-10 text-rose-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Sending SMS...</h3>
                  <p className="text-white/60 text-sm">Delivering bill notification to {smsPhone}</p>
                </div>
              )}

              {/* SUCCESS */}
              {smsStep === 'success' && (
                <div className="py-10 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-emerald-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">SMS Sent!</h3>
                  <p className="text-white/60 text-sm mb-6">Bill notification delivered to {smsPhone}</p>
                  <motion.button whileTap={{ scale: 0.98 }} onClick={() => setShowSmsModal(false)} className="px-8 py-3 glass-button-primary">Done</motion.button>
                </div>
              )}

              {/* ERROR */}
              {smsStep === 'error' && (
                <div className="py-10 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-rose-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">SMS Failed</h3>
                  <p className="text-white/60 text-sm mb-6">{smsError}</p>
                  <div className="flex gap-3">
                    <motion.button whileTap={{ scale: 0.98 }} onClick={() => setShowSmsModal(false)} className="flex-1 glass-button">Close</motion.button>
                    <motion.button whileTap={{ scale: 0.98 }} onClick={() => { setSmsStep('form'); setSmsError('') }}
                      className="flex-1 glass-button-primary">Retry</motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== TENANT DETAILS MODAL ==================== */}
      <AnimatePresence>
        {showTenantModal && selectedTenant && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowTenantModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-glass p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-water-400 to-water-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{selectedTenant.name.split(' ').map((n: string) => n[0]).join('')}</span>
                  </div>
                  <div><h2 className="text-xl font-bold text-white">{selectedTenant.name}</h2><p className="text-sm text-white/60">ID: {selectedTenant.id}</p></div>
                </div>
                <button onClick={() => setShowTenantModal(false)} className="p-2 rounded-lg hover:bg-white/10"><X className="w-5 h-5 text-white/60" /></button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-white/80 mb-3">Contact</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-white/40" /><span className="text-sm text-white">{selectedTenant.email}</span></div>
                    <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-white/40" /><span className="text-sm text-white">{selectedTenant.phone}</span></div>
                    <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-white/40" /><span className="text-sm text-white">{selectedTenant.address}</span></div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-white/80 mb-3">Meter & Usage</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-white/5"><p className="text-xs text-white/50">Unit</p><p className="text-lg font-bold text-white">{selectedTenant.unit}</p></div>
                    <div className="p-3 rounded-lg bg-white/5"><p className="text-xs text-white/50">Meter</p><p className="text-lg font-bold text-water-400">{selectedTenant.meter}</p></div>
                    <div className="p-3 rounded-lg bg-white/5"><p className="text-xs text-white/50">Prev Reading</p><p className="text-lg font-bold text-white">{selectedTenant.previousReading?.toLocaleString()} L</p></div>
                    <div className="p-3 rounded-lg bg-white/5"><p className="text-xs text-white/50">Curr Reading</p><p className="text-lg font-bold text-water-400">{selectedTenant.lastReading?.toLocaleString()} L</p></div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-white/80 mb-3">Billing</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-white/5"><p className="text-xs text-white/50">Current Bill</p><p className="text-lg font-bold text-amber-400">KSh {calcBill(selectedTenant.currentUsage).toLocaleString()}</p></div>
                    <div className="p-3 rounded-lg bg-white/5"><p className="text-xs text-white/50">Last Payment</p><p className="text-lg font-bold text-white">{selectedTenant.lastPayment}</p></div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button whileTap={{ scale: 0.98 }} onClick={() => setShowTenantModal(false)} className="flex-1 glass-button">Close</motion.button>
                {selectedTenant.status === 'Overdue' && (
                  <motion.button whileTap={{ scale: 0.98 }} onClick={() => { setShowTenantModal(false); openSmsModal(selectedTenant) }}
                    className="flex-1 glass-button-primary flex items-center justify-center gap-2 bg-rose-500/80 hover:bg-rose-500">
                    <Bell className="w-4 h-4" />Send Notification
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
