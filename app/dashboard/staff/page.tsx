'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/layout/Header'
import StatCard from '@/components/ui/StatCard'
import DataTable from '@/components/ui/DataTable'
import {
  Users,
  Gauge,
  ClipboardCheck,
  UserPlus,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Upload,
  FileText,
  Sparkles,
  PartyPopper,
  Droplets,
  Save,
  Camera,
  User,
  Mail,
  Phone,
  Home,
  CreditCard,
  Search,
  ChevronDown,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react'

// All meters data
const allMeters = [
  { id: 'M-1001', tenant: 'John Smith', unit: '4A', lastReading: 12500, lastReadDate: '2024-01-10', status: 'Active', phone: '+1 555-0101', email: 'john@example.com', address: 'Building A, Floor 4' },
  { id: 'M-1024', tenant: 'Sarah Johnson', unit: '7B', lastReading: 9850, lastReadDate: '2024-01-15', status: 'Active', phone: '+1 555-0102', email: 'sarah@example.com', address: 'Building B, Floor 7' },
  { id: 'M-1033', tenant: 'Alice Cooper', unit: '3B', lastReading: 11300, lastReadDate: '2024-01-09', status: 'Pending', phone: '+1 555-0106', email: 'alice@example.com', address: 'Building B, Floor 3' },
  { id: 'M-1056', tenant: 'Michael Brown', unit: '2C', lastReading: 15600, lastReadDate: '2024-01-08', status: 'Overdue', phone: '+1 555-0103', email: 'michael@example.com', address: 'Building C, Floor 2' },
  { id: 'M-1067', tenant: 'Bob Martin', unit: '6C', lastReading: 7650, lastReadDate: '2024-01-07', status: 'Overdue', phone: '+1 555-0107', email: 'bob@example.com', address: 'Building C, Floor 6' },
  { id: 'M-1082', tenant: 'Carol White', unit: '8A', lastReading: 13400, lastReadDate: '2024-01-15', status: 'Active', phone: '+1 555-0108', email: 'carol@example.com', address: 'Building A, Floor 8' },
  { id: 'M-1089', tenant: 'Emily Davis', unit: '9A', lastReading: 8720, lastReadDate: '2024-01-15', status: 'Active', phone: '+1 555-0104', email: 'emily@example.com', address: 'Building A, Floor 9' },
  { id: 'M-1102', tenant: 'David Wilson', unit: '5D', lastReading: 14200, lastReadDate: '2024-01-12', status: 'Pending', phone: '+1 555-0105', email: 'david@example.com', address: 'Building D, Floor 5' },
  { id: 'M-1015', tenant: 'Dan Green', unit: '1D', lastReading: 9200, lastReadDate: '2024-01-06', status: 'Overdue', phone: '+1 555-0109', email: 'dan@example.com', address: 'Building D, Floor 1' },
  { id: 'M-1045', tenant: 'Eva Martinez', unit: '5A', lastReading: 10800, lastReadDate: '2024-01-11', status: 'Active', phone: '+1 555-0110', email: 'eva@example.com', address: 'Building A, Floor 5' },
  { id: 'M-1078', tenant: 'Frank Thompson', unit: '7C', lastReading: 12100, lastReadDate: '2024-01-13', status: 'Pending', phone: '+1 555-0111', email: 'frank@example.com', address: 'Building C, Floor 7' },
  { id: 'M-1091', tenant: 'Grace Lee', unit: '10B', lastReading: 8900, lastReadDate: '2024-01-14', status: 'Active', phone: '+1 555-0112', email: 'grace@example.com', address: 'Building B, Floor 10' },
]

export default function StaffDashboard() {
  const [showOnboardModal, setShowOnboardModal] = useState(false)
  const [showReadingModal, setShowReadingModal] = useState(false)
  const [showOnboardSuccess, setShowOnboardSuccess] = useState(false)
  const [showReadingSuccess, setShowReadingSuccess] = useState(false)
  const [isOnboarding, setIsOnboarding] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [selectedMeter, setSelectedMeter] = useState<any>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [newReading, setNewReading] = useState('')
  const [meterSearch, setMeterSearch] = useState('')
  const [showMeterDropdown, setShowMeterDropdown] = useState(false)
  const [isLoadingMeter, setIsLoadingMeter] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const user = {
    name: 'Staff Member',
    email: 'staff@aquaflow.com',
    role: 'Staff Admin'
  }

  const stats = [
    {
      title: 'Active Tenants',
      value: '156',
      icon: Users,
      trend: { value: 5, isPositive: true },
      color: 'water' as const,
      subtitle: 'In your assigned area'
    },
    {
      title: 'Readings Today',
      value: '24',
      icon: Gauge,
      color: 'emerald' as const,
      subtitle: '8 remaining'
    },
    {
      title: 'Pending Tasks',
      value: '12',
      icon: ClipboardCheck,
      color: 'amber' as const,
      subtitle: '3 urgent'
    },
    {
      title: 'Onboarded Today',
      value: '3',
      icon: UserPlus,
      color: 'purple' as const,
      subtitle: 'New tenants'
    },
  ]

  const tenants = [
    { id: 'T001', name: 'John Smith', unit: '4A', meter: 'M-1001', lastReading: '1,250 L', lastReadingValue: 1250, status: 'Active', dueAmount: 'KSH125.00' },
    { id: 'T002', name: 'Sarah Johnson', unit: '7B', meter: 'M-1024', lastReading: '985 L', lastReadingValue: 985, status: 'Active', dueAmount: 'KSH0.00' },
    { id: 'T003', name: 'Michael Brown', unit: '2C', meter: 'M-1056', lastReading: '1,560 L', lastReadingValue: 1560, status: 'Overdue', dueAmount: 'KSH156.00' },
    { id: 'T004', name: 'Emily Davis', unit: '9A', meter: 'M-1089', lastReading: '872 L', lastReadingValue: 872, status: 'Active', dueAmount: 'KSH87.25' },
    { id: 'T005', name: 'David Wilson', unit: '5D', meter: 'M-1102', lastReading: '1,420 L', lastReadingValue: 1420, status: 'Pending', dueAmount: 'KSH142.00' },
  ]

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Tenant Name' },
    { key: 'unit', label: 'Unit' },
    { key: 'meter', label: 'Meter No.' },
    { key: 'lastReading', label: 'Last Reading' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          value === 'Active' ? 'bg-emerald-500/20 text-emerald-400' :
          value === 'Overdue' ? 'bg-rose-500/20 text-rose-400' :
          'bg-amber-500/20 text-amber-400'
        }`}>
          {value === 'Active' && <CheckCircle className="w-3 h-3" />}
          {value === 'Overdue' && <AlertTriangle className="w-3 h-3" />}
          {value === 'Pending' && <Clock className="w-3 h-3" />}
          {value}
        </span>
      )
    },
    { key: 'dueAmount', label: 'Due Amount' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Eye className="w-4 h-4 text-white/70" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Edit className="w-4 h-4 text-water-400" />
          </motion.button>
        </div>
      )
    },
  ]

  const pendingReadings = [
    { unit: '3B', tenant: 'Alice Cooper', meter: 'M-1033', lastRead: '2 days ago', lastReadingValue: 1130 },
    { unit: '6C', tenant: 'Bob Martin', meter: 'M-1067', lastRead: '3 days ago', lastReadingValue: 765 },
    { unit: '8A', tenant: 'Carol White', meter: 'M-1082', lastRead: '1 day ago', lastReadingValue: 1340 },
    { unit: '1D', tenant: 'Dan Green', meter: 'M-1015', lastRead: '4 days ago', lastReadingValue: 920 },
  ]

  // Filter meters based on search
  const filteredMeters = allMeters.filter(meter => 
    meter.id.toLowerCase().includes(meterSearch.toLowerCase()) ||
    meter.tenant.toLowerCase().includes(meterSearch.toLowerCase()) ||
    meter.unit.toLowerCase().includes(meterSearch.toLowerCase())
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMeterDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsOnboarding(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsOnboarding(false)
    setShowOnboardModal(false)
    setUploadedFile(null)
    setShowOnboardSuccess(true)
    setTimeout(() => setShowOnboardSuccess(false), 4000)
  }

  const handleReadingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRecording(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRecording(false)
    setShowReadingModal(false)
    setNewReading('')
    setSelectedMeter(null)
    setMeterSearch('')
    setShowReadingSuccess(true)
    setTimeout(() => setShowReadingSuccess(false), 4000)
  }

  const handleSelectMeter = async (meter: any) => {
    setIsLoadingMeter(true)
    setShowMeterDropdown(false)
    setMeterSearch(meter.id)
    
    // Simulate fetching meter details
    await new Promise(resolve => setTimeout(resolve, 800))
    
    setSelectedMeter(meter)
    setIsLoadingMeter(false)
  }

  const openReadingModal = () => {
    setSelectedMeter(null)
    setMeterSearch('')
    setNewReading('')
    setShowReadingModal(true)
  }

  const openReadingModalWithMeter = async (reading: any) => {
    setShowReadingModal(true)
    setMeterSearch(reading.meter)
    setIsLoadingMeter(true)
    
    // Find the full meter data
    const meterData = allMeters.find(m => m.id === reading.meter)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (meterData) {
      setSelectedMeter(meterData)
    }
    setIsLoadingMeter(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'emerald'
      case 'Overdue': return 'rose'
      case 'Pending': return 'amber'
      default: return 'white'
    }
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Staff Dashboard" 
        subtitle="Manage tenants and meter readings"
        user={user}
      />
      
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowOnboardModal(true)}
            className="glass-button-primary flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Onboard New Tenant
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openReadingModal}
            className="glass-button flex items-center gap-2"
          >
            <Gauge className="w-5 h-5" />
            Record Reading
          </motion.button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={stat.title} {...stat} delay={index * 0.1} />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Tenants Table */}
          <div className="lg:col-span-2">
            <DataTable
              title="Your Tenants"
              columns={columns}
              data={tenants}
            />
          </div>

          {/* Pending Readings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Pending Readings</h3>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                {pendingReadings.length} remaining
              </span>
            </div>
            
            <div className="space-y-3">
              {pendingReadings.map((reading, index) => (
                <motion.div
                  key={reading.meter}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{reading.tenant}</p>
                      <p className="text-sm text-white/60">Unit {reading.unit} • {reading.meter}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/40">Last read</p>
                      <p className="text-sm text-amber-400">{reading.lastRead}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openReadingModalWithMeter(reading)}
                    className="mt-3 w-full py-2 rounded-lg bg-water-500/20 text-water-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Record Reading
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Onboard Modal */}
      <AnimatePresence>
        {showOnboardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowOnboardModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-glass p-5 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-water-400 to-water-600 flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-white">Onboard New Tenant</h2>
                    <p className="text-sm text-white/60">Fill in tenant details below</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowOnboardModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
              
              <form onSubmit={handleOnboardSubmit} className="space-y-4">
                {/* Personal Information Section */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-water-400" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">First Name</label>
                      <input type="text" className="glass-input w-full text-sm" placeholder="John" required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">Last Name</label>
                      <input type="text" className="glass-input w-full text-sm" placeholder="Doe" required />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-water-400" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input type="email" className="glass-input w-full pl-10 text-sm" placeholder="john@example.com" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input type="tel" className="glass-input w-full pl-10 text-sm" placeholder="+1 (555) 000-0000" required />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ID Verification */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-water-400" />
                    ID Verification
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">ID Number</label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input type="text" className="glass-input w-full pl-10 text-sm" placeholder="Enter National ID Number" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">Upload ID Document</label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*,.pdf"
                        className="hidden"
                      />
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                          uploadedFile 
                            ? 'border-emerald-500/50 bg-emerald-500/10' 
                            : 'border-white/20 hover:border-water-400/50 hover:bg-white/5'
                        }`}
                      >
                        {uploadedFile ? (
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-medium text-white">{uploadedFile.name}</p>
                              <p className="text-xs text-white/60">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setUploadedFile(null)
                              }}
                              className="p-1 rounded-lg hover:bg-white/10"
                            >
                              <X className="w-4 h-4 text-white/60" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                            <p className="text-sm text-white/60">Click to upload ID document</p>
                            <p className="text-xs text-white/40 mt-1">PNG, JPG or PDF up to 5MB</p>
                          </>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Unit & Meter Information */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                    <Home className="w-4 h-4 text-water-400" />
                    Unit & Meter Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">Unit Number</label>
                      <input type="text" className="glass-input w-full text-sm" placeholder="4A" required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">Meter Number</label>
                      <input type="text" className="glass-input w-full text-sm" placeholder="M-1001" required />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-white/60 mb-1.5">Initial Meter Reading (Liters)</label>
                      <div className="relative">
                        <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input type="number" className="glass-input w-full pl-10 text-sm" placeholder="0" required />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowOnboardModal(false)}
                    className="flex-1 glass-button"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isOnboarding}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 glass-button-primary flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isOnboarding ? (
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
                        <UserPlus className="w-5 h-5" />
                        Onboard Tenant
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Record Reading Modal */}
      <AnimatePresence>
        {showReadingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowReadingModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-glass p-5 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
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
                <button 
                  onClick={() => setShowReadingModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Meter Search Dropdown */}
              <div className="mb-6" ref={dropdownRef}>
                <label className="block text-sm font-medium text-white/70 mb-2">Search Meter</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={meterSearch}
                    onChange={(e) => {
                      setMeterSearch(e.target.value)
                      setShowMeterDropdown(true)
                      if (selectedMeter && e.target.value !== selectedMeter.id) {
                        setSelectedMeter(null)
                      }
                    }}
                    onFocus={() => setShowMeterDropdown(true)}
                    placeholder="Search by meter ID, tenant name, or unit..."
                    className="glass-input w-full pl-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMeterDropdown(!showMeterDropdown)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${showMeterDropdown ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Dropdown List */}
                <AnimatePresence>
                  {showMeterDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 mt-2 w-[calc(100%-4rem)] max-h-60 overflow-y-auto bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg"
                    >
                      {filteredMeters.length === 0 ? (
                        <div className="p-4 text-center text-white/60">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No meters found</p>
                        </div>
                      ) : (
                        filteredMeters.map((meter, index) => (
                          <motion.button
                            key={meter.id}
                            type="button"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => handleSelectMeter(meter)}
                            className={`w-full p-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 ${
                              selectedMeter?.id === meter.id ? 'bg-water-500/20' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  meter.status === 'Active' ? 'bg-emerald-500/20' :
                                  meter.status === 'Overdue' ? 'bg-rose-500/20' :
                                  'bg-amber-500/20'
                                }`}>
                                  <Gauge className={`w-5 h-5 ${
                                    meter.status === 'Active' ? 'text-emerald-400' :
                                    meter.status === 'Overdue' ? 'text-rose-400' :
                                    'text-amber-400'
                                  }`} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-white">{meter.id}</p>
                                  <p className="text-xs text-white/60">{meter.tenant} • Unit {meter.unit}</p>
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                meter.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' :
                                meter.status === 'Overdue' ? 'bg-rose-500/20 text-rose-400' :
                                'bg-amber-500/20 text-amber-400'
                              }`}>
                                {meter.status}
                              </span>
                            </div>
                          </motion.button>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Loading State */}
              {isLoadingMeter && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 mx-auto mb-4"
                  >
                    <Droplets className="w-12 h-12 text-water-400" />
                  </motion.div>
                  <p className="text-white/60">Loading meter details...</p>
                </motion.div>
              )}

              {/* Selected Meter Details */}
              <AnimatePresence mode="wait">
                {selectedMeter && !isLoadingMeter && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {/* Tenant Info Card */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-water-400/20 to-water-600/20 flex items-center justify-center">
                          <User className="w-6 h-6 text-water-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{selectedMeter.tenant}</p>
                          <p className="text-sm text-white/60">{selectedMeter.email}</p>
                        </div>
                        <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-medium bg-${getStatusColor(selectedMeter.status)}-500/20 text-${getStatusColor(selectedMeter.status)}-400`}>
                          {selectedMeter.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                          <Gauge className="w-4 h-4 text-white/40" />
                          <div>
                            <p className="text-white/50 text-xs">Meter No.</p>
                            <p className="text-white font-medium">{selectedMeter.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                          <Home className="w-4 h-4 text-white/40" />
                          <div>
                            <p className="text-white/50 text-xs">Unit</p>
                            <p className="text-white font-medium">{selectedMeter.unit}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                          <Phone className="w-4 h-4 text-white/40" />
                          <div>
                            <p className="text-white/50 text-xs">Phone</p>
                            <p className="text-white font-medium">{selectedMeter.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                          <MapPin className="w-4 h-4 text-white/40" />
                          <div>
                            <p className="text-white/50 text-xs">Address</p>
                            <p className="text-white font-medium text-xs">{selectedMeter.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Last Reading Info */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-water-500/10 to-water-600/5 border border-water-500/20 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/60 text-sm">Last Reading</p>
                          <p className="text-2xl font-bold text-white">{selectedMeter.lastReading.toLocaleString()} <span className="text-sm font-normal text-white/60">Liters</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/60 text-sm">Recorded On</p>
                          <div className="flex items-center gap-1 text-water-400">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{selectedMeter.lastReadDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reading Input Form */}
                    <form onSubmit={handleReadingSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Current Meter Reading (Liters)</label>
                        <div className="relative">
                          <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <input
                            type="number"
                            value={newReading}
                            onChange={(e) => setNewReading(e.target.value)}
                            placeholder={`Min: ${selectedMeter.lastReading}`}
                            min={selectedMeter.lastReading}
                            className="glass-input w-full pl-12 text-lg"
                            required
                          />
                        </div>
                        {newReading && parseInt(newReading) > selectedMeter.lastReading && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-white/70">Water Usage:</span>
                              <span className="text-lg font-bold text-emerald-400">
                                {(parseInt(newReading) - selectedMeter.lastReading).toLocaleString()} L
                              </span>
                            </div>
                          </motion.div>
                        )}
                        {newReading && parseInt(newReading) <= selectedMeter.lastReading && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20"
                          >
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-rose-400" />
                              <span className="text-sm text-rose-400">Reading must be greater than {selectedMeter.lastReading.toLocaleString()} L</span>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Photo Evidence (Optional)</label>
                        <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-water-400/50 hover:bg-white/5 transition-all cursor-pointer">
                          <Camera className="w-6 h-6 text-white/40 mx-auto mb-1" />
                          <p className="text-xs text-white/60">Click to upload meter photo</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Notes (Optional)</label>
                        <textarea
                          className="glass-input w-full h-16 resize-none text-sm"
                          placeholder="Any observations or issues..."
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedMeter(null)
                            setMeterSearch('')
                          }}
                          className="flex-1 glass-button"
                        >
                          Clear
                        </motion.button>
                        <motion.button
                          type="submit"
                          disabled={isRecording || !newReading || parseInt(newReading) <= selectedMeter.lastReading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 glass-button-primary flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isRecording ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              >
                                <Sparkles className="w-5 h-5" />
                              </motion.div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-5 h-5" />
                              Save Reading
                            </>
                          )}
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Empty State - No meter selected */}
              {!selectedMeter && !isLoadingMeter && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-white/30" />
                  </div>
                  <p className="text-white/60 mb-2">Search for a meter to get started</p>
                  <p className="text-xs text-white/40">You can search by meter ID, tenant name, or unit number</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboard Success Popup */}
      <AnimatePresence>
        {showOnboardSuccess && (
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
              {/* Confetti Animation */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: ['#00a9ff', '#4dc8ff', '#10b981', '#f59e0b', '#ec4899'][i % 5],
                      left: `${Math.random() * 100}%`,
                      top: `-10%`,
                    }}
                    animate={{
                      y: ['0vh', '100vh'],
                      x: [0, (Math.random() - 0.5) * 100],
                      rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
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
                transition={{ delay: 0.2, type: 'spring', damping: 10, stiffness: 200 }}
                className="relative mx-auto mb-6"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                  >
                    <CheckCircle className="w-12 h-12 text-white" />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -top-2 -right-2"
                >
                  <PartyPopper className="w-8 h-8 text-amber-400" />
                </motion.div>
              </motion.div>

              {/* Success Text */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-display font-bold text-white mb-2"
              >
                Tenant Onboarded!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/60 mb-6"
              >
                The new tenant has been successfully added to the system.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowOnboardSuccess(false)}
                  className="flex-1 glass-button text-sm"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowOnboardSuccess(false)
                    setShowOnboardModal(true)
                  }}
                  className="flex-1 glass-button-primary text-sm flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Another
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading Success Popup */}
      <AnimatePresence>
        {showReadingSuccess && (
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
              {/* Water Ripple Animation */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-32 h-32 rounded-full border-2 border-water-400/30"
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{
                      duration: 2,
                      delay: i * 0.4,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>

              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 10, stiffness: 200 }}
                className="relative mx-auto mb-6"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-water-400 to-water-600 flex items-center justify-center mx-auto shadow-lg shadow-water-500/30">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                  >
                    <Droplets className="w-12 h-12 text-white" />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg"
                >
                  <CheckCircle className="w-6 h-6 text-white" />
                </motion.div>
              </motion.div>

              {/* Success Text */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-display font-bold text-white mb-2"
              >
                Reading Recorded!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/60 mb-6"
              >
                The meter reading has been successfully saved.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Readings Today</span>
                  <span className="text-lg font-bold text-water-400">25 / 32</span>
                </div>
                <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '78%' }}
                    transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-water-400 to-water-500 rounded-full"
                  />
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowReadingSuccess(false)}
                  className="flex-1 glass-button text-sm"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowReadingSuccess(false)
                    openReadingModal()
                  }}
                  className="flex-1 glass-button-primary text-sm flex items-center justify-center gap-2"
                >
                  <Gauge className="w-4 h-4" />
                  Next Reading
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}