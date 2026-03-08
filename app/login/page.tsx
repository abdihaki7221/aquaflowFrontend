'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Droplets, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Shield,
  Users,
  Home,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'admin' | 'staff' | 'tenant'>('tenant')
  const [isLoading, setIsLoading] = useState(false)

  const roles = [
    { id: 'admin', label: 'System Admin', icon: Shield, color: 'from-purple-500 to-indigo-600' },
    { id: 'staff', label: 'Staff Admin', icon: Users, color: 'from-emerald-500 to-teal-600' },
    { id: 'tenant', label: 'Tenant', icon: Home, color: 'from-water-400 to-water-600' },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    // Redirect based on role
    window.location.href = `/dashboard/${selectedRole}`
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-6 sm:p-6 relative">
      {/* Floating Water Droplets */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-3 rounded-full bg-gradient-to-b from-water-300/40 to-water-500/60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
            }}
            animate={{
              y: ['0vh', '110vh'],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-water-400 to-water-600 mb-4 shadow-neon">
            <Droplets className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold gradient-text">AquaFlow</h1>
          <p className="text-white/60 mt-2">Water Billing Administration</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 sm:p-8"
        >
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/70 mb-3">Login as</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => (
                <motion.button
                  key={role.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRole(role.id as typeof selectedRole)}
                  className={`
                    relative p-3 rounded-xl border transition-all duration-300
                    ${selectedRole === role.id 
                      ? `bg-gradient-to-r ${role.color} border-transparent shadow-lg` 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }
                  `}
                >
                  <role.icon className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">{role.label}</span>
                  {selectedRole === role.id && (
                    <motion.div
                      layoutId="activeRole"
                      className="absolute inset-0 rounded-xl border-2 border-white/30"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="glass-input w-full pl-12"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="glass-input w-full pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-white/10 border-white/20 text-water-500 focus:ring-water-400" />
                <span className="text-white/60">Remember me</span>
              </label>
              <a href="#" className="text-water-400 hover:text-water-300 transition-colors">
                Forgot password?
              </a>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-button-primary w-full flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
          
          </div>

          {/* Contact Admin */}
          <p className="text-center text-sm text-white/60">
            Contact your administrator to get onboarded
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-white/40 mt-6"
        >
          © 2024 AquaFlow. All rights reserved.
        </motion.p>
      </div>
    </main>
  )
}