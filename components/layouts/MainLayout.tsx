import React, { ReactNode } from 'react'
import Nav from '../controls/Nav'
import Footer from '../controls/Footer'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className='flex flex-col min-h-screen min-w-[97%] bg-white items-center mx-1 md:max-w-[1666px] justify-between'>
      <Nav />
      <main className='w-full'>
        <div>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
