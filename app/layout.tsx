import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/components/footer/component'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: {
    template: '%s | Davi Stocco',
    default: 'Davi Stocco'
  },
  description: 'Site do Davi',
}

// TODO: internationalization
// TODO: prettier

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className='wrapper'>
          {children}
          <Footer />
          <Analytics />
        </div>
      </body>
    </html>
  )
}
