'use client'

import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit } from 'lucide-react'

export default function StaffProfilePage() {
  const user = {
    name: 'Staff Member',
    email: 'staff@aquaflow.com',
    role: 'Staff Admin'
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
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                <User className="w-16 h-16 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-display font-bold text-white">Staff Member</h1>
                <p className="text-white/60 mt-1">Staff Administrator</p>
                <div className="flex items-center gap-2 mt-3 justify-center md:justify-start">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                    Active
                  </span>
                  <span className="px-3 py-1 rounded-full bg-water-500/20 text-water-400 text-sm font-medium">
                    Staff Admin
                  </span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="ml-auto glass-button flex items-center gap-2"
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
                    <p className="text-white">staff@aquaflow.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Phone</p>
                    <p className="text-white">+254 700 000 000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Location</p>
                    <p className="text-white">Nairobi, Kenya</p>
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
                    <Shield className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Staff Number</p>
                    <p className="text-white">STF-001</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Joined Date</p>
                    <p className="text-white">March 1, 2023</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Activity Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-3xl font-bold text-water-400">156</p>
                <p className="text-sm text-white/60">Tenants Managed</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-3xl font-bold text-emerald-400">1,245</p>
                <p className="text-sm text-white/60">Readings Recorded</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-3xl font-bold text-purple-400">48</p>
                <p className="text-sm text-white/60">Tenants Onboarded</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-3xl font-bold text-amber-400">98%</p>
                <p className="text-sm text-white/60">Completion Rate</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}