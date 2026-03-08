'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Gauge,
  CreditCard,
  Settings,
  Home,
  Receipt,
  BarChart3
} from 'lucide-react'

interface MobileNavProps {
  role: 'admin' | 'staff' | 'tenant'
}

export default function MobileNav({ role }: MobileNavProps) {
  const pathname = usePathname()

  const menuItems = {
    admin: [
      { icon: LayoutDashboard, label: 'Home', href: '/dashboard/admin' },
      { icon: Users, label: 'Users', href: '/dashboard/admin/users' },
      { icon: BarChart3, label: 'Analytics', href: '/dashboard/admin/analytics' },
      { icon: CreditCard, label: 'Payments', href: '/dashboard/admin/transactions' },
      { icon: Settings, label: 'Settings', href: '/dashboard/admin/settings' },
    ],
    staff: [
      { icon: LayoutDashboard, label: 'Home', href: '/dashboard/staff' },
      { icon: Users, label: 'Tenants', href: '/dashboard/staff/tenants' },
      { icon: Gauge, label: 'Meters', href: '/dashboard/staff/meters' },
      { icon: Settings, label: 'Settings', href: '/dashboard/staff/settings' },
    ],
    tenant: [
      { icon: Home, label: 'Home', href: '/dashboard/tenant' },
      { icon: Gauge, label: 'Usage', href: '/dashboard/tenant/usage' },
      { icon: CreditCard, label: 'Pay', href: '/dashboard/tenant/billing' },
      { icon: Receipt, label: 'History', href: '/dashboard/tenant/transactions' },
      { icon: Settings, label: 'Settings', href: '/dashboard/tenant/settings' },
    ],
  }

  const items = menuItems[role]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 safe-area-inset">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center py-2 px-1 rounded-xl transition-colors ${
                  isActive 
                    ? 'text-water-400' 
                    : 'text-white/50'
                }`}
              >
                <div className={`relative p-2 rounded-xl transition-colors ${isActive ? 'bg-water-500/20' : ''}`}>
                  <item.icon className="w-5 h-5" />
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute inset-0 bg-water-500/20 rounded-xl"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}