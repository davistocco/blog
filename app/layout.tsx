import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/components/footer/component'
import { cookies } from 'next/headers';
import Layout from '@/components/layout/component';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Davi Stocco',
  description: 'Site do Davi',
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies();
  const theme = cookieStore.get('theme');

  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout initialTheme={theme?.value}>
          {children}
          <Footer />
        </Layout>
      </body>
    </html>
  )
}
