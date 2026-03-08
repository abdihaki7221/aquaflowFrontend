'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Bell,
  User,
  ChevronDown,
  Settings,
  LogOut,
  HelpCircle,
  X
} from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  user?: {
    name: string
    email: string
    avatar?: string
    role: string
  }
}

export default function Header({ title, subtitle, user }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const getBasePath = () => {
    if (pathname.includes('/dashboard/admin')) return '/dashboard/admin'
    if (pathname.includes('/dashboard/staff')) return '/dashboard/staff'
    if (pathname.includes('/dashboard/tenant')) return '/dashboard/tenant'
    return '/dashboard'
  }

  const basePath = getBasePath()

  const notifications = [
    { id: 1, title: 'Payment Received', message: 'Unit 4A paid KSH 2,500', time: '5 min ago', unread: true },
    { id: 2, title: 'New Tenant', message: 'John Doe has been onboarded', time: '1 hour ago', unread: true },
    { id: 3, title: 'Bill Due Soon', message: '15 tenants have bills due in 3 days', time: '2 hours ago', unread: false },
    { id: 4, title: 'Meter Reading', message: 'Staff completed 25 readings today', time: '5 hours ago', unread: false },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  const handleLogout = () => {
    setShowProfile(false)
    router.push('/')
  }

  const handleNavigate = (path: string) => {
    setShowProfile(false)
    router.push(path)
  }

  return (
    <>
      <header className="glass-navbar sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4">
          {/* Title - adjusted for mobile menu button */}
          <div className="pl-14 lg:pl-0 min-w-0 flex-1">
            <h1 className="text-base sm:text-lg lg:text-2xl font-display font-bold text-white truncate">{title}</h1>
            {subtitle && <p className="text-xs lg:text-sm text-white/60 mt-0.5 truncate">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* Desktop Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input type="text" placeholder="Search..." className="glass-input pl-10 pr-4 py-2 w-48 lg:w-64 text-sm" />
            </div>

            {/* Mobile Search Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMobileSearch(true)}
              className="md:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Search className="w-5 h-5 text-white/70" />
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Bell className="w-5 h-5 text-white/70" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifications(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-[min(calc(100vw-2rem),320px)] bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-glass overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h3 className="font-semibold text-white">Notifications</h3>
                        <span className="text-xs text-water-400">{unreadCount} unread</span>
                      </div>
                      <div className="max-h-[60vh] overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer active:bg-white/10 ${notification.unread ? 'bg-water-500/5' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              {notification.unread && <span className="w-2 h-2 rounded-full bg-water-400 mt-2 flex-shrink-0" />}
                              <div className={notification.unread ? '' : 'ml-5'}>
                                <p className="text-sm font-medium text-white">{notification.title}</p>
                                <p className="text-xs text-white/60 mt-0.5">{notification.message}</p>
                                <p className="text-xs text-white/40 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-white/10">
                        <button className="w-full text-center text-sm text-water-400 hover:text-water-300 transition-colors py-2">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 lg:gap-3 p-1.5 lg:p-2 pr-2 lg:pr-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-water-400 to-water-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-white truncate max-w-[100px]">{user?.name || 'User'}</p>
                  <p className="text-xs text-white/50 capitalize">{user?.role || 'Role'}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-white/50 hidden sm:block" />
              </motion.button>

              <AnimatePresence>
                {showProfile && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfile(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-glass p-2 z-50"
                    >
                      {/* User Info */}
                      <div className="px-3 py-2 mb-2 border-b border-white/10">
                        <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-white/50 truncate">{user?.email || 'user@example.com'}</p>
                      </div>

                      {/* Profile Link */}
                      <button
                        onClick={() => handleNavigate(`${basePath}/profile`)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white active:bg-white/15"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">Profile</span>
                      </button>

                      {/* Settings Link */}
                      <button
                        onClick={() => handleNavigate(`${basePath}/settings`)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white active:bg-white/15"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </button>

                      {/* Help Center Link */}
                      <button
                        onClick={() => handleNavigate(`${basePath}/help`)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white active:bg-white/15"
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span className="text-sm">Help Center</span>
                      </button>

                      <div className="my-2 border-t border-white/10" />

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-colors text-white/80 hover:text-red-400 active:bg-red-500/15"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Modal */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="p-4"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search..."
                    autoFocus
                    className="w-full bg-slate-800/90 border border-white/20 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-water-400"
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMobileSearch(false)}
                  className="p-3 rounded-xl bg-white/10"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}