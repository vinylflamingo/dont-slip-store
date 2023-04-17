import React from 'react'
import Nav from '../controls/Nav'
import Footer from '../controls/Footer'
export default function MainLayout({ children }) {
  return (
    <div className='flex flex-col min-h-screen min-w-[97%] bg-white items-center mx-1 md:max-w-[1666px] justify-between'>
      <Nav />
      <main className='mt-10 w-full'>
        <div>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
