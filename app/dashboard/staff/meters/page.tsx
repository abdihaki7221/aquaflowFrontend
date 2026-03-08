'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/layout/Header'
import {
  Gauge,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Camera,
  Upload,
  Save,
  Sparkles,
  Droplets,
  User,
  Home,
  Phone,
  MapPin,
  Calendar,
  ChevronDown,
  Image as ImageIcon,
  Trash2,
  PartyPopper,
  CreditCard,
  Send,
  Smartphone,
  Banknote,
  ArrowRight,
  Shield,
} from 'lucide-react'

// Water billing tariff calculation
// KSh 45 per cubic meter for first 1-6 units (1 unit = 1,000 litres)
// KSh 55 for 7-20 units
// KSh 70 for 21-50 units  
// KSh 80 for 50+ units
function calculateWaterBill(usageLitres: number): { units: number; amount: number; breakdown: { tier: string; units: number; rate: number; subtotal: number }[] } {
  const units = usageLitres / 1000
  let remaining = units
  let total = 0
  const breakdown: { tier: string; units: number; rate: number; subtotal: number }[] = []

  // Tier 1: 0-6 units @ KSh 45
  if (remaining > 0) {
    const tierUnits = Math.min(remaining, 6)
    const subtotal = tierUnits * 45
    total += subtotal
    breakdown.push({ tier: '0-6 units', units: Math.round(tierUnits * 100) / 100, rate: 45, subtotal: Math.round(subtotal) })
    remaining -= tierUnits
  }

  // Tier 2: 7-20 units @ KSh 55
  if (remaining > 0) {
    const tierUnits = Math.min(remaining, 14)
    const subtotal = tierUnits * 55
    total += subtotal
    breakdown.push({ tier: '7-20 units', units: Math.round(tierUnits * 100) / 100, rate: 55, subtotal: Math.round(subtotal) })
    remaining -= tierUnits
  }

  // Tier 3: 21-50 units @ KSh 70
  if (remaining > 0) {
    const tierUnits = Math.min(remaining, 30)
    const subtotal = tierUnits * 70
    total += subtotal
    breakdown.push({ tier: '21-50 units', units: Math.round(tierUnits * 100) / 100, rate: 70, subtotal: Math.round(subtotal) })
    remaining -= tierUnits
  }

  // Tier 4: 50+ units @ KSh 80
  if (remaining > 0) {
    const subtotal = remaining * 80
    total += subtotal
    breakdown.push({ tier: '50+ units', units: Math.round(remaining * 100) / 100, rate: 80, subtotal: Math.round(subtotal) })
  }

  return { units: Math.round(units * 100) / 100, amount: Math.round(total), breakdown }
}

// All meters data
const allMeters = [
  { id: 'M-1001', tenant: 'John Smith', unit: '4A', lastReading: 12500, previousReading: 9200, currentMonthUsage: 3300, lastReadDate: '2024-01-10', status: 'Pending', phone: '+254 700-0101', email: 'john@example.com', address: 'Building A, Floor 4' },
  { id: 'M-1024', tenant: 'Sarah Johnson', unit: '7B', lastReading: 9850, previousReading: 7600, currentMonthUsage: 2250, lastReadDate: '2024-01-15', status: 'Completed', phone: '+254 700-0102', email: 'sarah@example.com', address: 'Building B, Floor 7' },
  { id: 'M-1033', tenant: 'Alice Cooper', unit: '3B', lastReading: 11300, previousReading: 9800, currentMonthUsage: 1500, lastReadDate: '2024-01-09', status: 'Pending', phone: '+254 700-0106', email: 'alice@example.com', address: 'Building B, Floor 3' },
  { id: 'M-1056', tenant: 'Michael Brown', unit: '2C', lastReading: 15600, previousReading: 8100, currentMonthUsage: 7500, lastReadDate: '2024-01-08', status: 'Overdue', phone: '+254 700-0103', email: 'michael@example.com', address: 'Building C, Floor 2' },
  { id: 'M-1067', tenant: 'Bob Martin', unit: '6C', lastReading: 7650, previousReading: 3400, currentMonthUsage: 4250, lastReadDate: '2024-01-07', status: 'Overdue', phone: '+254 700-0107', email: 'bob@example.com', address: 'Building C, Floor 6' },
  { id: 'M-1082', tenant: 'Carol White', unit: '8A', lastReading: 13400, previousReading: 11200, currentMonthUsage: 2200, lastReadDate: '2024-01-15', status: 'Completed', phone: '+254 700-0108', email: 'carol@example.com', address: 'Building A, Floor 8' },
  { id: 'M-1089', tenant: 'Emily Davis', unit: '9A', lastReading: 8720, previousReading: 5500, currentMonthUsage: 3220, lastReadDate: '2024-01-15', status: 'Completed', phone: '+254 700-0104', email: 'emily@example.com', address: 'Building A, Floor 9' },
  { id: 'M-1102', tenant: 'David Wilson', unit: '5D', lastReading: 14200, previousReading: 10000, currentMonthUsage: 4200, lastReadDate: '2024-01-12', status: 'Pending', phone: '+254 700-0105', email: 'david@example.com', address: 'Building D, Floor 5' },
  { id: 'M-1015', tenant: 'Dan Green', unit: '1D', lastReading: 9200, previousReading: 7800, currentMonthUsage: 1400, lastReadDate: '2024-01-06', status: 'Overdue', phone: '+254 700-0109', email: 'dan@example.com', address: 'Building D, Floor 1' },
  { id: 'M-1045', tenant: 'Eva Martinez', unit: '5A', lastReading: 10800, previousReading: 5300, currentMonthUsage: 5500, lastReadDate: '2024-01-11', status: 'Pending', phone: '+254 700-0110', email: 'eva@example.com', address: 'Building A, Floor 5' },
]

