import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AquaFlow | Smart Water Solutions for Nairobi',
  description: 'AquaFlow provides reliable, smart water supply and billing services across Nairobi. Monitor usage, pay bills, and manage your water account online.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}