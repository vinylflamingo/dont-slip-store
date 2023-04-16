import React from 'react'
export default function Layout({ children }) {
  return (
    <div className='flex flex-col justify-between min-h-screen'>
      <main>
        {children}
      </main>

      <footer>
        Footer
      </footer>

    </div>
  )
}
