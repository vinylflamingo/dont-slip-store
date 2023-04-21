import '../styles/globals.css';
import '../styles/fonts.css';
import ShopProvider from '../context/shopContext'
import { useRouter } from 'next/router'
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  return (
    <>
      <ShopProvider>
        <Component {...pageProps} key={router.asPath} />
      </ShopProvider>
      <Analytics />
    </>
  )
}

export default MyApp
