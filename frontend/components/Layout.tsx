'use client'

import Link from 'next/link'
import React, { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">
                Home
              </Link>
              <Link href="/services" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">
                Services
              </Link>
              <Link href="/packages" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">
                Packages
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-4">
        {children}
      </main>
    </div>
  )
}

export default Layout
