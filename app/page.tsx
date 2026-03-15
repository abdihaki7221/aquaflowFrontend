'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Link from 'next/link'
import {
  Droplets,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Shield,
  Gauge,
  Users,
  Building,
  CheckCircle,
  Upload,
  FileText,
  X,
  Sparkles,
  Calculator,
  ChevronDown,
  ChevronRight,
  Globe,
  Zap,
  BarChart3,
  Clock,
  CreditCard,
  Smartphone,
  Home,
  Star,
  Menu,
  Send,
  Banknote,
  ArrowUpRight,
  Heart,
  Waves,
  Target,
  Award,
  AlertTriangle
} from 'lucide-react'

// ---- Water billing tariff (same as dashboard) ----
function calculateWaterBill(usageLitres: number) {
  const units = usageLitres / 1000
  let remaining = units
  let total = 0
  const breakdown: { tier: string; units: number; rate: number; subtotal: number }[] = []

  if (remaining > 0) {
    const t = Math.min(remaining, 6); total += t * 45
    breakdown.push({ tier: '0–6 units', units: Math.round(t * 100) / 100, rate: 45, subtotal: Math.round(t * 45) })
    remaining -= t
  }
  if (remaining > 0) {
    const t = Math.min(remaining, 14); total += t * 55
    breakdown.push({ tier: '7–20 units', units: Math.round(t * 100) / 100, rate: 55, subtotal: Math.round(t * 55) })
    remaining -= t
  }
  if (remaining > 0) {
    const t = Math.min(remaining, 30); total += t * 70
    breakdown.push({ tier: '21–50 units', units: Math.round(t * 100) / 100, rate: 70, subtotal: Math.round(t * 70) })
    remaining -= t
  }
  if (remaining > 0) {
    total += remaining * 80
    breakdown.push({ tier: '50+ units', units: Math.round(remaining * 100) / 100, rate: 80, subtotal: Math.round(remaining * 80) })
  }
  return { units: Math.round(units * 100) / 100, amount: Math.round(total), breakdown }
}

// ---- Mock previous readings DB ----
const meterDB: Record<string, { lastReading: number; tenant: string }> = {
  'M-1001': { lastReading: 12500, tenant: 'John Smith' },
  'M-1024': { lastReading: 9850, tenant: 'Sarah Johnson' },
  'M-1033': { lastReading: 11300, tenant: 'Alice Cooper' },
  'M-1056': { lastReading: 15600, tenant: 'Michael Brown' },
  'M-1067': { lastReading: 7650, tenant: 'Bob Martin' },
  'M-1082': { lastReading: 13400, tenant: 'Carol White' },
  'M-1089': { lastReading: 8720, tenant: 'Emily Davis' },
  'M-1102': { lastReading: 14200, tenant: 'David Wilson' },
  'M-1015': { lastReading: 9200, tenant: 'Dan Green' },
  'M-1045': { lastReading: 10800, tenant: 'Eva Martinez' },
}