export default function MeterReadingsPage() {
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all')
  
  // Payment prompt state
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMeter, setPaymentMeter] = useState<any>(null)
  const [paymentPhone, setPaymentPhone] = useState('')
  const [paymentStep, setPaymentStep] = useState<'form' | 'sending' | 'waiting' | 'success'>('form')
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [stkReference, setStkReference] = useState('')
  
  const imageInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const user = {
    name: 'Staff Member',
    email: 'staff@aquaflow.com',
    role: 'Staff Admin'
  }

  const filteredMeters = allMeters.filter(meter => 
    meter.id.toLowerCase().includes(meterSearch.toLowerCase()) ||
    meter.tenant.toLowerCase().includes(meterSearch.toLowerCase()) ||
    meter.unit.toLowerCase().includes(meterSearch.toLowerCase())
  )

  const displayMeters = allMeters.filter(meter => 
    statusFilter === 'all' || meter.status.toLowerCase() === statusFilter
  )

  const stats = {
    total: allMeters.length,
    completed: allMeters.filter(m => m.status === 'Completed').length,
    pending: allMeters.filter(m => m.status === 'Pending').length,
    overdue: allMeters.filter(m => m.status === 'Overdue').length,
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMeterDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => { setImagePreview(reader.result as string) }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setUploadedImage(null)
    setImagePreview(null)
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const handleSelectMeter = async (meter: any) => {
    setIsLoadingMeter(true)
    setShowMeterDropdown(false)
    setMeterSearch(meter.id)
    await new Promise(resolve => setTimeout(resolve, 500))
    setSelectedMeter(meter)
    setIsLoadingMeter(false)
  }

  const handleReadingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRecording(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRecording(false)
    setShowReadingModal(false)
    setNewReading('')
    setNotes('')
    setSelectedMeter(null)
    setMeterSearch('')
    removeImage()
    setShowSuccessPopup(true)
    setTimeout(() => setShowSuccessPopup(false), 4000)
  }

  const openReadingModal = (meter?: any) => {
    setSelectedMeter(null)
    setMeterSearch('')
    setNewReading('')
    setNotes('')
    removeImage()
    setShowReadingModal(true)
    if (meter) handleSelectMeter(meter)
  }

  // ---- Payment prompt functions ----
  const openPaymentModal = (meter: any) => {
    setPaymentMeter(meter)
    setPaymentPhone(meter.phone)
    setPaymentStep('form')
    setShowPaymentModal(true)
  }

  const handleSendSTKPush = async () => {
    setPaymentStep('sending')
    await new Promise(resolve => setTimeout(resolve, 2000))
    setPaymentStep('waiting')
    await new Promise(resolve => setTimeout(resolve, 3500))
    const ref = `STK${Date.now().toString(36).toUpperCase().slice(-8)}`
    setStkReference(ref)
    setPaymentStep('success')
  }

  const closePaymentModal = () => {
    setShowPaymentModal(false)
    setPaymentMeter(null)
    setPaymentPhone('')
    setPaymentStep('form')
  }

  const handlePaymentDone = () => {
    closePaymentModal()
    setShowPaymentSuccess(true)
    setTimeout(() => setShowPaymentSuccess(false), 4000)
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Completed': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: CheckCircle }
      case 'Pending': return { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: Clock }
      case 'Overdue': return { bg: 'bg-rose-500/20', text: 'text-rose-400', icon: AlertTriangle }
      default: return { bg: 'bg-white/10', text: 'text-white/60', icon: Clock }
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="Meter Readings" subtitle="Record and manage water meter readings" user={user} />
      
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Stats & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 flex-1">
            {[
              { label: 'Total', value: stats.total, icon: Gauge, color: 'water' },
              { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'emerald' },
              { label: 'Pending', value: stats.pending, icon: Clock, color: 'amber' },
              { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'rose' },
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
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => openReadingModal()} className="glass-button-primary flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            Record Reading
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'completed', 'overdue'].map((status) => (
            <motion.button key={status} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setStatusFilter(status as typeof statusFilter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                statusFilter === status ? 'bg-water-500/20 text-water-400 border border-water-500/30' : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
              }`}
            >
              {status}
            </motion.button>
          ))}
        </div>

        {/* Meters Grid */}
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
                    <StatusIcon className="w-3 h-3" />
                    {meter.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-white/40" />
                    <span className="text-white">{meter.tenant}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="w-4 h-4 text-white/40" />
                    <span className="text-white/60">Last Reading:</span>
                    <span className="text-water-400 font-semibold">{meter.lastReading.toLocaleString()} L</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Banknote className="w-4 h-4 text-white/40" />
                    <span className="text-white/60">This Month:</span>
                    <span className="text-amber-400 font-semibold">KSh {bill.amount.toLocaleString()}</span>
                    <span className="text-white/40 text-xs">({bill.units} m³)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-white/40" />
                    <span className="text-white/60">Read on:</span>
                    <span className="text-white/80">{meter.lastReadDate}</span>
                  </div>
                </div>

                {/* Two buttons side by side */}
                <div className="flex items-center gap-2">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => openReadingModal(meter)}
                    disabled={meter.status === 'Completed'}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                      meter.status === 'Completed' ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-water-500/20 text-water-400 hover:bg-water-500/30'
                    }`}
                  >
                    {meter.status === 'Completed' ? (
                      <><CheckCircle className="w-4 h-4" /><span className="hidden xs:inline">Recorded</span><span className="xs:hidden">Done</span></>
                    ) : (
                      <><Gauge className="w-4 h-4" /><span className="hidden xs:inline">Record Reading</span><span className="xs:hidden">Record</span></>
                    )}
                  </motion.button>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => openPaymentModal(meter)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden xs:inline">Prompt Payment</span>
                    <span className="xs:hidden">Pay</span>
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ==================== PAYMENT PROMPT MODAL ==================== */}
      <AnimatePresence>
        {showPaymentModal && paymentMeter && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm"
            onClick={closePaymentModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-glass p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ---- FORM STEP ---- */}
              {paymentStep === 'form' && (() => {
                const bill = calculateWaterBill(paymentMeter.currentMonthUsage)
                return (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                          <Send className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-xl font-display font-bold text-white">Prompt Payment</h2>
                          <p className="text-sm text-white/60">M-Pesa STK Push</p>
                        </div>
                      </div>
                      <button onClick={closePaymentModal} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5 text-white/60" />
                      </button>
                    </div>

                    {/* Account Details */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                      <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Account Details</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2.5 rounded-lg bg-white/5">
                          <p className="text-xs text-white/50">Meter No.</p>
                          <p className="text-sm font-mono font-semibold text-water-400">{paymentMeter.id}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white/5">
                          <p className="text-xs text-white/50">Unit</p>
                          <p className="text-sm font-semibold text-white">{paymentMeter.unit}</p>
                        </div>
                        <div className="col-span-2 p-2.5 rounded-lg bg-white/5">
                          <p className="text-xs text-white/50">Tenant</p>
                          <p className="text-sm font-semibold text-white">{paymentMeter.tenant}</p>
                        </div>
                      </div>
                    </div>

                    {/* Editable Phone Number */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white/70 mb-2">M-Pesa Phone Number</label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input type="tel" value={paymentPhone} onChange={(e) => setPaymentPhone(e.target.value)} placeholder="+254 7XX XXX XXX" className="glass-input w-full pl-12" />
                      </div>
                      <p className="text-xs text-white/40 mt-1">STK push will be sent to this number</p>
                    </div>

                    {/* Water Usage & Tiered Billing */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-water-500/10 to-water-600/5 border border-water-500/20 mb-4">
                      <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Current Month Billing</h3>
                      
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                        <div>
                          <p className="text-xs text-white/50">Water Used</p>
                          <p className="text-lg font-bold text-white">{paymentMeter.currentMonthUsage.toLocaleString()} L</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-white/50">Units Consumed</p>
                          <p className="text-lg font-bold text-water-400">{bill.units} m³</p>
                        </div>
                      </div>

                      {/* Tariff Breakdown */}
                      <div className="space-y-2 mb-3">
                        {bill.breakdown.map((tier, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-water-400" />
                              <span className="text-white/60">{tier.tier}</span>
                              <span className="text-white/40 text-xs">({tier.units} × KSh {tier.rate})</span>
                            </div>
                            <span className="text-white font-medium">KSh {tier.subtotal.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <span className="text-white font-semibold">Total Amount</span>
                        <span className="text-2xl font-bold text-emerald-400">KSh {bill.amount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Meter Reading Range */}
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 mb-6 flex items-center justify-between text-sm">
                      <div>
                        <p className="text-xs text-white/40">Previous Reading</p>
                        <p className="text-white/70 font-mono">{paymentMeter.previousReading.toLocaleString()} L</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/30" />
                      <div className="text-right">
                        <p className="text-xs text-white/40">Current Reading</p>
                        <p className="text-water-400 font-mono font-semibold">{paymentMeter.lastReading.toLocaleString()} L</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={closePaymentModal} className="flex-1 glass-button">Cancel</motion.button>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSendSTKPush} disabled={!paymentPhone.trim()} className="flex-1 glass-button-primary flex items-center justify-center gap-2 disabled:opacity-50">
                        <Send className="w-5 h-5" />
                        Send STK Push
                      </motion.button>
                    </div>
                  </>
                )
              })()}

              {/* ---- SENDING STEP ---- */}
              {paymentStep === 'sending' && (
                <div className="py-12 text-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Send className="w-10 h-10 text-emerald-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Sending STK Push...</h3>
                  <p className="text-white/60 text-sm">Initiating M-Pesa payment request to</p>
                  <p className="text-water-400 font-mono font-semibold mt-1">{paymentPhone}</p>
                  <div className="mt-6 flex items-center justify-center gap-2">
                    {[0, 0.2, 0.4].map((d, i) => (
                      <motion.div key={i} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: d }} className="w-2 h-2 rounded-full bg-emerald-400" />
                    ))}
                  </div>
                </div>
              )}

              {/* ---- WAITING FOR PIN STEP ---- */}
              {paymentStep === 'waiting' && (
                <div className="py-8 text-center">
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Smartphone className="w-10 h-10 text-amber-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Waiting for Payment...</h3>
                  <p className="text-white/60 text-sm mb-4">STK push sent successfully. Waiting for {paymentMeter.tenant} to enter their M-Pesa PIN.</p>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mx-auto max-w-xs">
                    <div className="flex items-center gap-3 justify-center">
                      <Shield className="w-5 h-5 text-amber-400" />
                      <p className="text-sm text-amber-400 font-medium">Prompt sent to phone</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-2">
                    {[0, 0.3, 0.6].map((d, i) => (
                      <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: d }} className="w-2 h-2 rounded-full bg-amber-400" />
                    ))}
                  </div>
                </div>
              )}

              {/* ---- SUCCESS STEP ---- */}
              {paymentStep === 'success' && (() => {
                const bill = calculateWaterBill(paymentMeter.currentMonthUsage)
                return (
                  <div className="py-6 text-center relative overflow-hidden">
                    {/* Confetti */}
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(20)].map((_, i) => (
                        <motion.div key={i} className="absolute w-2 h-2 rounded-full"
                          style={{ background: ['#10b981', '#00a9ff', '#f59e0b', '#ec4899'][i % 4], left: `${Math.random() * 100}%`, top: `-10%` }}
                          animate={{ y: ['0vh', '100vh'], x: [0, (Math.random() - 0.5) * 80], rotate: [0, 360], opacity: [1, 0] }}
                          transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5, ease: 'easeOut' }}
                        />
                      ))}
                    </div>

                    {/* Rings */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} className="absolute w-24 h-24 rounded-full border-2 border-emerald-400/20"
                          initial={{ scale: 0.8, opacity: 0.8 }} animate={{ scale: 2.5, opacity: 0 }}
                          transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, ease: 'easeOut' }}
                        />
                      ))}
                    </div>

                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10, stiffness: 200 }} className="relative mx-auto mb-6">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                        <CheckCircle className="w-12 h-12 text-white" />
                      </div>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }} className="absolute -top-2 -right-2">
                        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
                          <PartyPopper className="w-5 h-5 text-white" />
                        </div>
                      </motion.div>
                    </motion.div>

                    <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl font-display font-bold text-white mb-2">
                      Payment Successful!
                    </motion.h2>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-white/60 mb-6">
                      {paymentMeter.tenant}&apos;s payment has been confirmed.
                    </motion.p>

                    {/* Receipt */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4 text-left">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-white/50">Reference</span><span className="font-mono text-water-400 font-semibold">{stkReference}</span></div>
                        <div className="flex justify-between"><span className="text-white/50">Meter</span><span className="text-white">{paymentMeter.id}</span></div>
                        <div className="flex justify-between"><span className="text-white/50">Phone</span><span className="text-white">{paymentPhone}</span></div>
                        <div className="flex justify-between"><span className="text-white/50">Usage</span><span className="text-white">{paymentMeter.currentMonthUsage.toLocaleString()} L ({bill.units} m³)</span></div>
                        <div className="flex justify-between pt-2 border-t border-white/10">
                          <span className="text-white font-semibold">Amount Paid</span>
                          <span className="text-emerald-400 font-bold text-lg">KSh {bill.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handlePaymentDone} className="w-full glass-button-primary">
                        Done
                      </motion.button>
                    </motion.div>
                  </div>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== PAYMENT SUCCESS TOAST ==================== */}
      <AnimatePresence>
        {showPaymentSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-24 lg:bottom-8 left-1/2 z-50 bg-emerald-500/90 backdrop-blur-xl text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium text-sm">Payment collected successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== RECORD READING MODAL ==================== */}
      <AnimatePresence>
        {showReadingModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowReadingModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-glass p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                    <Gauge className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-white">Record Meter Reading</h2>
                    <p className="text-sm text-white/60">Search and select a meter</p>
                  </div>
                </div>
                <button onClick={() => setShowReadingModal(false)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Meter Search */}
              <div className="mb-6" ref={dropdownRef}>
                <label className="block text-sm font-medium text-white/70 mb-2">Search Meter</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input type="text" value={meterSearch}
                    onChange={(e) => { setMeterSearch(e.target.value); setShowMeterDropdown(true); if (selectedMeter && e.target.value !== selectedMeter.id) setSelectedMeter(null) }}
                    onFocus={() => setShowMeterDropdown(true)}
                    placeholder="Search by meter ID, tenant, or unit..."
                    className="glass-input w-full pl-12 pr-10"
                  />
                  <button type="button" onClick={() => setShowMeterDropdown(!showMeterDropdown)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors">
                    <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${showMeterDropdown ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                <AnimatePresence>
                  {showMeterDropdown && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 mt-2 w-[calc(100%-3rem)] max-h-48 overflow-y-auto bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg"
                    >
                      {filteredMeters.length === 0 ? (
                        <div className="p-4 text-center text-white/60 text-sm">No meters found</div>
                      ) : (
                        filteredMeters.slice(0, 5).map((meter) => {
                          const ss = getStatusStyles(meter.status)
                          return (
                            <button key={meter.id} type="button" onClick={() => handleSelectMeter(meter)}
                              className={`w-full p-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 ${selectedMeter?.id === meter.id ? 'bg-water-500/20' : ''}`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-white">{meter.id}</p>
                                  <p className="text-xs text-white/60">{meter.tenant} • Unit {meter.unit}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${ss.bg} ${ss.text}`}>{meter.status}</span>
                              </div>
                            </button>
                          )
                        })
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {isLoadingMeter && (
                <div className="p-8 text-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 mx-auto mb-4">
                    <Droplets className="w-12 h-12 text-water-400" />
                  </motion.div>
                  <p className="text-white/60">Loading meter details...</p>
                </div>
              )}

              <AnimatePresence mode="wait">
                {selectedMeter && !isLoadingMeter && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-water-500/20 flex items-center justify-center"><User className="w-5 h-5 text-water-400" /></div>
                        <div>
                          <p className="font-medium text-white">{selectedMeter.tenant}</p>
                          <p className="text-xs text-white/60">{selectedMeter.email}</p>
                        </div>
                      </div>
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
                        <label className="block text-sm font-medium text-white/70 mb-2">Current Meter Reading (Liters)</label>
                        <div className="relative">
                          <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <input type="number" value={newReading} onChange={(e) => setNewReading(e.target.value)} placeholder={`Min: ${selectedMeter.lastReading}`} min={selectedMeter.lastReading} className="glass-input w-full pl-12 text-lg" required />
                        </div>
                        {newReading && parseInt(newReading) > selectedMeter.lastReading && (
                          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-white/70">Water Usage:</span>
                              <span className="text-lg font-bold text-emerald-400">{(parseInt(newReading) - selectedMeter.lastReading).toLocaleString()} L</span>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Upload Meter Photo Evidence</label>
                        <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                        {imagePreview ? (
                          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-xl overflow-hidden border border-emerald-500/30">
                            <img src={imagePreview} alt="Meter reading" className="w-full h-48 object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /><span className="text-sm text-white">{uploadedImage?.name}</span></div>
                              <button type="button" onClick={removeImage} className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 transition-colors"><Trash2 className="w-4 h-4 text-rose-400" /></button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => imageInputRef.current?.click()}
                            className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-water-400/50 hover:bg-white/5 transition-all cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-xl bg-water-500/20 flex items-center justify-center mx-auto mb-3"><Camera className="w-6 h-6 text-water-400" /></div>
                            <p className="text-sm text-white/70 mb-1">Click to upload meter photo</p>
                            <p className="text-xs text-white/40">PNG, JPG up to 10MB</p>
                          </motion.div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Notes (Optional)</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="glass-input w-full h-20 resize-none text-sm" placeholder="Any observations or issues..." />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={() => { setSelectedMeter(null); setMeterSearch(''); removeImage() }} className="flex-1 glass-button">Clear</motion.button>
                        <motion.button type="submit" disabled={isRecording || !newReading || parseInt(newReading) <= selectedMeter.lastReading}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 glass-button-primary flex items-center justify-center gap-2 disabled:opacity-50">
                          {isRecording ? (<><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Sparkles className="w-5 h-5" /></motion.div>Saving...</>) : (<><Save className="w-5 h-5" />Save Reading</>)}
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
                  <p className="text-xs text-white/40">You can search by meter ID, tenant name, or unit number</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== READING SUCCESS POPUP ==================== */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5, y: 50 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-glass p-5 sm:p-8 w-full max-w-sm text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} className="absolute w-32 h-32 rounded-full border-2 border-water-400/30"
                    initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, ease: 'easeOut' }}
                  />
                ))}
              </div>

              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', damping: 10, stiffness: 200 }} className="relative mx-auto mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-water-400 to-water-600 flex items-center justify-center mx-auto shadow-lg shadow-water-500/30">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }}><Droplets className="w-12 h-12 text-white" /></motion.div>
                </div>
                <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.5, type: 'spring' }} className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </motion.div>
              </motion.div>

              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-2xl font-display font-bold text-white mb-2">Reading Recorded!</motion.h2>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-white/60 mb-6">The meter reading has been saved successfully.</motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Readings Today</span>
                  <span className="text-lg font-bold text-water-400">{stats.completed + 1} / {stats.total}</span>
                </div>
                <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${((stats.completed + 1) / stats.total) * 100}%` }}
                    transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-water-400 to-water-500 rounded-full" />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowSuccessPopup(false)} className="flex-1 glass-button text-sm">Close</motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setShowSuccessPopup(false); openReadingModal() }}
                  className="flex-1 glass-button-primary text-sm flex items-center justify-center gap-2">
                  <Gauge className="w-4 h-4" />Next Reading
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
