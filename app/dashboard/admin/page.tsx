'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/layout/Header'
import DataTable from '@/components/ui/DataTable'
import {
  Users,
  UserPlus,
  Shield,
  Home,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Clock,
  X,
  Mail,
  Phone,
  Upload,
  FileText,
  CreditCard,
  BadgeCheck,
  Sparkles,
  PartyPopper,
  UserCheck,
  Hash
} from 'lucide-react'

export default function UsersPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'all' | 'admins' | 'staff' | 'tenants'>('all')
  const [selectedRole, setSelectedRole] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const user = {
    name: 'Admin User',
    email: 'admin@aquaflow.com',
    role: 'System Admin'
  }

  const users = [
    { id: 'U001', name: 'John Smith', email: 'john@example.com', phone: '+254 700-0101', role: 'tenant', unit: '4A', status: 'Active', createdAt: '2023-06-15' },
    { id: 'U002', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+254 700-0102', role: 'tenant', unit: '7B', status: 'Active', createdAt: '2023-07-22' },
    { id: 'U003', name: 'Michael Brown', email: 'michael@example.com', phone: '+254 700-0103', role: 'tenant', unit: '2C', status: 'Suspended', createdAt: '2023-05-10' },
    { id: 'U004', name: 'Emily Davis', email: 'emily@aquaflow.com', phone: '+254 700-0104', role: 'staff', unit: '-', status: 'Active', createdAt: '2023-03-01' },
    { id: 'U005', name: 'David Wilson', email: 'david@aquaflow.com', phone: '+254 700-0105', role: 'staff', unit: '-', status: 'Active', createdAt: '2023-04-15' },
    { id: 'U006', name: 'Admin User', email: 'admin@aquaflow.com', phone: '+254 700-0100', role: 'admin', unit: '-', status: 'Active', createdAt: '2023-01-01' },
    { id: 'U007', name: 'Alice Cooper', email: 'alice@example.com', phone: '+254 700-0106', role: 'tenant', unit: '3B', status: 'Active', createdAt: '2023-08-05' },
    { id: 'U008', name: 'Bob Martin', email: 'bob@example.com', phone: '+254 700-0107', role: 'tenant', unit: '6C', status: 'Pending', createdAt: '2024-01-10' },
  ]

  const filteredUsers = selectedTab === 'all' 
    ? users 
    : users.filter(u => u.role === selectedTab.slice(0, -1))

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'name', 
      label: 'Name',
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            row.role === 'admin' ? 'bg-purple-500/20' :
            row.role === 'staff' ? 'bg-emerald-500/20' :
            'bg-water-500/20'
          }`}>
            {row.role === 'admin' ? <Shield className="w-4 h-4 text-purple-400" /> :
             row.role === 'staff' ? <Users className="w-4 h-4 text-emerald-400" /> :
             <Home className="w-4 h-4 text-water-400" />}
          </div>
          <div>
            <p className="font-medium text-white">{value}</p>
            <p className="text-xs text-white/50">{row.email}</p>
          </div>
        </div>
      )
    },
    { key: 'phone', label: 'Phone' },
    { 
      key: 'role', 
      label: 'Role',
      render: (value: string) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
          value === 'admin' ? 'bg-purple-500/20 text-purple-400' :
          value === 'staff' ? 'bg-emerald-500/20 text-emerald-400' :
          'bg-water-500/20 text-water-400'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'unit', label: 'Unit' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          value === 'Active' ? 'bg-emerald-500/20 text-emerald-400' :
          value === 'Suspended' ? 'bg-rose-500/20 text-rose-400' :
          'bg-amber-500/20 text-amber-400'
        }`}>
          {value === 'Active' && <CheckCircle className="w-3 h-3" />}
          {value === 'Suspended' && <Ban className="w-3 h-3" />}
          {value === 'Pending' && <Clock className="w-3 h-3" />}
          {value}
        </span>
      )
    },
    { key: 'createdAt', label: 'Joined' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Edit className="w-4 h-4 text-white/60" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-white/60 hover:text-rose-400" />
          </motion.button>
        </div>
      )
    },
  ]

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    staff: users.filter(u => u.role === 'staff').length,
    tenants: users.filter(u => u.role === 'tenant').length,
  }

  const tabs = [
    { id: 'all', label: 'All Users', count: stats.total, icon: Users },
    { id: 'admins', label: 'Admins', count: stats.admins, icon: Shield },
    { id: 'staff', label: 'Staff', count: stats.staff, icon: Users },
    { id: 'tenants', label: 'Tenants', count: stats.tenants, icon: Home },
  ]

  const roleOptions = [
    { value: 'tenant', label: 'Tenant', icon: Home, color: 'water', description: 'Water service user' },
    { value: 'staff', label: 'Staff Admin', icon: Users, color: 'emerald', description: 'Manages tenants & readings' },
    { value: 'admin', label: 'System Admin', icon: Shield, color: 'purple', description: 'Full system access' },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Get form data
    const formData = new FormData(e.target as HTMLFormElement)
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    setNewUserName(`${firstName} ${lastName}`)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setShowAddModal(false)
    setSelectedRole('')
    setUploadedFile(null)
    setShowSuccessPopup(true)

    // Hide success popup after 5 seconds
    setTimeout(() => setShowSuccessPopup(false), 5000)
  }

  const resetForm = () => {
    setSelectedRole('')
    setUploadedFile(null)
    setNewUserName('')
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="User Management" 
        subtitle="Manage all system users and their roles"
        user={user}
      />
      
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedTab === tab.id
                    ? 'bg-water-500/20 text-water-400 border border-water-500/30'
                    : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded text-xs ${
                  selectedTab === tab.id ? 'bg-water-500/30' : 'bg-white/10'
                }`}>
                  {tab.count}
                </span>
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowAddModal(true)
              resetForm()
            }}
            className="glass-button-primary flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Add User
          </motion.button>
        </div>

        {/* Users Table */}
        <DataTable
          columns={columns}
          data={filteredUsers}
        />
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
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
                    <h2 className="text-xl font-display font-bold text-white">Add New User</h2>
                    <p className="text-sm text-white/60">Create a new system user</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Personal Information */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-water-400" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">First Name</label>
                      <input 
                        type="text" 
                        name="firstName"
                        className="glass-input w-full text-sm" 
                        placeholder="John" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">Last Name</label>
                      <input 
                        type="text" 
                        name="lastName"
                        className="glass-input w-full text-sm" 
                        placeholder="Doe" 
                        required 
                      />
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
                        <input 
                          type="email" 
                          name="email"
                          className="glass-input w-full pl-10 text-sm" 
                          placeholder="john@example.com" 
                          required 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input 
                          type="tel" 
                          name="phone"
                          className="glass-input w-full pl-10 text-sm" 
                          placeholder="+254 700 000 000" 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ID & Staff Verification */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-water-400" />
                    Identification & Verification
                  </h3>
                  <div className="space-y-3">
                    {/* National ID Number */}
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">National ID Number</label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input 
                          type="text" 
                          name="nationalId"
                          className="glass-input w-full pl-10 text-sm" 
                          placeholder="Enter National ID Number" 
                          required 
                        />
                      </div>
                    </div>

                    {/* Staff Number - Only show for staff and admin roles */}
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">
                        Staff Number 
                        <span className="text-white/40 ml-1">(For Staff & Admin only)</span>
                      </label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input 
                          type="text" 
                          name="staffNumber"
                          className="glass-input w-full pl-10 text-sm" 
                          placeholder="e.g., STF-001 or ADM-001"
                          disabled={selectedRole === 'tenant'}
                        />
                      </div>
                      {selectedRole === 'tenant' && (
                        <p className="text-xs text-white/40 mt-1">Not required for tenants</p>
                      )}
                    </div>

                    {/* National ID Document Upload */}
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">Upload National ID Document</label>
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
                              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
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
                
                {/* Role Selection - Card Style */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-water-400" />
                    Select User Role
                  </h3>
                  <div className="space-y-2">
                    {roleOptions.map((role) => {
                      const Icon = role.icon
                      const isSelected = selectedRole === role.value
                      return (
                        <motion.button
                          key={role.value}
                          type="button"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setSelectedRole(role.value)}
                          className={`w-full p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${
                            isSelected 
                              ? role.color === 'water' 
                                ? 'bg-water-500/20 border-water-500/50 ring-2 ring-water-500/30'
                                : role.color === 'emerald'
                                ? 'bg-emerald-500/20 border-emerald-500/50 ring-2 ring-emerald-500/30'
                                : 'bg-purple-500/20 border-purple-500/50 ring-2 ring-purple-500/30'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            role.color === 'water' 
                              ? 'bg-water-500/20' 
                              : role.color === 'emerald'
                              ? 'bg-emerald-500/20'
                              : 'bg-purple-500/20'
                          }`}>
                            <Icon className={`w-6 h-6 ${
                              role.color === 'water' 
                                ? 'text-water-400' 
                                : role.color === 'emerald'
                                ? 'text-emerald-400'
                                : 'text-purple-400'
                            }`} />
                          </div>
                          <div className="flex-1 text-left">
                            <p className={`font-semibold ${
                              isSelected ? 'text-white' : 'text-white/80'
                            }`}>
                              {role.label}
                            </p>
                            <p className="text-sm text-white/50">{role.description}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected 
                              ? role.color === 'water'
                                ? 'border-water-400 bg-water-400'
                                : role.color === 'emerald'
                                ? 'border-emerald-400 bg-emerald-400'
                                : 'border-purple-400 bg-purple-400'
                              : 'border-white/30'
                          }`}>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 rounded-full bg-white"
                              />
                            )}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                  {!selectedRole && (
                    <p className="text-xs text-amber-400/80 mt-2 flex items-center gap-1">
                      <span>⚠️</span> Please select a role
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 glass-button"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={!selectedRole || isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 glass-button-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
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
                        Add User
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
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
              {/* Animated Background Particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `-10%`,
                    }}
                    animate={{
                      y: ['0%', '120%'],
                      x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100],
                      rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      delay: Math.random() * 0.5,
                      ease: 'easeOut',
                    }}
                  >
                    {i % 3 === 0 ? (
                      <div className="w-3 h-3 rounded-full bg-water-400" />
                    ) : i % 3 === 1 ? (
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    ) : (
                      <div className="w-2 h-2 rounded-sm bg-purple-400 rotate-45" />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Glowing Rings */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-32 h-32 rounded-full border-2 border-emerald-400/20"
                    initial={{ scale: 0.8, opacity: 0.8 }}
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
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', damping: 10, stiffness: 200 }}
                className="relative mx-auto mb-6"
              >
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                  >
                    <UserCheck className="w-14 h-14 text-white" />
                  </motion.div>
                </div>
                
                {/* Decorative Icons */}
                <motion.div
                  initial={{ scale: 0, x: 20, y: 20 }}
                  animate={{ scale: 1, x: 0, y: 0 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="absolute -top-2 -right-2"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
                    <PartyPopper className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0, x: -20, y: 20 }}
                  animate={{ scale: 1, x: 0, y: 0 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="absolute -bottom-1 -left-2"
                >
                  <div className="w-8 h-8 rounded-full bg-water-500 flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              </motion.div>

              {/* Success Text */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-display font-bold text-white mb-2"
              >
                User Onboarded! 🎉
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/70 mb-2"
              >
                <span className="text-emerald-400 font-semibold">{newUserName || 'New user'}</span> has been successfully added to the system.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="text-sm text-white/50 mb-6"
              >
                Role: <span className={`font-medium ${
                  selectedRole === 'admin' ? 'text-purple-400' :
                  selectedRole === 'staff' ? 'text-emerald-400' :
                  'text-water-400'
                }`}>
                  {selectedRole === 'admin' ? 'System Admin' :
                   selectedRole === 'staff' ? 'Staff Admin' : 'Tenant'}
                </span>
              </motion.p>

              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6"
              >
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xl font-bold text-water-400">{stats.tenants + (selectedRole === 'tenant' ? 1 : 0)}</p>
                    <p className="text-xs text-white/50">Tenants</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-emerald-400">{stats.staff + (selectedRole === 'staff' ? 1 : 0)}</p>
                    <p className="text-xs text-white/50">Staff</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-purple-400">{stats.admins + (selectedRole === 'admin' ? 1 : 0)}</p>
                    <p className="text-xs text-white/50">Admins</p>
                  </div>
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
                  onClick={() => setShowSuccessPopup(false)}
                  className="flex-1 glass-button text-sm"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowSuccessPopup(false)
                    resetForm()
                    setShowAddModal(true)
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
    </div>
  )
}