import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/components/footer/component'
import { Lusitana } from 'next/font/google';

const lusitana = Lusitana({ subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
  title: 'Davi Stocco',
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
      <body className={`${lusitana.className} antialiased`}>
        <div className='wrapper'>
          {children}
          <Footer />
        </div>
      </body>
    </html >
  )
}
