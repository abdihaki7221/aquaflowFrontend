'use client'

import { motion } from 'framer-motion'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  color: 'water' | 'emerald' | 'amber' | 'purple' | 'rose'
  trend?: {
    value: number
    isPositive: boolean
  }
  subtitle?: string
  delay?: number
}

export default function StatCard({ title, value, icon: Icon, color, trend, subtitle, delay = 0 }: StatCardProps) {
  const colorClasses = {
    water: {
      bg: 'bg-water-500/20',
      text: 'text-water-400',
      glow: 'shadow-water-500/20',
      gradient: 'from-water-400/20 to-water-600/5'
    },
    emerald: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/20',
      gradient: 'from-emerald-400/20 to-emerald-600/5'
    },
    amber: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/20',
      gradient: 'from-amber-400/20 to-amber-600/5'
    },
    purple: {
      bg: 'bg-purple-500/20',
      text: 'text-purple-400',
      glow: 'shadow-purple-500/20',
      gradient: 'from-purple-400/20 to-purple-600/5'
    },
    rose: {
      bg: 'bg-rose-500/20',
      text: 'text-rose-400',
      glow: 'shadow-rose-500/20',
      gradient: 'from-rose-400/20 to-rose-600/5'
    }
  }

  const classes = colorClasses[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`glass-card p-4 sm:p-5 lg:p-6 relative overflow-hidden group cursor-pointer active:bg-white/10 ${classes.glow}`}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${classes.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${classes.text}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.isPositive ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />}
            <span className="hidden xs:inline">{trend.value}%</span>
          </div>
        )}
      </div>
      
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-0.5 sm:mb-1 truncate">{value}</h3>
      <p className="text-xs sm:text-sm text-white/60 truncate">{title}</p>
      {subtitle && <p className="text-xs text-white/40 mt-0.5 sm:mt-1 truncate">{subtitle}</p>}
      
      {/* Background Decoration */}
      <div className={`absolute -bottom-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 rounded-full ${classes.bg} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none`} />
    </motion.div>
  )
}