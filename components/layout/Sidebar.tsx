'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Droplets,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Gauge,
  CreditCard,
  BarChart3,
  Home,
  Receipt,
  Menu,
  X
} from 'lucide-react'

interface SidebarProps {
  role: 'admin' | 'staff' | 'tenant'
}

export default function Sidebar({ role }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setMobileOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileOpen])

  const menuItems = {
    admin: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/admin' },
      { icon: Users, label: 'Users', href: '/dashboard/admin/users' },
      { icon: BarChart3, label: 'Analytics', href: '/dashboard/admin/analytics' },
      { icon: CreditCard, label: 'Transactions', href: '/dashboard/admin/transactions' },
      { icon: FileText, label: 'Reports', href: '/dashboard/admin/reports' },
      { icon: Settings, label: 'Settings', href: '/dashboard/admin/settings' },
    ],
    staff: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/staff' },
      { icon: Users, label: 'Tenants', href: '/dashboard/staff/tenants' },
      { icon: Gauge, label: 'Meter Readings', href: '/dashboard/staff/meters' },
      { icon: Settings, label: 'Settings', href: '/dashboard/staff/settings' },
    ],
    tenant: [
      { icon: Home, label: 'Dashboard', href: '/dashboard/tenant' },
      { icon: Gauge, label: 'Water Usage', href: '/dashboard/tenant/usage' },
      { icon: CreditCard, label: 'Pay Bills', href: '/dashboard/tenant/billing' },
      { icon: Receipt, label: 'Transactions', href: '/dashboard/tenant/transactions' },
      { icon: Settings, label: 'Settings', href: '/dashboard/tenant/settings' },
    ],
  }

  const items = menuItems[role]

  // Mobile Menu Button (rendered in a portal-like manner)
  const MobileMenuButton = () => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => setMobileOpen(true)}
      className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg"
    >
      <Menu className="w-6 h-6 text-white" />
    </motion.button>
  )

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="hidden lg:flex fixed left-0 top-0 h-screen glass-sidebar z-50 flex-col"
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-water-400 to-water-600 flex items-center justify-center shadow-lg flex-shrink-0">
          <Droplets className="w-6 h-6 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <h1 className="text-xl font-display font-bold gradient-text whitespace-nowrap">AquaFlow</h1>
              <p className="text-xs text-white/40 capitalize">{role} Portal</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-water-500/20 to-water-600/10 text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-8 bg-gradient-to-b from-water-400 to-water-600 rounded-r-full"
                  />
                )}
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-water-400' : ''}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-white/10">
        <Link href="/">
          <motion.div
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-medium whitespace-nowrap overflow-hidden"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>
      </div>

      {/* Collapse Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-water-500 flex items-center justify-center shadow-lg z-10"
      >
        {collapsed ? <ChevronRight className="w-4 h-4 text-white" /> : <ChevronLeft className="w-4 h-4 text-white" />}
      </motion.button>
    </motion.aside>
  )

  // Mobile Sidebar Drawer
  const MobileSidebar = () => (
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="lg:hidden fixed left-0 top-0 h-full w-[280px] max-w-[85vw] glass-sidebar z-50 flex flex-col safe-area-inset"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-water-400 to-water-600 flex items-center justify-center shadow-lg">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-display font-bold gradient-text">AquaFlow</h1>
                  <p className="text-xs text-white/40 capitalize">{role} Portal</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white/70" />
              </motion.button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {items.map((item, index) => {
                const isActive = pathname === item.href
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={item.href}>
                      <div
                        className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] ${
                          isActive 
                            ? 'bg-gradient-to-r from-water-500/20 to-water-600/10 text-white' 
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-water-400 to-water-600 rounded-r-full" />
                        )}
                        <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-water-400' : ''}`} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Bottom Section */}
            <div className="p-3 border-t border-white/10">
              <Link href="/">
                <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 active:scale-[0.98]">
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">Logout</span>
                </div>
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <MobileMenuButton />
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}