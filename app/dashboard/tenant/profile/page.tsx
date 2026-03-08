'use client'

import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import { User, Mail, Phone, MapPin, Calendar, Home, Gauge, CreditCard, Edit, Droplets } from 'lucide-react'

export default function TenantProfilePage() {
  const user = {
    name: 'John Smith',
    email: 'john@example.com',
    role: 'Tenant'
  }

  const tenantInfo = {
    unit: '4A',
    meter: 'M-1001',
    address: 'Building A, Floor 4',
    joinedDate: 'June 15, 2023',
    phone: '+254 700 000 101',
    nationalId: '12345678'
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="My Profile" 
        subtitle="View and manage your profile information"
        user={user}
      />
      
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-water-400 to-water-600 flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-white">JS</span>
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-display font-bold text-white">John Smith</h1>
                <p className="text-white/60 mt-1">Unit {tenantInfo.unit} • Meter {tenantInfo.meter}</p>
                <div className="flex items-center gap-2 mt-3 justify-center md:justify-start flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                    Active
                  </span>
                  <span className="px-3 py-1 rounded-full bg-water-500/20 text-water-400 text-sm font-medium">
                    Tenant
                  </span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-button flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </motion.button>
            </div>
          </motion.div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-water-500/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-water-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Email</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Phone</p>
                    <p className="text-white">{tenantInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Address</p>
                    <p className="text-white">{tenantInfo.address}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Account Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Home className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Unit Number</p>
                    <p className="text-white">{tenantInfo.unit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-water-500/20 flex items-center justify-center">
                    <Gauge className="w-5 h-5 text-water-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Meter Number</p>
                    <p className="text-white">{tenantInfo.meter}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Member Since</p>
                    <p className="text-white">{tenantInfo.joinedDate}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Usage Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Account Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <Droplets className="w-6 h-6 text-water-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">250 L</p>
                <p className="text-sm text-white/60">This Month</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <CreditCard className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">KSH 17.6K</p>
                <p className="text-sm text-white/60">Total Paid</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <Gauge className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">12,500 L</p>
                <p className="text-sm text-white/60">Meter Reading</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <Calendar className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">8</p>
                <p className="text-sm text-white/60">Months Active</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}