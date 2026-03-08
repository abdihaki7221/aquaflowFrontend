'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/layout/Header'
import {
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Sparkles,
  PartyPopper,
  Receipt,
  Download,
  Droplets,
  FileText
} from 'lucide-react'

export default function BillingPage() {
  const [showPayModal, setShowPayModal] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('mpesa')
  const [selectedBill, setSelectedBill] = useState<any>(null)

  const user = {
    name: 'John Smith',
    email: 'john@example.com',
    role: 'Tenant'
  }

  const currentBill = {
    id: 'BILL-2024-001',
    period: 'January 2024',
    amount: 2500,
    dueDate: 'Jan 25, 2024',
    status: 'Pending',
    usage: 250,
    rate: 10,
    meterReading: 12500,
    previousReading: 12250
  }

  const billingHistory = [
    { id: 'BILL-2023-012', period: 'December 2023', amount: 2100, dueDate: 'Dec 25, 2023', status: 'Paid', paidDate: 'Dec 18, 2023' },
    { id: 'BILL-2023-011', period: 'November 2023', amount: 1950, dueDate: 'Nov 25, 2023', status: 'Paid', paidDate: 'Nov 20, 2023' },
    { id: 'BILL-2023-010', period: 'October 2023', amount: 2200, dueDate: 'Oct 25, 2023', status: 'Paid', paidDate: 'Oct 22, 2023' },
    { id: 'BILL-2023-009', period: 'September 2023', amount: 2400, dueDate: 'Sep 25, 2023', status: 'Paid', paidDate: 'Sep 24, 2023' },
    { id: 'BILL-2023-008', period: 'August 2023', amount: 2650, dueDate: 'Aug 25, 2023', status: 'Paid', paidDate: 'Aug 20, 2023' },
  ]

  const handlePayment = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2500))
    setIsProcessing(false)
    setShowPayModal(false)
    setShowSuccessPopup(true)
    setTimeout(() => setShowSuccessPopup(false), 5000)
  }

  const openPayModal = (bill: any) => {
    setSelectedBill(bill)
    setShowPayModal(true)
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Pay Bills" 
        subtitle="View and pay your water bills"
        user={user}
      />
      
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Current Bill Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 sm:p-6 border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-600/5"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <Receipt className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-white">Current Bill</h2>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {currentBill.status}
                  </span>
                </div>
                <p className="text-white/60">{currentBill.period}</p>
                <p className="text-sm text-white/40">Bill ID: {currentBill.id}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-white/60">Amount Due</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">KSH {currentBill.amount.toLocaleString()}</p>
                <p className="text-sm text-amber-400">Due: {currentBill.dueDate}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openPayModal(currentBill)}
                className="glass-button-primary flex items-center gap-2 whitespace-nowrap"
              >
                <CreditCard className="w-5 h-5" />
                Pay Now
              </motion.button>
            </div>
          </div>

          {/* Bill Breakdown */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-sm font-semibold text-white/80 mb-3">Bill Breakdown</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-white/50">Previous Reading</p>
                <p className="text-lg font-semibold text-white">{currentBill.previousReading.toLocaleString()} L</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-white/50">Current Reading</p>
                <p className="text-lg font-semibold text-water-400">{currentBill.meterReading.toLocaleString()} L</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-white/50">Water Used</p>
                <p className="text-lg font-semibold text-white">{currentBill.usage} L</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-white/50">Rate per Liter</p>
                <p className="text-lg font-semibold text-white">KSH {currentBill.rate}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">KSH 13,300</p>
                <p className="text-sm text-white/60">Total Paid (Last 6 months)</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-water-500/20 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-water-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">1,420 L</p>
                <p className="text-sm text-white/60">Avg. Monthly Usage</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">5 Days</p>
                <p className="text-sm text-white/60">Until Due Date</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Billing History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-water-400" />
              Billing History
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase">Bill ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase">Period</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase">Due Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase">Paid Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((bill, index) => (
                  <motion.tr
                    key={bill.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="py-3 px-4 text-sm font-mono text-water-400">{bill.id}</td>
                    <td className="py-3 px-4 text-sm text-white">{bill.period}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-white">KSH {bill.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-white/70">{bill.dueDate}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3 h-3" />
                        {bill.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-white/70">{bill.paidDate}</td>
                    <td className="py-3 px-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        title="Download Receipt"
                      >
                        <Download className="w-4 h-4 text-white/60" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Payment Methods Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Accepted Payment Methods</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { name: 'M-Pesa', icon: '📱', description: 'Paybill: 123456, Account: Your Unit No.', color: 'emerald' },
              { name: 'Bank Transfer', icon: '🏦', description: 'AquaFlow Ltd, A/C: 1234567890', color: 'water' },
              { name: 'Card Payment', icon: '💳', description: 'Visa, Mastercard accepted', color: 'purple' },
            ].map((method, index) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border ${
                  method.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/20' :
                  method.color === 'water' ? 'bg-water-500/10 border-water-500/20' :
                  'bg-purple-500/10 border-purple-500/20'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{method.icon}</span>
                  <h4 className="font-semibold text-white">{method.name}</h4>
                </div>
                <p className="text-sm text-white/60">{method.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayModal && selectedBill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPayModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-glass p-4 sm:p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Pay Bill</h2>
                    <p className="text-sm text-white/60">{selectedBill.period}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPayModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Bill Summary */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/60">Water Usage</span>
                  <span className="text-white">{selectedBill.usage} L × KSH {selectedBill.rate}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-white font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-emerald-400">KSH {selectedBill.amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-white/70">Payment Method</p>
                {[
                  { id: 'mpesa', name: 'M-Pesa', icon: '📱', description: 'Pay via M-Pesa' },
                  { id: 'bank', name: 'Bank Transfer', icon: '🏦', description: 'Direct bank transfer' },
                  { id: 'card', name: 'Card Payment', icon: '💳', description: 'Visa / Mastercard' },
                ].map((method) => (
                  <motion.button
                    key={method.id}
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full p-4 rounded-xl border transition-all flex items-center gap-4 ${
                      paymentMethod === method.id
                        ? 'bg-emerald-500/20 border-emerald-500/50 ring-2 ring-emerald-500/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <div className="text-left">
                      <p className="font-medium text-white">{method.name}</p>
                      <p className="text-xs text-white/50">{method.description}</p>
                    </div>
                    <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === method.id ? 'border-emerald-400 bg-emerald-400' : 'border-white/30'
                    }`}>
                      {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </motion.button>
                ))}
              </div>

              {paymentMethod === 'mpesa' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/70 mb-2">M-Pesa Phone Number</label>
                  <input
                    type="tel"
                    defaultValue="+254 700 000 000"
                    className="glass-input w-full"
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPayModal(false)}
                  className="flex-1 glass-button"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 glass-button-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay Now
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 50 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-glass p-5 sm:p-8 w-full max-w-sm text-center relative overflow-hidden"
            >
              {/* Confetti */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(25)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: ['#10b981', '#00a9ff', '#f59e0b', '#ec4899'][i % 4],
                      left: `${Math.random() * 100}%`,
                      top: `-10%`,
                    }}
                    animate={{
                      y: ['0vh', '100vh'],
                      x: [0, (Math.random() - 0.5) * 100],
                      rotate: [0, 360],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      delay: Math.random() * 0.5,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="relative mx-auto mb-6"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -top-2 -right-2"
                >
                  <PartyPopper className="w-8 h-8 text-amber-400" />
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white mb-2"
              >
                Payment Successful! 🎉
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/60 mb-6"
              >
                Your payment has been processed successfully.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6"
              >
                <p className="text-xs text-white/50 mb-1">Transaction Reference</p>
                <p className="font-mono text-water-400">TXN-{Date.now().toString(36).toUpperCase()}</p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSuccessPopup(false)}
                className="w-full glass-button-primary"
              >
                Done
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}