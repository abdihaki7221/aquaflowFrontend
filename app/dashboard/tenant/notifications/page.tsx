'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/layout/Header'
import {
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Trash2,
  Check,
  Calendar
} from 'lucide-react'

type NotificationType = 'all' | 'warning' | 'info' | 'success' | 'alert'

export default function NotificationsPage() {
  const [filter, setFilter] = useState<NotificationType>('all')
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', title: 'Bill Due Soon', message: 'Your bill of KSH125.00 is due in 10 days. Please make your payment before Jan 25, 2024 to avoid late fees.', time: '2 hours ago', date: '2024-01-15', read: false },
    { id: 2, type: 'info', title: 'Meter Reading Updated', message: 'Your water meter was read on January 10, 2024. Your current usage stands at 1,250 liters for this billing cycle.', time: '5 days ago', date: '2024-01-10', read: false },
    { id: 3, type: 'success', title: 'Payment Received', message: 'Thank you! Your payment of KSH98.50 has been successfully processed. Transaction ID: TXN-2024-0115.', time: 'Jan 15, 2024', date: '2024-01-15', read: true },
    { id: 4, type: 'alert', title: 'High Usage Alert', message: 'Your water usage this month is 25% higher than your average. This could result in a higher bill.', time: 'Jan 12, 2024', date: '2024-01-12', read: true },
    { id: 5, type: 'info', title: 'System Maintenance', message: 'Scheduled maintenance on January 20, 2024 from 2:00 AM to 4:00 AM. Online services may be temporarily unavailable.', time: 'Jan 8, 2024', date: '2024-01-08', read: true },
    { id: 6, type: 'success', title: 'Account Verified', message: 'Your email address has been successfully verified. You can now receive important notifications via email.', time: 'Jan 5, 2024', date: '2024-01-05', read: true },
  ])

  const user = { name: 'John Smith', email: 'john@example.com', role: 'Tenant' }

  const filterOptions = [
    { id: 'all', label: 'All', icon: Bell },
    { id: 'warning', label: 'Warnings', icon: AlertTriangle },
    { id: 'info', label: 'Info', icon: Info },
    { id: 'success', label: 'Success', icon: CheckCircle },
    { id: 'alert', label: 'Alerts', icon: AlertCircle },
  ]

  const filteredNotifications = filter === 'all' ? notifications : notifications.filter(n => n.type === filter)
  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle
      case 'info': return Info
      case 'success': return CheckCircle
      case 'alert': return AlertCircle
      default: return Bell
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'warning': return 'amber'
      case 'info': return 'water'
      case 'success': return 'emerald'
      case 'alert': return 'rose'
      default: return 'white'
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="Notifications" subtitle={`You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`} user={user} />
      
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter(option.id as NotificationType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === option.id
                    ? 'bg-water-500/20 text-water-400 border border-water-500/30'
                    : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                }`}
              >
                <option.icon className="w-4 h-4" />
                {option.label}
              </motion.button>
            ))}
          </div>

          {unreadCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 text-sm font-medium transition-all"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </motion.button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.map((notification, index) => {
              const Icon = getIcon(notification.type)
              const color = getColor(notification.type)
              
              return (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-card p-5 ${!notification.read ? 'ring-1 ring-white/10' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-${color}-500/20 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 text-${color}-400`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{notification.title}</h3>
                            {!notification.read && <span className="w-2 h-2 rounded-full bg-water-400 animate-pulse" />}
                          </div>
                          <p className="text-sm text-white/70 mt-1">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="w-3 h-3 text-white/40" />
                            <span className="text-xs text-white/40">{notification.time}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4 text-white/60" />
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-white/60 hover:text-rose-400" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {filteredNotifications.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
              <Bell className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white/80">No notifications</h3>
              <p className="text-sm text-white/50 mt-1">
                {filter === 'all' ? "You're all caught up!" : `No ${filter} notifications to show`}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}