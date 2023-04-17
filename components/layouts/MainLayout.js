import React from 'react'
export default function MainLayout({ children }) {
  return (
    <html>
      <main>
        <div className='flex flex-col justify-between min-h-screen'>
          {children}
        </div>
      </main>

      <footer>
      </footer>
    </html>
  )
}
