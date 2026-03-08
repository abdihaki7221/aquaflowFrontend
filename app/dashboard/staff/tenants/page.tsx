'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/layout/Header'
import {
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Phone,
  Mail,
  Home,
  Gauge,
  CreditCard,
  X,
  MapPin,
  Calendar,
  Droplets
} from 'lucide-react'

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'overdue'>('all')
  const [selectedTenant, setSelectedTenant] = useState<any>(null)
  const [showTenantModal, setShowTenantModal] = useState(false)

  const user = {
    name: 'Staff Member',
    email: 'staff@aquaflow.com',
    role: 'Staff Admin'
  }

  const tenants = [
    { 
      id: 'T001', 
      name: 'John Smith', 
      email: 'john@example.com',
      phone: '+254 700-0101',
      unit: '4A', 
      meter: 'M-1001', 
      address: 'Building A, Floor 4',
      lastReading: 12500,
      currentUsage: 1250,
      status: 'Active', 
      dueAmount: 2500,
      joinedDate: '2023-06-15',
      lastPayment: '2024-01-10'
    },
    { 
      id: 'T002', 
      name: 'Sarah Johnson', 
      email: 'sarah@example.com',
      phone: '+254 700-0102',
      unit: '7B', 
      meter: 'M-1024', 
      address: 'Building B, Floor 7',
      lastReading: 9850,
      currentUsage: 985,
      status: 'Active', 
      dueAmount: 0,
      joinedDate: '2023-07-22',
      lastPayment: '2024-01-15'
    },
    { 
      id: 'T003', 
      name: 'Michael Brown', 
      email: 'michael@example.com',
      phone: '+254 700-0103',
      unit: '2C', 
      meter: 'M-1056', 
      address: 'Building C, Floor 2',
      lastReading: 15600,
      currentUsage: 1560,
      status: 'Overdue', 
      dueAmount: 3200,
      joinedDate: '2023-05-10',
      lastPayment: '2023-12-05'
    },
    { 
      id: 'T004', 
      name: 'Emily Davis', 
      email: 'emily@example.com',
      phone: '+254 700-0104',
      unit: '9A', 
      meter: 'M-1089', 
      address: 'Building A, Floor 9',
      lastReading: 8720,
      currentUsage: 872,
      status: 'Active', 
      dueAmount: 1750,
      joinedDate: '2023-08-01',
      lastPayment: '2024-01-12'
    },
    { 
      id: 'T005', 
      name: 'David Wilson', 
      email: 'david@example.com',
      phone: '+254 700-0105',
      unit: '5D', 
      meter: 'M-1102', 
      address: 'Building D, Floor 5',
      lastReading: 14200,
      currentUsage: 1420,
      status: 'Pending', 
      dueAmount: 2840,
      joinedDate: '2023-09-15',
      lastPayment: '2024-01-08'
    },
    { 
      id: 'T006', 
      name: 'Alice Cooper', 
      email: 'alice@example.com',
      phone: '+254 700-0106',
      unit: '3B', 
      meter: 'M-1033', 
      address: 'Building B, Floor 3',
      lastReading: 11300,
      currentUsage: 1130,
      status: 'Active', 
      dueAmount: 2260,
      joinedDate: '2023-10-20',
      lastPayment: '2024-01-14'
    },
    { 
      id: 'T007', 
      name: 'Bob Martin', 
      email: 'bob@example.com',
      phone: '+254 700-0107',
      unit: '6C', 
      meter: 'M-1067', 
      address: 'Building C, Floor 6',
      lastReading: 7650,
      currentUsage: 765,
      status: 'Overdue', 
      dueAmount: 1530,
      joinedDate: '2023-11-05',
      lastPayment: '2023-12-20'
    },
    { 
      id: 'T008', 
      name: 'Carol White', 
      email: 'carol@example.com',
      phone: '+254 700-0108',
      unit: '8A', 
      meter: 'M-1082', 
      address: 'Building A, Floor 8',
      lastReading: 13400,
      currentUsage: 1340,
      status: 'Active', 
      dueAmount: 0,
      joinedDate: '2023-12-01',
      lastPayment: '2024-01-15'
    },
  ]

  const stats = {
    total: tenants.length,
    active: tenants.filter(t => t.status === 'Active').length,
    pending: tenants.filter(t => t.status === 'Pending').length,
    overdue: tenants.filter(t => t.status === 'Overdue').length,
  }

  const filteredTenants = tenants.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.meter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || t.status.toLowerCase() === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Active':
        return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: CheckCircle }
      case 'Pending':
        return { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: Clock }
      case 'Overdue':
        return { bg: 'bg-rose-500/20', text: 'text-rose-400', icon: AlertTriangle }
      default:
        return { bg: 'bg-white/10', text: 'text-white/60', icon: Clock }
    }
  }

  const viewTenantDetails = (tenant: any) => {
    setSelectedTenant(tenant)
    setShowTenantModal(true)
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Tenants" 
        subtitle="Manage and view all tenant information"
        user={user}
      />
      
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-water-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-water-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-white/60">Total Tenants</p>
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
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
                <p className="text-xs text-white/60">Active</p>
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
            transition={{ delay: 0.3 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-400">{stats.overdue}</p>
                <p className="text-xs text-white/60">Overdue</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search & Filters */}
        <div className="glass-card p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tenants..."
                  className="glass-input pl-10 pr-4 py-2 text-sm w-64"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {['all', 'active', 'pending', 'overdue'].map((status) => (
                <motion.button
                  key={status}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStatusFilter(status as typeof statusFilter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    statusFilter === status
                      ? 'bg-water-500/20 text-water-400 border border-water-500/30'
                      : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {status}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Tenants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredTenants.map((tenant, index) => {
            const statusStyles = getStatusStyles(tenant.status)
            const StatusIcon = statusStyles.icon
            
            return (
              <motion.div
                key={tenant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-5 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-water-400/20 to-water-600/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-water-400">
                        {tenant.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{tenant.name}</h3>
                      <p className="text-xs text-white/50">Unit {tenant.unit}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}>
                    <StatusIcon className="w-3 h-3" />
                    {tenant.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Gauge className="w-4 h-4 text-white/40" />
                    <span className="text-white/60">Meter:</span>
                    <span className="text-white font-mono">{tenant.meter}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="w-4 h-4 text-white/40" />
                    <span className="text-white/60">Usage:</span>
                    <span className="text-water-400">{tenant.currentUsage.toLocaleString()} L</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="w-4 h-4 text-white/40" />
                    <span className="text-white/60">Due:</span>
                    <span className={tenant.dueAmount > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                      KSH {tenant.dueAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => viewTenantDetails(tenant)}
                    className="flex-1 py-2 rounded-lg bg-water-500/20 text-water-400 text-sm font-medium hover:bg-water-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Edit className="w-4 h-4 text-white/60" />
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {filteredTenants.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white/80">No tenants found</h3>
            <p className="text-sm text-white/50 mt-1">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>

      {/* Tenant Details Modal */}
      <AnimatePresence>
        {showTenantModal && selectedTenant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowTenantModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-glass p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-water-400 to-water-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {selectedTenant.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedTenant.name}</h2>
                    <p className="text-sm text-white/60">Tenant ID: {selectedTenant.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTenantModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Contact Info */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-white/80 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-white/40" />
                      <span className="text-sm text-white">{selectedTenant.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-white/40" />
                      <span className="text-sm text-white">{selectedTenant.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-white/40" />
                      <span className="text-sm text-white">{selectedTenant.address}</span>
                    </div>
                  </div>
                </div>

                {/* Unit & Meter Info */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-white/80 mb-3">Unit & Meter Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/50">Unit Number</p>
                      <p className="text-lg font-bold text-white">{selectedTenant.unit}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/50">Meter Number</p>
                      <p className="text-lg font-bold text-water-400">{selectedTenant.meter}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/50">Last Reading</p>
                      <p className="text-lg font-bold text-white">{selectedTenant.lastReading.toLocaleString()} L</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/50">Current Usage</p>
                      <p className="text-lg font-bold text-emerald-400">{selectedTenant.currentUsage.toLocaleString()} L</p>
                    </div>
                  </div>
                </div>

                {/* Billing Info */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-white/80 mb-3">Billing Information</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/50">Amount Due</p>
                      <p className={`text-lg font-bold ${selectedTenant.dueAmount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        KSH {selectedTenant.dueAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-white/50">Last Payment</p>
                      <p className="text-lg font-bold text-white">{selectedTenant.lastPayment}</p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-white/80 mb-3">Account Details</h3>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-white/40" />
                    <span className="text-sm text-white/60">Joined:</span>
                    <span className="text-sm text-white">{selectedTenant.joinedDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTenantModal(false)}
                  className="flex-1 glass-button"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 glass-button-primary flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Tenant
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}