// ---- Scroll-animated section wrapper ----
function Section({ children, className = '', id = '' }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // Onboarding modal
  const [showOnboard, setShowOnboard] = useState(false)
  const [onboardStep, setOnboardStep] = useState<'form' | 'submitting' | 'success'>('form')
  const [uploadedID, setUploadedID] = useState<File | null>(null)
  const idInputRef = useRef<HTMLInputElement>(null)
  // Calculator modal
  const [showCalc, setShowCalc] = useState(false)
  const [calcMeter, setCalcMeter] = useState('')
  const [calcReading, setCalcReading] = useState('')
  const [calcResult, setCalcResult] = useState<any>(null)
  const [calcError, setCalcError] = useState('')
  const [calcLoading, setCalcLoading] = useState(false)

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Partners', href: '#partners' },
    { label: 'Calculator', href: '#calculator' },
    { label: 'Contact', href: '#contact' },
  ]

  // ---- Calculator logic ----
  const handleCalculate = async () => {
    setCalcError('')
    setCalcResult(null)
    const meterKey = calcMeter.trim().toUpperCase()
    const currentReading = parseInt(calcReading)

    if (!meterKey) { setCalcError('Please enter your meter number'); return }
    if (!calcReading || isNaN(currentReading)) { setCalcError('Please enter a valid current reading'); return }

    setCalcLoading(true)
    await new Promise(r => setTimeout(r, 1200)) // simulate DB lookup

    const meterData = meterDB[meterKey]
    if (!meterData) { setCalcError(`Meter "${meterKey}" not found. Please check your meter number.`); setCalcLoading(false); return }
    if (currentReading <= meterData.lastReading) { setCalcError(`Current reading must be greater than previous reading (${meterData.lastReading.toLocaleString()} L)`); setCalcLoading(false); return }

    const usageLitres = currentReading - meterData.lastReading
    const bill = calculateWaterBill(usageLitres)
    setCalcResult({ ...bill, usageLitres, previousReading: meterData.lastReading, currentReading, tenant: meterData.tenant, meter: meterKey })
    setCalcLoading(false)
  }

  // ---- Onboard submit ----
  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setOnboardStep('submitting')
    await new Promise(r => setTimeout(r, 2500))
    setOnboardStep('success')
  }

  return (
    <div className="bg-white text-slate-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* ===================== NAVBAR ===================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Aqua<span className="text-sky-600">Flow</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">{link.label}</a>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <button onClick={() => setShowOnboard(true)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-sky-600 border border-sky-200 hover:bg-sky-50 transition-colors">
                Get Connected
              </button>
              <Link href="/login" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/20 transition-all">
                Portal Login
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-100 bg-white"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map(link => (
                  <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">{link.label}</a>
                ))}
                <div className="pt-3 flex flex-col gap-2">
                  <button onClick={() => { setMobileMenuOpen(false); setShowOnboard(true) }}
                    className="w-full px-5 py-3 rounded-xl text-sm font-semibold text-sky-600 border border-sky-200 hover:bg-sky-50 transition-colors">Get Connected</button>
                  <Link href="/login" className="w-full px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 text-center shadow-lg shadow-sky-500/20">Portal Login</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ===================== HERO ===================== */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
        {/* BG elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-sky-100/60 blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-100/40 blur-3xl translate-y-1/2 -translate-x-1/3" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-sm font-medium mb-6">
                <MapPin className="w-4 h-4" />
                Serving Westlands, Nairobi & beyond
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Clean water,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">smart billing,</span>{' '}
                zero hassle.
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-8 max-w-xl">
                AquaFlow delivers reliable water supply to thousands of households across Nairobi with real-time metering, transparent billing, and 24/7 digital account management.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button onClick={() => setShowOnboard(true)}
                  className="px-8 py-4 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-xl shadow-sky-500/25 transition-all flex items-center justify-center gap-2 group">
                  Get Connected Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => setShowCalc(true)}
                  className="px-8 py-4 rounded-2xl text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 shadow-sm transition-all flex items-center justify-center gap-2">
                  <Calculator className="w-5 h-5 text-sky-600" />
                  Calculate Your Bill
                </button>
              </div>
            </motion.div>

            {/* Hero visual */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Decorative rings */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-sky-200/50 animate-spin-slow" />
                <div className="absolute inset-8 rounded-full border border-sky-100" />
                
                {/* Central orb */}
                <div className="absolute inset-16 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 shadow-2xl shadow-sky-500/30 flex items-center justify-center">
                  <Droplets className="w-24 h-24 text-white/90" />
                </div>

                {/* Floating stat cards */}
                <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-4 right-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-4 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><Users className="w-5 h-5 text-emerald-600" /></div>
                    <div><p className="text-2xl font-bold text-slate-900">2,400+</p><p className="text-xs text-slate-500">Households</p></div>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-8 -left-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-4 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center"><Droplets className="w-5 h-5 text-sky-600" /></div>
                    <div><p className="text-2xl font-bold text-slate-900">4.2M</p><p className="text-xs text-slate-500">Litres / month</p></div>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute top-1/2 -right-6 bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-3 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center"><Zap className="w-4 h-4 text-amber-600" /></div>
                    <p className="text-xs font-semibold text-slate-700">99.8% Uptime</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================== LIVE STATS BAR ===================== */}
      <Section className="py-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Home, value: '2,400+', label: 'Households Served', color: 'sky' },
              { icon: Droplets, value: '4.2M L', label: 'Water Distributed Monthly', color: 'sky' },
              { icon: Gauge, value: '2,100+', label: 'Smart Meters Active', color: 'sky' },
              { icon: Star, value: '99.8%', label: 'Service Uptime', color: 'sky' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} className="text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-white/60">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ===================== ABOUT ===================== */}
      <Section id="about" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image side */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-sky-100 to-blue-50 overflow-hidden border border-sky-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <Waves className="w-20 h-20 text-sky-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Since 2018</h3>
                  <p className="text-slate-600">Delivering clean water across Nairobi</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-2xl bg-sky-500/10 border border-sky-200/50 -z-10" />
            </div>

            {/* Text side */}
            <div>
              <p className="text-sky-600 font-semibold text-sm uppercase tracking-wider mb-3">About AquaFlow</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Nairobi&apos;s most trusted water service provider
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Founded in 2018 and headquartered in Westlands, AquaFlow has grown from serving a single estate to supplying clean, reliable water to over 2,400 households across Nairobi. We combine smart metering technology with transparent, tiered billing to ensure every customer pays fairly for exactly what they use.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                Our mission is simple: make water access effortless. From real-time consumption monitoring to instant M-Pesa payments, we&apos;ve digitized every step of the water supply chain so you can focus on what matters most.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Shield, title: 'Licensed & Regulated', desc: 'WASREB certified' },
                  { icon: Zap, title: '24/7 Monitoring', desc: 'Real-time smart meters' },
                  { icon: Smartphone, title: 'Digital Payments', desc: 'M-Pesa, bank, card' },
                  { icon: Heart, title: 'Community First', desc: 'Serving 2,400+ homes' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ===================== SERVICES ===================== */}
      <Section id="services" className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-sky-600 font-semibold text-sm uppercase tracking-wider mb-3">What We Offer</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Everything you need, one platform
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Droplets, title: 'Reliable Water Supply', desc: 'Consistent, clean water delivered to your property 24/7 with backup systems ensuring 99.8% uptime.', color: 'sky' },
              { icon: Gauge, title: 'Smart Metering', desc: 'IoT-enabled meters that track consumption in real-time. No more estimated bills — pay only for what you use.', color: 'blue' },
              { icon: CreditCard, title: 'Flexible Payments', desc: 'Pay via M-Pesa, bank transfer, or card. Set up auto-pay or get STK push prompts when your bill is ready.', color: 'emerald' },
              { icon: BarChart3, title: 'Usage Analytics', desc: 'Track your daily, weekly, and monthly consumption patterns. Get alerts when usage spikes unexpectedly.', color: 'purple' },
              { icon: Globe, title: 'Online Portal', desc: 'Manage your account, view bills, download statements, and contact support — all from your phone or laptop.', color: 'amber' },
              { icon: Zap, title: 'Instant Onboarding', desc: 'Submit your documents online and get connected within 48 hours. No paperwork queues, no wasted time.', color: 'rose' },
            ].map((service, i) => (
              <motion.div key={service.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-${service.color}-100 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`w-7 h-7 text-${service.color}-600`} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{service.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ===================== TARIFF ===================== */}
      <Section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sky-600 font-semibold text-sm uppercase tracking-wider mb-3">Transparent Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Our Water Tariff</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Simple tiered pricing — lower consumption means lower rates. 1 unit = 1,000 litres (1 m³).</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { tier: '0–6 units', rate: 'KSh 45', desc: 'Basic household use', highlight: true },
              { tier: '7–20 units', rate: 'KSh 55', desc: 'Standard consumption', highlight: false },
              { tier: '21–50 units', rate: 'KSh 70', desc: 'Higher consumption', highlight: false },
              { tier: '50+ units', rate: 'KSh 80', desc: 'Commercial / heavy use', highlight: false },
            ].map((t, i) => (
              <motion.div key={t.tier} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-6 text-center border ${t.highlight ? 'bg-sky-50 border-sky-200 ring-2 ring-sky-500/20' : 'bg-white border-slate-100'}`}
              >
                {t.highlight && <p className="text-xs font-semibold text-sky-600 uppercase mb-2">Most Common</p>}
                <p className="text-sm text-slate-500 mb-1">{t.tier}</p>
                <p className="text-3xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{t.rate}</p>
                <p className="text-xs text-slate-500">per m³</p>
                <p className="text-xs text-slate-400 mt-2">{t.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button onClick={() => setShowCalc(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-sky-600 border border-sky-200 hover:bg-sky-50 transition-colors">
              <Calculator className="w-5 h-5" />
              Calculate Your Bill Now
            </button>
          </div>
        </div>
      </Section>

      {/* ===================== PARTNERS ===================== */}
      <Section id="partners" className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sky-600 font-semibold text-sm uppercase tracking-wider mb-3">Trusted Partners</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Companies we work with</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We partner with leading organizations to deliver the best water infrastructure and service.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Safaricom', desc: 'M-Pesa Payments' },
              { name: 'Nairobi Water', desc: 'Bulk Supply' },
              { name: 'WASREB', desc: 'Regulation' },
              { name: 'Kenya Power', desc: 'Infrastructure' },
              { name: 'Equity Bank', desc: 'Financial Services' },
              { name: 'UN Habitat', desc: 'Community Programs' },
            ].map((partner, i) => (
              <motion.div key={partner.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-5 border border-slate-100 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <Building className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-800">{partner.name}</p>
                <p className="text-xs text-slate-500">{partner.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ===================== CALCULATOR CTA + ONBOARD CTA ===================== */}
      <Section id="calculator" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Calculator Card */}
            <div className="rounded-3xl bg-gradient-to-br from-sky-500 to-blue-600 p-8 sm:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
              <Calculator className="w-12 h-12 mb-5 text-white/80" />
              <h3 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Check Your Bill</h3>
              <p className="text-white/80 mb-6 leading-relaxed">Enter your meter number and current reading to instantly see how much you owe this month.</p>
              <button onClick={() => setShowCalc(true)}
                className="px-6 py-3 rounded-xl bg-white text-sky-600 font-semibold text-sm hover:bg-sky-50 transition-colors flex items-center gap-2 group">
                Open Calculator
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Onboard Card */}
            <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 sm:p-10 text-white relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/10 blur-3xl translate-y-1/2 -translate-x-1/2" />
              <Users className="w-12 h-12 mb-5 text-white/80" />
              <h3 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Get Connected</h3>
              <p className="text-white/80 mb-6 leading-relaxed">New to AquaFlow? Submit your documents online and we&apos;ll have you connected within 48 hours.</p>
              <button onClick={() => { setOnboardStep('form'); setShowOnboard(true) }}
                className="px-6 py-3 rounded-xl bg-white text-emerald-600 font-semibold text-sm hover:bg-emerald-50 transition-colors flex items-center gap-2 group">
                Start Application
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ===================== CONTACT / FOOTER ===================== */}
      <Section id="contact" className="py-16 sm:py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>AquaFlow</span>
              </div>
              <p className="text-white/60 leading-relaxed mb-8 max-w-md">
                Smart water solutions for modern Nairobi. Reliable supply, transparent billing, and digital-first account management.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center"><MapPin className="w-5 h-5 text-sky-400" /></div>
                  <div>
                    <p className="text-sm text-white/50">Address</p>
                    <p className="text-white">Westlands, Nairobi, Kenya</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center"><Phone className="w-5 h-5 text-sky-400" /></div>
                  <div>
                    <p className="text-sm text-white/50">Phone</p>
                    <p className="text-white">+254 700 123 456</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center"><Mail className="w-5 h-5 text-sky-400" /></div>
                  <div>
                    <p className="text-sm text-white/50">Email</p>
                    <p className="text-white">info@aquaflow.co.ke</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'About Us', href: '#about' },
                  { label: 'Services', href: '#services' },
                  { label: 'Tariffs', href: '#calculator' },
                  { label: 'Partners', href: '#partners' },
                  { label: 'Portal Login', href: '/login' },
                  { label: 'Get Connected', href: '#', onClick: () => { setOnboardStep('form'); setShowOnboard(true) } },
                ].map(link => (
                  <a key={link.label} href={link.href} onClick={link.onClick as any}
                    className="text-sm text-white/60 hover:text-sky-400 transition-colors py-1">{link.label}</a>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-lg font-semibold mb-4">Office Hours</h3>
                <div className="space-y-2 text-sm text-white/60">
                  <div className="flex justify-between"><span>Monday – Friday</span><span className="text-white">8:00 AM – 6:00 PM</span></div>
                  <div className="flex justify-between"><span>Saturday</span><span className="text-white">9:00 AM – 1:00 PM</span></div>
                  <div className="flex justify-between"><span>Sunday</span><span className="text-white/40">Closed</span></div>
                  <div className="flex justify-between"><span>24/7 Emergency</span><span className="text-sky-400">+254 700 999 999</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">&copy; {new Date().getFullYear()} AquaFlow Water Services Ltd. All rights reserved.</p>
            <div className="flex items-center gap-4 text-sm text-white/40">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </Section>

      {/* ===================== WATER CALCULATOR MODAL ===================== */}
      <AnimatePresence>
        {showCalc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm"
            onClick={() => { setShowCalc(false); setCalcResult(null); setCalcError('') }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl p-5 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-100"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Bill Calculator</h2>
                    <p className="text-sm text-slate-500">Enter your meter details</p>
                  </div>
                </div>
                <button onClick={() => { setShowCalc(false); setCalcResult(null); setCalcError('') }} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Meter Number</label>
                  <div className="relative">
                    <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" value={calcMeter} onChange={e => setCalcMeter(e.target.value)} placeholder="e.g. M-1001"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-slate-900 placeholder-slate-400 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Meter Reading (Litres)</label>
                  <div className="relative">
                    <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="number" value={calcReading} onChange={e => setCalcReading(e.target.value)} placeholder="Enter current reading"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-slate-900 placeholder-slate-400 transition-all" />
                  </div>
                </div>
              </div>

              {calcError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {calcError}
                </motion.div>
              )}

              <button onClick={handleCalculate} disabled={calcLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-sm hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {calcLoading ? (<><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Sparkles className="w-5 h-5" /></motion.div>Looking up meter...</>) : (<><Calculator className="w-5 h-5" />Calculate Bill</>)}
              </button>

              {/* Result */}
              <AnimatePresence>
                {calcResult && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6">
                    <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200">
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-sky-200">
                        <div>
                          <p className="text-xs text-slate-500">Meter</p>
                          <p className="text-sm font-mono font-bold text-sky-600">{calcResult.meter}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Account</p>
                          <p className="text-sm font-semibold text-slate-800">{calcResult.tenant}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3 text-sm">
                        <span className="text-slate-500">Previous Reading</span>
                        <span className="font-mono text-slate-700">{calcResult.previousReading.toLocaleString()} L</span>
                      </div>
                      <div className="flex items-center justify-between mb-3 text-sm">
                        <span className="text-slate-500">Current Reading</span>
                        <span className="font-mono text-sky-600 font-semibold">{calcResult.currentReading.toLocaleString()} L</span>
                      </div>
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-sky-200 text-sm">
                        <span className="text-slate-500">Water Used</span>
                        <span className="font-semibold text-slate-800">{calcResult.usageLitres.toLocaleString()} L ({calcResult.units} m³)</span>
                      </div>

                      {/* Breakdown */}
                      <div className="space-y-2 mb-4">
                        {calcResult.breakdown.map((tier: any, i: number) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">{tier.tier} ({tier.units} × KSh {tier.rate})</span>
                            <span className="font-medium text-slate-700">KSh {tier.subtotal.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-sky-200">
                        <span className="text-base font-bold text-slate-800">Total Due</span>
                        <span className="text-2xl font-bold text-sky-600">KSh {calcResult.amount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <Link href="/login" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold text-center shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-blue-500 transition-all">
                        Login to Pay
                      </Link>
                      <button onClick={() => { setCalcResult(null); setCalcMeter(''); setCalcReading('') }}
                        className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">
                        Calculate Again
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== SELF-ONBOARDING MODAL ===================== */}
      <AnimatePresence>
        {showOnboard && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowOnboard(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl p-5 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-100"
              onClick={e => e.stopPropagation()}
            >
              {/* FORM STEP */}
              {onboardStep === 'form' && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                        <Users className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Get Connected</h2>
                        <p className="text-sm text-slate-500">Submit your application</p>
                      </div>
                    </div>
                    <button onClick={() => setShowOnboard(false)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>

                  <form onSubmit={handleOnboardSubmit} className="space-y-4">
                    {/* Personal Info */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-sky-600" /> Personal Information
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">First Name</label>
                          <input type="text" required placeholder="John"
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Last Name</label>
                          <input type="text" required placeholder="Doe"
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm" />
                        </div>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-sky-600" /> Contact Details
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="email" required placeholder="john@example.com"
                              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="tel" required placeholder="+254 7XX XXX XXX"
                              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ID */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-sky-600" /> Identification
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">National ID Number</label>
                          <input type="text" required placeholder="Enter your ID number"
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Upload ID Document</label>
                          <input type="file" ref={idInputRef} onChange={e => setUploadedID(e.target.files?.[0] || null)} accept="image/*,.pdf" className="hidden" />
                          <div onClick={() => idInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${uploadedID ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-sky-300 hover:bg-sky-50'}`}>
                            {uploadedID ? (
                              <div className="flex items-center justify-center gap-3">
                                <FileText className="w-5 h-5 text-emerald-600" />
                                <div className="text-left">
                                  <p className="text-sm font-medium text-slate-800">{uploadedID.name}</p>
                                  <p className="text-xs text-slate-500">{(uploadedID.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <button type="button" onClick={e => { e.stopPropagation(); setUploadedID(null) }} className="p-1 rounded hover:bg-slate-200">
                                  <X className="w-4 h-4 text-slate-500" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm text-slate-600">Click to upload ID document</p>
                                <p className="text-xs text-slate-400">PNG, JPG or PDF up to 5MB</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Property */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Home className="w-4 h-4 text-sky-600" /> Property Details
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Property / Estate Name</label>
                          <input type="text" required placeholder="e.g. Westlands Heights"
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Unit / House Number</label>
                          <input type="text" required placeholder="e.g. 4A"
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm" />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setShowOnboard(false)}
                        className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">Cancel</button>
                      <button type="submit"
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />Submit Application
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* SUBMITTING */}
              {onboardStep === 'submitting' && (
                <div className="py-16 text-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-emerald-500" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Submitting your application...</h3>
                  <p className="text-slate-500 text-sm">This will only take a moment.</p>
                </div>
              )}

              {/* SUCCESS */}
              {onboardStep === 'success' && (
                <div className="py-10 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-emerald-600" />
                  </motion.div>

                  <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-slate-900 mb-3">Application Submitted!</motion.h3>
                  
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="p-5 rounded-2xl bg-sky-50 border border-sky-200 mb-6 text-left max-w-sm mx-auto">
                    <p className="text-sm text-slate-700 mb-3">We are processing your documents. Once verification is complete, we will:</p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-600">Email you a temporary password</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-600">You&apos;ll use it to log in and change your password</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-600">Full portal access to manage your water account</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-xl bg-white border border-sky-100 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-sky-500" />
                      <p className="text-sm text-slate-600">Estimated processing time: <span className="font-semibold text-sky-600">24–48 hours</span></p>
                    </div>
                  </motion.div>

                  <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    onClick={() => setShowOnboard(false)}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-blue-500 transition-all">
                    Done
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

