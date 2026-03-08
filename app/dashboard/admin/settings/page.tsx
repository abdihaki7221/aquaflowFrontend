'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Droplets,
  Mail,
  Phone,
  Building,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Globe,
  Palette,
  Database,
  Key
} from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const user = {
    name: 'Admin User',
    email: 'admin@aquaflow.com',
    role: 'System Admin'
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Database },
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
        subtitle="Manage your account and system preferences"
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
            {/* Success Message */}
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <p className="text-emerald-400 font-medium">Settings saved successfully!</p>
              </motion.div>
            )}

            <div className="glass-card p-6 space-y-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">General Settings</h2>
                    <p className="text-sm text-white/60">Configure general application settings</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                        <Building className="w-4 h-4 text-water-400" />
                        Organization Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-white/60 mb-1.5">Organization Name</label>
                          <input type="text" defaultValue="AquaFlow Water Services" className="glass-input w-full text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs text-white/60 mb-1.5">Contact Email</label>
                          <input type="email" defaultValue="contact@aquaflow.com" className="glass-input w-full text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs text-white/60 mb-1.5">Phone Number</label>
                          <input type="tel" defaultValue="+254 700 000 000" className="glass-input w-full text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs text-white/60 mb-1.5">Address</label>
                          <input type="text" defaultValue="123 Water Street, Nairobi" className="glass-input w-full text-sm" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-water-400" />
                        Water Billing Configuration
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-white/60 mb-1.5">Rate per Liter (KSH)</label>
                          <input type="number" defaultValue="10" className="glass-input w-full text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs text-white/60 mb-1.5">Monthly Allowance (Liters)</label>
                          <input type="number" defaultValue="2000" className="glass-input w-full text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs text-white/60 mb-1.5">Late Payment Fee (KSH)</label>
                          <input type="number" defaultValue="500" className="glass-input w-full text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs text-white/60 mb-1.5">Payment Due Days</label>
                          <input type="number" defaultValue="15" className="glass-input w-full text-sm" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-water-400" />
                        Localization
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-white/60 mb-1.5">Currency</label>
                          <select className="glass-input w-full text-sm bg-slate-800">
                            <option value="KSH">KSH - Kenyan Shilling</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-white/60 mb-1.5">Timezone</label>
                          <select className="glass-input w-full text-sm bg-slate-800">
                            <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                            <option value="UTC">UTC</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">Profile Settings</h2>
                    <p className="text-sm text-white/60">Manage your personal information</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-water-400 to-water-600 flex items-center justify-center">
                        <User className="w-12 h-12 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Admin User</h3>
                        <p className="text-sm text-white/60">System Administrator</p>
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
                        <input type="text" defaultValue="Admin" className="glass-input w-full text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 mb-1.5">Last Name</label>
                        <input type="text" defaultValue="User" className="glass-input w-full text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 mb-1.5">Email</label>
                        <input type="email" defaultValue="admin@aquaflow.com" className="glass-input w-full text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 mb-1.5">Phone</label>
                        <input type="tel" defaultValue="+254 700 000 000" className="glass-input w-full text-sm" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">Notification Settings</h2>
                    <p className="text-sm text-white/60">Configure how you receive notifications</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: 'Payment Notifications', description: 'Get notified when payments are received or failed', enabled: true },
                      { title: 'New User Registrations', description: 'Get notified when new users are onboarded', enabled: true },
                      { title: 'Meter Readings', description: 'Get notified when meter readings are recorded', enabled: false },
                      { title: 'System Alerts', description: 'Get notified about system issues and maintenance', enabled: true },
                      { title: 'Monthly Reports', description: 'Receive monthly summary reports via email', enabled: true },
                      { title: 'Overdue Payments', description: 'Get notified about overdue payment reminders', enabled: true },
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

              {/* Billing Settings */}
              {activeTab === 'billing' && (
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">Billing Settings</h2>
                    <p className="text-sm text-white/60">Configure payment methods and billing preferences</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-sm font-semibold text-white/80 mb-3">Payment Methods</h3>
                      <div className="space-y-3">
                        {[
                          { name: 'M-Pesa', status: 'Active', icon: '📱' },
                          { name: 'Bank Transfer', status: 'Active', icon: '🏦' },
                          { name: 'Card Payment', status: 'Active', icon: '💳' },
                        ].map((method) => (
                          <div key={method.name} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{method.icon}</span>
                              <span className="text-sm text-white">{method.name}</span>
                            </div>
                            <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-xs text-emerald-400">{method.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-sm font-semibold text-white/80 mb-3">M-Pesa Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-white/60 mb-1.5">Paybill Number</label>
                          <input type="text" defaultValue="123456" className="glass-input w-full text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs text-white/60 mb-1.5">Account Number Prefix</label>
                          <input type="text" defaultValue="AQUA" className="glass-input w-full text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Security Settings */}
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

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-sm font-semibold text-white/80 mb-3">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white">Enable 2FA</p>
                          <p className="text-xs text-white/50">Add an extra layer of security to your account</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-water-500"></div>
                        </label>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-semibold text-amber-400">Security Recommendation</h3>
                          <p className="text-xs text-white/60 mt-1">
                            We recommend enabling two-factor authentication for enhanced security.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* System Settings */}
              {activeTab === 'system' && (
                <>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">System Settings</h2>
                    <p className="text-sm text-white/60">Advanced system configuration</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                        <Database className="w-4 h-4 text-water-400" />
                        Database
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-white/50">Status</p>
                          <p className="text-sm text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Connected
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-white/50">Last Backup</p>
                          <p className="text-sm text-white font-medium">Today, 03:00 AM</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                        <Palette className="w-4 h-4 text-water-400" />
                        Appearance
                      </h3>
                      <div>
                        <label className="block text-xs text-white/60 mb-1.5">Theme</label>
                        <select className="glass-input w-full text-sm bg-slate-800">
                          <option value="dark">Dark (Default)</option>
                          <option value="light">Light</option>
                          <option value="system">System</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                      <h3 className="text-sm font-semibold text-rose-400 mb-2">Danger Zone</h3>
                      <p className="text-xs text-white/60 mb-3">
                        These actions are irreversible. Please proceed with caution.
                      </p>
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-2 rounded-lg bg-rose-500/20 text-rose-400 text-sm font-medium hover:bg-rose-500/30 transition-colors"
                        >
                          Clear Cache
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-2 rounded-lg bg-rose-500/20 text-rose-400 text-sm font-medium hover:bg-rose-500/30 transition-colors"
                        >
                          Reset System
                        </motion.button>
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