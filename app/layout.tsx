import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/footer/component'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Davi Stocco',
  description: 'Site do Davi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      <Footer/>
      </body>
    </html>
  )
}
