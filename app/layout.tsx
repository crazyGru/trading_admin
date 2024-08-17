'use client';

import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Toaster } from "@/components/ui/toaster"
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { logout } from './services/api'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)

    if (!token && pathname !== '/login' && pathname !== '/signup') {
      router.push('/login')
    }
  }, [pathname])

  const handleLogout = async () => {
    try {
      await logout()
      setIsLoggedIn(false)
      localStorage.removeItem('token')
      router.push('/login')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  if (!isLoggedIn && pathname !== '/login' && pathname !== '/signup') {
    return null // Don't render anything while redirecting
  }
  
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col w-full h-screen bg-gray-900 text-gray-100 overflow-hidden`}>
        <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-400">TradingV2</Link>
            <ul className="flex space-x-6">
              {isLoggedIn ? (
                <>
                  <li><Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link></li>
                  <li><button onClick={handleLogout} className="hover:text-blue-400 transition-colors">Logout</button></li>
                </>
              ) : (
                <>
                  <li><Link href="/login" className="hover:text-blue-400 transition-colors">Login</Link></li>
                  <li><Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">Sign Up</Link></li>
                </>
              )}
            </ul>
          </div>
        </nav>
        <main className="flex-grow overflow-hidden">
          <div className="h-full overflow-auto p-6">
            {children}
          </div>
        </main>

        <footer className="bg-gray-800 py-4 text-center text-gray-400 text-sm">
          <p>&copy; 2023 TradingV2. All rights reserved.</p>
        </footer>
        <Toaster />
      </body>
    </html>
  )
}