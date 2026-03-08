'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import {
  FileText,
  Download,
  Calendar,
  Users,
  Droplets,
  CreditCard,
  Gauge,
  TrendingUp,
  FileSpreadsheet,
  File,
  RefreshCw,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react'

export default function ReportsPage() {
  const [generatingReport, setGeneratingReport] = useState<string | null>(null)

  const user = {
    name: 'Admin User',
    email: 'admin@aquaflow.com',
    role: 'System Admin'
  }

  const reportTypes = [
    {
      id: 'transactions',
      title: 'Transactions Report',
      description: 'Complete list of all water payment transactions with status and details',
      icon: CreditCard,
      color: 'water',
      lastGenerated: '2024-01-15',
      format: 'Excel'
    },
    {
      id: 'users',
      title: 'Users Report',
      description: 'All registered users including tenants, staff, and admins with their details',
      icon: Users,
      color: 'purple',
      lastGenerated: '2024-01-14',
      format: 'Excel'
    },
    {
      id: 'water-usage',
      title: 'Water Usage Report',
      description: 'Detailed water consumption data by unit, meter, and time period',
      icon: Droplets,
      color: 'emerald',
      lastGenerated: '2024-01-15',
      format: 'Excel'
    },
    {
      id: 'meters',
      title: 'Meters Report',
      description: 'Status and readings of all water meters in the system',
      icon: Gauge,
      color: 'amber',
      lastGenerated: '2024-01-13',
      format: 'Excel'
    },
    {
      id: 'revenue',
      title: 'Revenue Report',
      description: 'Financial summary including collections, pending, and overdue payments',
      icon: TrendingUp,
      color: 'rose',
      lastGenerated: '2024-01-15',
      format: 'Excel'
    },
    {
      id: 'analytics',
      title: 'Analytics Summary',
      description: 'Comprehensive analytics report with charts and insights',
      icon: BarChart3,
      color: 'indigo',
      lastGenerated: '2024-01-12',
      format: 'PDF'
    },
  ]

  const recentReports = [
    { name: 'transactions_2024-01-15.xlsx', type: 'Transactions', date: '2024-01-15', size: '245 KB', status: 'Ready' },
    { name: 'water_usage_jan_2024.xlsx', type: 'Water Usage', date: '2024-01-15', size: '512 KB', status: 'Ready' },
    { name: 'users_report_2024-01-14.xlsx', type: 'Users', date: '2024-01-14', size: '128 KB', status: 'Ready' },
    { name: 'revenue_q4_2023.xlsx', type: 'Revenue', date: '2024-01-10', size: '384 KB', status: 'Ready' },
    { name: 'meters_status_2024-01-08.xlsx', type: 'Meters', date: '2024-01-08', size: '96 KB', status: 'Ready' },
  ]

  const handleGenerateReport = async (reportId: string) => {
    setGeneratingReport(reportId)
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Create sample data based on report type
    let csvContent = ''
    let fileName = ''
    
    switch (reportId) {
      case 'transactions':
        csvContent = 'Transaction ID,Tenant,Unit,Amount (KSH),Status,Date\nTXN-001,John Smith,4A,2500,Completed,2024-01-15\nTXN-002,Sarah Johnson,7B,1850,Completed,2024-01-15'
        fileName = `transactions_${new Date().toISOString().split('T')[0]}.csv`
        break
      case 'users':
        csvContent = 'User ID,Name,Email,Role,Status,Joined\nU001,John Smith,john@example.com,Tenant,Active,2023-06-15\nU002,Sarah Johnson,sarah@example.com,Tenant,Active,2023-07-22'
        fileName = `users_${new Date().toISOString().split('T')[0]}.csv`
        break
      case 'water-usage':
        csvContent = 'Meter,Unit,Tenant,Usage (L),Month,Year\nM-1001,4A,John Smith,12500,January,2024\nM-1024,7B,Sarah Johnson,9850,January,2024'
        fileName = `water_usage_${new Date().toISOString().split('T')[0]}.csv`
        break
      case 'meters':
        csvContent = 'Meter ID,Unit,Tenant,Last Reading,Status,Last Updated\nM-1001,4A,John Smith,12500,Active,2024-01-15\nM-1024,7B,Sarah Johnson,9850,Active,2024-01-15'
        fileName = `meters_${new Date().toISOString().split('T')[0]}.csv`
        break
      case 'revenue':
        csvContent = 'Month,Collected (KSH),Pending (KSH),Overdue (KSH),Total (KSH)\nJanuary 2024,2400000,450000,125000,2975000\nDecember 2023,2250000,380000,95000,2725000'
        fileName = `revenue_${new Date().toISOString().split('T')[0]}.csv`
        break
      default:
        csvContent = 'Report generated successfully'
        fileName = `report_${new Date().toISOString().split('T')[0]}.csv`
    }
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    link.click()
    
    setGeneratingReport(null)
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      water: { bg: 'bg-water-500/20', text: 'text-water-400', border: 'border-water-500/30' },
      emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
      purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
      amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
      rose: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
      indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30' },
    }
    return colors[color] || colors.water
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Reports" 
        subtitle="Generate and download system reports"
        user={user}
      />
      
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Report Types */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Generate Reports</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {reportTypes.map((report, index) => {
              const colors = getColorClasses(report.color)
              const isGenerating = generatingReport === report.id
              
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-card p-6 border ${colors.border} hover:shadow-lg transition-all`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                      <report.icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-white/5 text-xs text-white/60">
                      {report.format}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{report.title}</h3>
                  <p className="text-sm text-white/60 mb-4">{report.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-white/40">
                      <Clock className="w-3 h-3" />
                      Last: {report.lastGenerated}
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleGenerateReport(report.id)}
                      disabled={isGenerating}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${colors.bg} ${colors.text} hover:opacity-80`}
                    >
                      {isGenerating ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </motion.div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Generate
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Recent Reports</h2>
            <p className="text-sm text-white/60">Previously generated reports available for download</p>
          </div>
          
          <div className="divide-y divide-white/5">
            {recentReports.map((report, index) => (
              <motion.div
                key={report.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 hover:bg-white/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{report.name}</p>
                    <div className="flex items-center gap-3 text-xs text-white/50">
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>{report.date}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/20 text-xs text-emerald-400">
                    <CheckCircle className="w-3 h-3" />
                    {report.status}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Download className="w-4 h-4 text-white/60" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}