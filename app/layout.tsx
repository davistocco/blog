import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/components/footer/component'
import { cookies } from 'next/headers';
import LayoutContainer from '@/components/layout-container/component';

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
    <html lang='en'>
      <body>
        <LayoutContainer initialTheme={theme?.value}>
          {children}
          <Footer />
        </LayoutContainer>
      </body>
    </html>
  )
}
