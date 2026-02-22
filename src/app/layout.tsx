import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Roamio — AI-Powered Medical & Travel Concierge for Kerala',
    template: '%s | Roamio',
  },
  description:
    'Roamio is an intelligent concierge platform for medical travel, tourism, and NRI visits to Kerala. Smart planning. Seamless coordination. Trusted execution.',
  keywords: ['Kerala medical tourism', 'AI concierge', 'NRI travel', 'Ayurveda Kerala', 'medical travel India'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_AE',
    siteName: 'Roamio',
    title: 'Roamio — AI-Powered Medical & Travel Concierge for Kerala',
    description: 'Smart planning. Seamless coordination. Trusted execution.',
  },
  alternates: {
    languages: {
      en: '/',
      ar: '/ar',
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="min-h-screen flex flex-col antialiased" style={{ fontFamily: 'var(--font-sans)' }}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
