import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/components/footer/component'
import { Fira_Mono } from 'next/font/google';

const font = Fira_Mono({ weight: ['400', '500', '700'], subsets: ['latin'] });

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
      <body className={`${font.className} antialiased`}>
        <div className='wrapper'>
          {children}
          <Footer />
        </div>
      </body>
    </html >
  )
}
