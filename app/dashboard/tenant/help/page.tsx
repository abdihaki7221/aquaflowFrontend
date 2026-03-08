'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/layout/Header'
import {
  HelpCircle,
  Search,
  ChevronDown,
  CreditCard,
  Droplets,
  Gauge,
  Receipt,
  MessageCircle,
  Phone,
  Mail,
  FileText
} from 'lucide-react'

export default function TenantHelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const user = {
    name: 'John Smith',
    email: 'john@example.com',
    role: 'Tenant'
  }

  const faqs = [
    {
      question: 'How do I pay my water bill?',
      answer: 'You can pay your water bill through M-Pesa, bank transfer, or card payment. Go to "Pay Bills" from the sidebar, select your payment method, and follow the instructions. For M-Pesa, use Paybill 123456 and your unit number as the account.'
    },
    {
      question: 'When is my bill due?',
      answer: 'Bills are generated on the 20th of each month and are due by the 25th. You\'ll receive a notification when your bill is ready and reminders before the due date.'
    },
    {
      question: 'How is my water usage calculated?',
      answer: 'Your water usage is calculated based on meter readings taken monthly. The difference between your current and previous reading determines your usage in liters, which is then multiplied by the rate per liter (KSH 10).'
    },
    {
      question: 'What happens if I pay late?',
      answer: 'Late payments may incur a fee of KSH 500. If payment is significantly overdue, water service may be temporarily suspended until the balance is cleared.'
    },
    {
      question: 'How can I view my payment history?',
      answer: 'Go to "Transactions" from the sidebar to view all your past payments, including dates, amounts, and payment methods used.'
    },
    {
      question: 'What should I do if I notice a leak?',
      answer: 'If you notice a water leak, please report it immediately through our support channels. You can call us at +254 700 123 456 or email support@aquaflow.com. We\'ll send a technician to investigate.'
    },
    {
      question: 'How do I update my contact information?',
      answer: 'Go to "Settings" from the sidebar, then select "Profile". You can update your phone number, email, and other personal information there.'
    },
  ]

  const quickLinks = [
    { title: 'Pay Bills', description: 'Make a payment', icon: CreditCard, color: 'emerald', href: '/dashboard/tenant/billing' },
    { title: 'View Usage', description: 'Check consumption', icon: Droplets, color: 'water', href: '/dashboard/tenant/usage' },
    { title: 'Transactions', description: 'Payment history', icon: Receipt, color: 'purple', href: '/dashboard/tenant/transactions' },
    { title: 'Settings', description: 'Account settings', icon: FileText, color: 'amber', href: '/dashboard/tenant/settings' },
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      <Header 
        title="Help Center" 
        subtitle="Find answers and get support"
        user={user}
      />
      
      <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6 max-w-4xl mx-auto space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="glass-input w-full pl-12 py-4 text-lg"
            />
          </div>
        </motion.div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {quickLinks.map((link, index) => (
            <motion.a
              key={link.title}
              href={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card p-4 text-center hover:bg-white/10 transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                link.color === 'water' ? 'bg-water-500/20' :
                link.color === 'emerald' ? 'bg-emerald-500/20' :
                link.color === 'purple' ? 'bg-purple-500/20' :
                'bg-amber-500/20'
              }`}>
                <link.icon className={`w-6 h-6 ${
                  link.color === 'water' ? 'text-water-400' :
                  link.color === 'emerald' ? 'text-emerald-400' :
                  link.color === 'purple' ? 'text-purple-400' :
                  'text-amber-400'
                }`} />
              </div>
              <p className="text-sm font-medium text-white">{link.title}</p>
              <p className="text-xs text-white/50">{link.description}</p>
            </motion.a>
          ))}
        </div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-water-400" />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="text-left text-white font-medium">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-white/60 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="p-4 pt-0 text-white/70 text-sm">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-8">
              <HelpCircle className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No results found</p>
              <p className="text-sm text-white/40">Try a different search term</p>
            </div>
          )}
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Need More Help?</h2>
          <p className="text-white/60 mb-4">Our support team is available 24/7 to assist you.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-water-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-water-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Email</p>
                <p className="text-white">support@aquaflow.com</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Phone</p>
                <p className="text-white">+254 700 123 456</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Live Chat</p>
                <p className="text-white">Available 24/7</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}