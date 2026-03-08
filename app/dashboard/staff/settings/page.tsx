'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import {
  Settings,
  User,
  Bell,
  Shield,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  Key,
  Mail,
  Phone
} from 'lucide-react'

export default function StaffSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const user = {
    name: 'Staff Member',
    email: 'staff@aquaflow.com',
    role: 'Staff Admin'
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Settings" 
        subtitle="Manage your account preferences"
        user={user}
      />
      
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 flex-shrink-0 w-full"
          >
            <div className="glass-card p-2 flex lg:flex-col gap-1 overflow-x-auto hide-scrollbar">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-water-500/20 text-water-400'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Settings Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <p className="text-emerald-400 font-medium">Settings saved successfully!</p>
              </motion.div>
            )}

            <div className="glass-card p-6 space-y-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">Profile Settings</h2>
                    <p className="text-sm text-white/60">Manage your personal information</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                        <User className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Staff Member</h3>
                        <p className="text-sm text-white/60">Staff Administrator</p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="mt-2 px-4 py-1.5 rounded-lg bg-white/10 text-sm text-white/80 hover:bg-white/20 transition-colors"
                        >
                          Change Photo
                        </motion.button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-white/60 mb-1.5">First Name</label>
                        <input type="text" defaultValue="Staff" className="glass-input w-full text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 mb-1.5">Last Name</label>
                        <input type="text" defaultValue="Member" className="glass-input w-full text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 mb-1.5">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                          <input type="email" defaultValue="staff@aquaflow.com" className="glass-input w-full pl-10 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 mb-1.5">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                          <input type="tel" defaultValue="+254 700 000 000" className="glass-input w-full pl-10 text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">Notification Settings</h2>
                    <p className="text-sm text-white/60">Configure how you receive notifications</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: 'New Tenant Assignments', description: 'Get notified when new tenants are assigned to you', enabled: true },
                      { title: 'Meter Reading Reminders', description: 'Daily reminders for pending meter readings', enabled: true },
                      { title: 'Payment Alerts', description: 'Get notified about tenant payments', enabled: false },
                      { title: 'System Updates', description: 'Important system announcements', enabled: true },
                    ].map((notification, index) => (
                      <motion.div
                        key={notification.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div>
                          <h3 className="text-sm font-medium text-white">{notification.title}</h3>
                          <p className="text-xs text-white/50">{notification.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={notification.enabled} className="sr-only peer" />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-water-500"></div>
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">Security Settings</h2>
                    <p className="text-sm text-white/60">Manage your account security</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                        <Key className="w-4 h-4 text-water-400" />
                        Change Password
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-white/60 mb-1.5">Current Password</label>
                          <div className="relative">
                            <input 
                              type={showPassword ? 'text' : 'password'} 
                              className="glass-input w-full text-sm pr-10" 
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-white/60 mb-1.5">New Password</label>
                          <input type="password" className="glass-input w-full text-sm" placeholder="Enter new password" />
                        </div>
                        <div>
                          <label className="block text-xs text-white/60 mb-1.5">Confirm New Password</label>
                          <input type="password" className="glass-input w-full text-sm" placeholder="Confirm new password" />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="glass-button-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Save className="w-4 h-4" />
                      </motion.div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}