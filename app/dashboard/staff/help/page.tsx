'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/layout/Header'
import {
  HelpCircle,
  Search,
  ChevronDown,
  Book,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Users,
  Gauge,
  CreditCard
} from 'lucide-react'

export default function StaffHelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const user = {
    name: 'Staff Member',
    email: 'staff@aquaflow.com',
    role: 'Staff Admin'
  }

  const faqs = [
    {
      question: 'How do I record a meter reading?',
      answer: 'Navigate to "Meter Readings" from the sidebar, click "Record Reading", search for the meter by ID or tenant name, enter the current reading value, optionally upload a photo for evidence, and click "Save Reading".'
    },
    {
      question: 'How do I onboard a new tenant?',
      answer: 'Go to the Dashboard and click "Onboard New Tenant". Fill in all required fields including personal information, contact details, National ID, and unit/meter information. Upload the ID document and click "Onboard Tenant".'
    },
    {
      question: 'What do the meter status colors mean?',
      answer: 'Green (Completed) means the reading has been recorded for the current period. Yellow (Pending) means the reading is due. Red (Overdue) means the reading is past its due date and needs immediate attention.'
    },
    {
      question: 'How can I view tenant details?',
      answer: 'Go to "Tenants" from the sidebar, find the tenant using the search bar or filters, and click "View Details" to see their complete information including contact details, meter information, and billing status.'
    },
    {
      question: 'What should I do if a meter reading fails to save?',
      answer: 'First, check your internet connection. Ensure the new reading is greater than the last recorded reading. If the problem persists, try refreshing the page and attempting again. Contact support if issues continue.'
    },
  ]

  const quickLinks = [
    { title: 'Recording Readings Guide', icon: Gauge, color: 'water' },
    { title: 'Tenant Management', icon: Users, color: 'emerald' },
    { title: 'Billing Overview', icon: CreditCard, color: 'purple' },
    { title: 'System Documentation', icon: FileText, color: 'amber' },
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
            <motion.button
              key={link.title}
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
            </motion.button>
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
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Need More Help?</h2>
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