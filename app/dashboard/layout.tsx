'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  const getRole = (): 'admin' | 'staff' | 'tenant' => {
    if (pathname.includes('/admin')) return 'admin'
    if (pathname.includes('/staff')) return 'staff'
    return 'tenant'
  }

  const role = getRole()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar role={role} />
      <main className="lg:ml-[280px] min-h-screen transition-all duration-300">
        <div className="min-h-screen pb-20 lg:pb-0">
          {children}
        </div>
      </main>
      
      {/* Mobile Bottom Navigation */}
      <MobileNav role={role} />
    </div>
  )
}