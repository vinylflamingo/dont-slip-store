import React, { ReactNode } from 'react'

interface LandingLayoutProps {
    children: ReactNode
}

export default function LandingLayout({ children }: LandingLayoutProps) {
    return (
        <div className='flex flex-col justify-center items-center h-screen bg-black'>
            <main className='flex flex-col justify-center items-center'>
                {children}
            </main>
            <footer>
            </footer>

        </div>
    )
}
