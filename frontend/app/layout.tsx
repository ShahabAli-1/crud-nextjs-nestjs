

import './globals.css'
import { ReactNode } from 'react'
import Providers from '../components/Providers' 

export const metadata = {
  title: 'Your App Title',
  description: 'Your App Description',
}

interface RootLayoutProps {
  children: ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
