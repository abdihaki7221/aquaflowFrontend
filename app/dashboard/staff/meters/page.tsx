'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/layout/Header'
import { metersApi, stkApi, type Meter as ApiMeter, type StkPushResponse, type BillCalculation } from '@/lib/api'
import {
  Gauge, Search, CheckCircle, Clock, AlertTriangle, X, Camera, Save,
  Sparkles, Droplets, User, Home, Phone, Calendar, ChevronDown, Trash2,
  PartyPopper, Send, Smartphone, Banknote, ArrowRight, Shield, AlertCircle, RefreshCw, WifiOff
} from 'lucide-react'

// Local bill calculator (used when backend is unreachable as fallback)
function calculateWaterBill(usageLitres: number) {
  const units = usageLitres / 1000
  let remaining = units, total = 0
  const breakdown: { tier: string; units: number; rate: number; subtotal: number }[] = []
  if (remaining > 0) { const t = Math.min(remaining, 6); total += t * 45; breakdown.push({ tier: '0–6 units', units: Math.round(t * 100) / 100, rate: 45, subtotal: Math.round(t * 45) }); remaining -= t }
  if (remaining > 0) { const t = Math.min(remaining, 14); total += t * 55; breakdown.push({ tier: '7–20 units', units: Math.round(t * 100) / 100, rate: 55, subtotal: Math.round(t * 55) }); remaining -= t }
  if (remaining > 0) { const t = Math.min(remaining, 30); total += t * 70; breakdown.push({ tier: '21–50 units', units: Math.round(t * 100) / 100, rate: 70, subtotal: Math.round(t * 70) }); remaining -= t }
  if (remaining > 0) { total += remaining * 80; breakdown.push({ tier: '50+ units', units: Math.round(remaining * 100) / 100, rate: 80, subtotal: Math.round(remaining * 80) }) }
  return { units: Math.round(units * 100) / 100, amount: Math.round(total), breakdown }
}

// Convert backend Meter to display format
function meterToDisplay(m: ApiMeter) {
  const usage = m.currentReading - m.previousReading
  return {
    id: m.meterNumber, tenant: m.tenantName, unit: m.unitNumber,
    lastReading: m.currentReading, previousReading: m.previousReading,
    currentMonthUsage: usage > 0 ? usage : 0,
    lastReadDate: m.lastReadDate ? new Date(m.lastReadDate).toISOString().split('T')[0] : 'N/A',
    status: m.status === 'ACTIVE' ? 'Active' : m.status === 'PENDING' ? 'Pending' : m.status,
    phone: m.phone, email: m.email, address: m.address,
  }
}

