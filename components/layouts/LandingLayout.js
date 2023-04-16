import React from 'react'
export default function LandingLayout({ children }) {
    return (
        <div className='flex flex-col justify-between min-h-screen bg-black'>
            <link href="../styles/globals.csss" rel="stylesheet"></link>

            <main className='flex flex-col justify-center items-center'>
                {children}
            </main>
            <footer>
            </footer>

        </div>
    )
}