export default function MeterReadingsPage() {
  // Meter data from API
  const [meters, setMeters] = useState<ReturnType<typeof meterToDisplay>[]>([])
  const [isLoadingMeters, setIsLoadingMeters] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Reading modal
  const [showReadingModal, setShowReadingModal] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [selectedMeter, setSelectedMeter] = useState<any>(null)
  const [newReading, setNewReading] = useState('')
  const [notes, setNotes] = useState('')
  const [meterSearch, setMeterSearch] = useState('')
  const [showMeterDropdown, setShowMeterDropdown] = useState(false)
  const [isLoadingMeter, setIsLoadingMeter] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending'>('all')
  
  // Payment prompt state
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMeter, setPaymentMeter] = useState<any>(null)
  const [paymentPhone, setPaymentPhone] = useState('')
  const [paymentStep, setPaymentStep] = useState<'form' | 'sending' | 'waiting' | 'success' | 'error'>('form')
  const [paymentError, setPaymentError] = useState('')
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [stkResult, setStkResult] = useState<StkPushResponse | null>(null)
  
  const imageInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const user = { name: 'Staff Member', email: 'staff@aquaflow.com', role: 'Staff Admin' }

  // ---- FETCH METERS FROM API ----
  const fetchMeters = useCallback(async () => {
    setIsLoadingMeters(true)
    setLoadError('')
    try {
      const resp = await metersApi.getAll()
      if (resp.success && resp.data) {
        setMeters(resp.data.map(meterToDisplay))
      } else {
        setLoadError(resp.message || 'Failed to load meters')
      }
    } catch (err: any) {
      console.error('Failed to fetch meters:', err)
      setLoadError(err.message || 'Failed to load meters from server')
    } finally {
      setIsLoadingMeters(false)
    }
  }, [])

  useEffect(() => { fetchMeters() }, [fetchMeters])

  // Filter/search
  const filteredMeters = meters.filter(m =>
    m.id.toLowerCase().includes(meterSearch.toLowerCase()) ||
    m.tenant.toLowerCase().includes(meterSearch.toLowerCase()) ||
    m.unit.toLowerCase().includes(meterSearch.toLowerCase())
  )
  const displayMeters = meters.filter(m =>
    statusFilter === 'all' || m.status.toLowerCase() === statusFilter
  )

  const stats = {
    total: meters.length,
    active: meters.filter(m => m.status === 'Active').length,
    pending: meters.filter(m => m.status === 'Pending').length,
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setShowMeterDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ---- IMAGE ----
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { setUploadedImage(file); const r = new FileReader(); r.onloadend = () => setImagePreview(r.result as string); r.readAsDataURL(file) }
  }
  const removeImage = () => { setUploadedImage(null); setImagePreview(null); if (imageInputRef.current) imageInputRef.current.value = '' }

  // ---- METER SELECT ----
  const handleSelectMeter = async (meter: any) => {
    setIsLoadingMeter(true); setShowMeterDropdown(false); setMeterSearch(meter.id)
    await new Promise(r => setTimeout(r, 300))
    setSelectedMeter(meter); setIsLoadingMeter(false)
  }

  // ---- RECORD READING (calls backend API) ----
  const handleReadingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMeter || !newReading) return
    setIsRecording(true)
    try {
      await metersApi.recordReading(selectedMeter.id, parseInt(newReading))
      setIsRecording(false); setShowReadingModal(false)
      setNewReading(''); setNotes(''); setSelectedMeter(null); setMeterSearch(''); removeImage()
      setShowSuccessPopup(true)
      setTimeout(() => setShowSuccessPopup(false), 4000)
      fetchMeters() // Refresh meter data
    } catch (err: any) {
      setIsRecording(false)
      alert('Failed to record reading: ' + (err.message || 'Unknown error'))
    }
  }

  const openReadingModal = (meter?: any) => {
    setSelectedMeter(null); setMeterSearch(''); setNewReading(''); setNotes(''); removeImage()
    setShowReadingModal(true)
    if (meter) handleSelectMeter(meter)
  }

  // ---- PAYMENT: REAL STK PUSH ----
  const openPaymentModal = (meter: any) => {
    setPaymentMeter(meter); setPaymentPhone(meter.phone); setPaymentStep('form')
    setPaymentError(''); setStkResult(null); setShowPaymentModal(true)
  }

  const handleSendSTKPush = async () => {
    if (!paymentMeter || !paymentPhone.trim()) return
    const bill = calculateWaterBill(paymentMeter.currentMonthUsage)
    
    setPaymentStep('sending')
    setPaymentError('')

    try {
      // 1. Call backend to initiate STK push
      console.log('[STK] Initiating push:', { meter: paymentMeter.id, phone: paymentPhone, amount: bill.amount })
      const resp = await stkApi.initiate(
        paymentMeter.id,
        paymentPhone,
        bill.amount,
        `Water bill payment for meter ${paymentMeter.id}`
      )

      if (!resp.success || !resp.data?.checkoutRequestId) {
        throw new Error(resp.message || 'STK push initiation failed')
      }

      console.log('[STK] Push sent, checkoutRequestId:', resp.data.checkoutRequestId)
      setPaymentStep('waiting')

      // 2. Poll for payment result (Safaricom callback updates status)
      const result = await stkApi.pollStatus(resp.data.checkoutRequestId, 40, 3000)
      
      console.log('[STK] Final result:', result)
      setStkResult(result)

      if (result.status === 'SUCCESS') {
        setPaymentStep('success')
        fetchMeters() // Refresh meter data
      } else if (result.status === 'CANCELLED') {
        setPaymentError('Customer cancelled the payment on their phone.')
        setPaymentStep('error')
      } else {
        setPaymentError(result.mpesaReceiptNumber || 'Payment was not completed. Please try again.')
        setPaymentStep('error')
      }
    } catch (err: any) {
      console.error('[STK] Error:', err)
      setPaymentError(err.message || 'Failed to process payment. Please try again.')
      setPaymentStep('error')
    }
  }

  const closePaymentModal = () => {
    setShowPaymentModal(false); setPaymentMeter(null); setPaymentPhone('')
    setPaymentStep('form'); setPaymentError(''); setStkResult(null)
  }

  const handlePaymentDone = () => {
    closePaymentModal(); setShowPaymentSuccess(true)
    setTimeout(() => setShowPaymentSuccess(false), 4000)
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Active': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: CheckCircle }
      case 'Pending': return { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: Clock }
      default: return { bg: 'bg-white/10', text: 'text-white/60', icon: Clock }
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="Meter Readings" subtitle="Record and manage water meter readings" user={user} />
      
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Stats & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 flex-1">
            {[
              { label: 'Total', value: stats.total, icon: Gauge, color: 'water' },
              { label: 'Active', value: stats.active, icon: CheckCircle, color: 'emerald' },
              { label: 'Pending', value: stats.pending, icon: Clock, color: 'amber' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${stat.color === 'water' ? 'text-white' : `text-${stat.color}-400`}`}>{stat.value}</p>
                    <p className="text-xs text-white/60">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex gap-2">
            <motion.button whileTap={{ scale: 0.98 }} onClick={fetchMeters} className="glass-button flex items-center gap-2" title="Refresh meters">
              <RefreshCw className={`w-5 h-5 ${isLoadingMeters ? 'animate-spin' : ''}`} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.98 }} onClick={() => openReadingModal()} className="glass-button-primary flex items-center gap-2">
              <Gauge className="w-5 h-5" /> Record Reading
            </motion.button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {['all', 'active', 'pending'].map((status) => (
            <motion.button key={status} whileTap={{ scale: 0.98 }}
              onClick={() => setStatusFilter(status as typeof statusFilter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                statusFilter === status ? 'bg-water-500/20 text-water-400 border border-water-500/30' : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
              }`}>{status}</motion.button>
          ))}
        </div>

        {/* Loading / Error States */}
        {isLoadingMeters && meters.length === 0 && (
          <div className="glass-card p-12 text-center">
            <RefreshCw className="w-8 h-8 text-water-400 animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading meters from server...</p>
          </div>
        )}

        {loadError && (
          <div className="glass-card p-6 border border-rose-500/30 bg-rose-500/10">
            <div className="flex items-start gap-3">
              <WifiOff className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-rose-400 font-medium">{loadError}</p>
                <p className="text-white/50 text-sm mt-1">Make sure the backend is running and accessible.</p>
                <motion.button whileTap={{ scale: 0.98 }} onClick={fetchMeters} className="mt-3 px-4 py-2 rounded-lg bg-rose-500/20 text-rose-400 text-sm font-medium hover:bg-rose-500/30">
                  Retry
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {/* Meters Grid */}
        {!isLoadingMeters && meters.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {displayMeters.map((meter, index) => {
              const statusStyles = getStatusStyles(meter.status)
              const StatusIcon = statusStyles.icon
              const bill = calculateWaterBill(meter.currentMonthUsage)
              
              return (
                <motion.div key={meter.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="glass-card p-5 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-water-400/20 to-water-600/20 flex items-center justify-center">
                        <Gauge className="w-6 h-6 text-water-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white font-mono">{meter.id}</h3>
                        <p className="text-xs text-white/50">Unit {meter.unit}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}>
                      <StatusIcon className="w-3 h-3" />{meter.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm"><User className="w-4 h-4 text-white/40" /><span className="text-white">{meter.tenant}</span></div>
                    <div className="flex items-center gap-2 text-sm"><Droplets className="w-4 h-4 text-white/40" /><span className="text-white/60">Reading:</span><span className="text-water-400 font-semibold">{meter.lastReading.toLocaleString()} L</span></div>
                    <div className="flex items-center gap-2 text-sm"><Banknote className="w-4 h-4 text-white/40" /><span className="text-white/60">Bill:</span><span className="text-amber-400 font-semibold">KSh {bill.amount.toLocaleString()}</span><span className="text-white/40 text-xs">({bill.units} m³)</span></div>
                    <div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-white/40" /><span className="text-white/60">Read:</span><span className="text-white/80">{meter.lastReadDate}</span></div>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button whileTap={{ scale: 0.98 }} onClick={() => openReadingModal(meter)}
                      className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 bg-water-500/20 text-water-400 hover:bg-water-500/30">
                      <Gauge className="w-4 h-4" /><span className="hidden xs:inline">Record</span><span className="xs:hidden">Rec</span>
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.98 }} onClick={() => openPaymentModal(meter)}
                      className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
                      <Send className="w-4 h-4" /><span className="hidden xs:inline">Prompt Pay</span><span className="xs:hidden">Pay</span>
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* ==================== PAYMENT PROMPT MODAL ==================== */}
      <AnimatePresence>
        {showPaymentModal && paymentMeter && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm"
            onClick={closePaymentModal}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-glass p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>

              {/* FORM */}
              {paymentStep === 'form' && (() => {
                const bill = calculateWaterBill(paymentMeter.currentMonthUsage)
                return (<>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center"><Send className="w-6 h-6 text-white" /></div>
                      <div><h2 className="text-lg sm:text-xl font-display font-bold text-white">Prompt Payment</h2><p className="text-sm text-white/60">M-Pesa STK Push</p></div>
                    </div>
                    <button onClick={closePaymentModal} className="p-2 rounded-lg hover:bg-white/10"><X className="w-5 h-5 text-white/60" /></button>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                    <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Account Details</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2.5 rounded-lg bg-white/5"><p className="text-xs text-white/50">Meter No.</p><p className="text-sm font-mono font-semibold text-water-400">{paymentMeter.id}</p></div>
                      <div className="p-2.5 rounded-lg bg-white/5"><p className="text-xs text-white/50">Unit</p><p className="text-sm font-semibold text-white">{paymentMeter.unit}</p></div>
                      <div className="col-span-2 p-2.5 rounded-lg bg-white/5"><p className="text-xs text-white/50">Tenant</p><p className="text-sm font-semibold text-white">{paymentMeter.tenant}</p></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white/70 mb-2">M-Pesa Phone Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input type="tel" value={paymentPhone} onChange={e => setPaymentPhone(e.target.value)} placeholder="+254 7XX XXX XXX" className="glass-input w-full pl-12" />
                    </div>
                    <p className="text-xs text-white/40 mt-1">STK push will be sent to this number</p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-water-500/10 to-water-600/5 border border-water-500/20 mb-4">
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                      <div><p className="text-xs text-white/50">Water Used</p><p className="text-lg font-bold text-white">{paymentMeter.currentMonthUsage.toLocaleString()} L</p></div>
                      <div className="text-right"><p className="text-xs text-white/50">Units</p><p className="text-lg font-bold text-water-400">{bill.units} m³</p></div>
                    </div>
                    <div className="space-y-2 mb-3">
                      {bill.breakdown.map((tier, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-water-400" /><span className="text-white/60">{tier.tier}</span><span className="text-white/40 text-xs">({tier.units} × KSh {tier.rate})</span></div>
                          <span className="text-white font-medium">KSh {tier.subtotal.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-white font-semibold">Total Amount</span>
                      <span className="text-2xl font-bold text-emerald-400">KSh {bill.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 mb-6 flex items-center justify-between text-sm">
                    <div><p className="text-xs text-white/40">Previous</p><p className="text-white/70 font-mono">{paymentMeter.previousReading.toLocaleString()} L</p></div>
                    <ArrowRight className="w-4 h-4 text-white/30" />
                    <div className="text-right"><p className="text-xs text-white/40">Current</p><p className="text-water-400 font-mono font-semibold">{paymentMeter.lastReading.toLocaleString()} L</p></div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button whileTap={{ scale: 0.98 }} onClick={closePaymentModal} className="flex-1 glass-button">Cancel</motion.button>
                    <motion.button whileTap={{ scale: 0.98 }} onClick={handleSendSTKPush} disabled={!paymentPhone.trim()}
                      className="flex-1 glass-button-primary flex items-center justify-center gap-2 disabled:opacity-50">
                      <Send className="w-5 h-5" /> Send STK Push
                    </motion.button>
                  </div>
                </>)
              })()}

              {/* SENDING */}
              {paymentStep === 'sending' && (
                <div className="py-12 text-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Send className="w-10 h-10 text-emerald-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Sending STK Push...</h3>
                  <p className="text-white/60 text-sm">Initiating M-Pesa payment request to</p>
                  <p className="text-water-400 font-mono font-semibold mt-1">{paymentPhone}</p>
                  <p className="text-white/40 text-xs mt-3">Contacting Safaricom Daraja API...</p>
                </div>
              )}

              {/* WAITING */}
              {paymentStep === 'waiting' && (
                <div className="py-8 text-center">
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Smartphone className="w-10 h-10 text-amber-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Waiting for Payment...</h3>
                  <p className="text-white/60 text-sm mb-4">STK push sent! Waiting for customer to enter M-Pesa PIN on their phone.</p>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mx-auto max-w-xs">
                    <div className="flex items-center gap-3 justify-center"><Shield className="w-5 h-5 text-amber-400" /><p className="text-sm text-amber-400 font-medium">Prompt sent to phone</p></div>
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-2">
                    {[0, 0.3, 0.6].map((d, i) => (<motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: d }} className="w-2 h-2 rounded-full bg-amber-400" />))}
                  </div>
                  <p className="text-white/30 text-xs mt-4">Polling payment status every 3 seconds...</p>
                </div>
              )}

              {/* ERROR */}
              {paymentStep === 'error' && (
                <div className="py-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-500/20 flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-rose-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Payment Failed</h3>
                  <p className="text-white/60 text-sm mb-6">{paymentError}</p>
                  <div className="flex gap-3">
                    <motion.button whileTap={{ scale: 0.98 }} onClick={closePaymentModal} className="flex-1 glass-button">Close</motion.button>
                    <motion.button whileTap={{ scale: 0.98 }} onClick={() => { setPaymentStep('form'); setPaymentError('') }}
                      className="flex-1 glass-button-primary flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4" /> Try Again
                    </motion.button>
                  </div>
                </div>
              )}

              {/* SUCCESS */}
              {paymentStep === 'success' && (() => {
                const bill = calculateWaterBill(paymentMeter.currentMonthUsage)
                return (
                  <div className="py-6 text-center relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(20)].map((_, i) => (
                        <motion.div key={i} className="absolute w-2 h-2 rounded-full"
                          style={{ background: ['#10b981', '#00a9ff', '#f59e0b', '#ec4899'][i % 4], left: `${Math.random() * 100}%`, top: `-10%` }}
                          animate={{ y: ['0vh', '100vh'], x: [0, (Math.random() - 0.5) * 80], rotate: [0, 360], opacity: [1, 0] }}
                          transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5, ease: 'easeOut' }} />
                      ))}
                    </div>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }} className="relative mx-auto mb-6">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                        <CheckCircle className="w-12 h-12 text-white" />
                      </div>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="absolute -top-2 -right-2">
                        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg"><PartyPopper className="w-5 h-5 text-white" /></div>
                      </motion.div>
                    </motion.div>
                    <h2 className="text-2xl font-display font-bold text-white mb-2">Payment Successful!</h2>
                    <p className="text-white/60 mb-6">{paymentMeter.tenant}&apos;s payment confirmed by M-Pesa.</p>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4 text-left">
                      <div className="space-y-2 text-sm">
                        {stkResult?.mpesaReceiptNumber && <div className="flex justify-between"><span className="text-white/50">M-Pesa Receipt</span><span className="font-mono text-emerald-400 font-semibold">{stkResult.mpesaReceiptNumber}</span></div>}
                        <div className="flex justify-between"><span className="text-white/50">Meter</span><span className="text-white">{paymentMeter.id}</span></div>
                        <div className="flex justify-between"><span className="text-white/50">Phone</span><span className="text-white">{paymentPhone}</span></div>
                        <div className="flex justify-between"><span className="text-white/50">Usage</span><span className="text-white">{paymentMeter.currentMonthUsage.toLocaleString()} L ({bill.units} m³)</span></div>
                        <div className="flex justify-between pt-2 border-t border-white/10"><span className="text-white font-semibold">Amount Paid</span><span className="text-emerald-400 font-bold text-lg">KSh {bill.amount.toLocaleString()}</span></div>
                      </div>
                    </div>
                    <motion.button whileTap={{ scale: 0.98 }} onClick={handlePaymentDone} className="w-full glass-button-primary">Done</motion.button>
                  </div>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAYMENT SUCCESS TOAST */}
      <AnimatePresence>
        {showPaymentSuccess && (
          <motion.div initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-24 lg:bottom-8 left-1/2 z-50 bg-emerald-500/90 backdrop-blur-xl text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5" /><span className="font-medium text-sm">Payment collected successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== RECORD READING MODAL ==================== */}
      <AnimatePresence>
        {showReadingModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowReadingModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-glass p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center"><Gauge className="w-6 h-6 text-white" /></div>
                  <div><h2 className="text-xl font-display font-bold text-white">Record Meter Reading</h2><p className="text-sm text-white/60">Search and select a meter</p></div>
                </div>
                <button onClick={() => setShowReadingModal(false)} className="p-2 rounded-lg hover:bg-white/10"><X className="w-5 h-5 text-white/60" /></button>
              </div>

              <div className="mb-6" ref={dropdownRef}>
                <label className="block text-sm font-medium text-white/70 mb-2">Search Meter</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input type="text" value={meterSearch}
                    onChange={e => { setMeterSearch(e.target.value); setShowMeterDropdown(true); if (selectedMeter && e.target.value !== selectedMeter.id) setSelectedMeter(null) }}
                    onFocus={() => setShowMeterDropdown(true)} placeholder="Search by meter ID, tenant, or unit..." className="glass-input w-full pl-12 pr-10" />
                  <button type="button" onClick={() => setShowMeterDropdown(!showMeterDropdown)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded">
                    <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${showMeterDropdown ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                <AnimatePresence>
                  {showMeterDropdown && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 mt-2 w-[calc(100%-3rem)] max-h-48 overflow-y-auto bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
                      {filteredMeters.length === 0 ? <div className="p-4 text-center text-white/60 text-sm">No meters found</div> :
                        filteredMeters.slice(0, 5).map(meter => {
                          const ss = getStatusStyles(meter.status)
                          return <button key={meter.id} type="button" onClick={() => handleSelectMeter(meter)}
                            className={`w-full p-3 text-left hover:bg-white/10 border-b border-white/5 last:border-0 ${selectedMeter?.id === meter.id ? 'bg-water-500/20' : ''}`}>
                            <div className="flex items-center justify-between">
                              <div><p className="text-sm font-medium text-white">{meter.id}</p><p className="text-xs text-white/60">{meter.tenant} • Unit {meter.unit}</p></div>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${ss.bg} ${ss.text}`}>{meter.status}</span>
                            </div>
                          </button>
                        })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {isLoadingMeter && <div className="p-8 text-center"><RefreshCw className="w-12 h-12 text-water-400 animate-spin mx-auto mb-4" /><p className="text-white/60">Loading...</p></div>}

              <AnimatePresence mode="wait">
                {selectedMeter && !isLoadingMeter && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                      <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-water-500/20 flex items-center justify-center"><User className="w-5 h-5 text-water-400" /></div><div><p className="font-medium text-white">{selectedMeter.tenant}</p><p className="text-xs text-white/60">{selectedMeter.email}</p></div></div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5"><Gauge className="w-4 h-4 text-white/40" /><span className="text-white">{selectedMeter.id}</span></div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5"><Home className="w-4 h-4 text-white/40" /><span className="text-white">Unit {selectedMeter.unit}</span></div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-water-500/10 to-water-600/5 border border-water-500/20 mb-4">
                      <div className="flex items-center justify-between">
                        <div><p className="text-white/60 text-sm">Last Reading</p><p className="text-2xl font-bold text-white">{selectedMeter.lastReading.toLocaleString()} <span className="text-sm font-normal text-white/60">L</span></p></div>
                        <div className="text-right"><p className="text-white/60 text-sm">Date</p><p className="text-water-400 font-medium">{selectedMeter.lastReadDate}</p></div>
                      </div>
                    </div>
                    <form onSubmit={handleReadingSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Current Meter Reading (Litres)</label>
                        <div className="relative"><Gauge className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <input type="number" value={newReading} onChange={e => setNewReading(e.target.value)} placeholder={`Min: ${selectedMeter.lastReading}`} min={selectedMeter.lastReading} className="glass-input w-full pl-12 text-lg" required />
                        </div>
                        {newReading && parseInt(newReading) > selectedMeter.lastReading && (
                          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex items-center justify-between"><span className="text-sm text-white/70">Usage:</span><span className="text-lg font-bold text-emerald-400">{(parseInt(newReading) - selectedMeter.lastReading).toLocaleString()} L</span></div>
                          </motion.div>
                        )}
                      </div>
                      <div className="flex gap-3 pt-2">
                        <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={() => { setSelectedMeter(null); setMeterSearch(''); removeImage() }} className="flex-1 glass-button">Clear</motion.button>
                        <motion.button type="submit" disabled={isRecording || !newReading || parseInt(newReading) <= selectedMeter.lastReading}
                          whileTap={{ scale: 0.98 }} className="flex-1 glass-button-primary flex items-center justify-center gap-2 disabled:opacity-50">
                          {isRecording ? (<><Sparkles className="w-5 h-5 animate-spin" />Saving...</>) : (<><Save className="w-5 h-5" />Save Reading</>)}
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {!selectedMeter && !isLoadingMeter && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4"><Search className="w-8 h-8 text-white/30" /></div>
                  <p className="text-white/60 mb-2">Search for a meter to get started</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* READING SUCCESS POPUP */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.5, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5, y: 50 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-glass p-5 sm:p-8 w-full max-w-sm text-center relative overflow-hidden">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="relative mx-auto mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-water-400 to-water-600 flex items-center justify-center mx-auto shadow-lg"><Droplets className="w-12 h-12 text-white" /></div>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg"><CheckCircle className="w-6 h-6 text-white" /></motion.div>
              </motion.div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">Reading Recorded!</h2>
              <p className="text-white/60 mb-6">Saved to the server successfully.</p>
              <motion.button whileTap={{ scale: 0.98 }} onClick={() => setShowSuccessPopup(false)} className="w-full glass-button-primary">Done</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
