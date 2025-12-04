import '../styles/globals.css';
import '../styles/fonts.css';
import ShopProvider from '../context/shopContext'
import { useRouter } from 'next/router'
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  return (
    <>
    <Head>
      <title>DSJD</title>
    </Head>
      <ShopProvider>
        <Component {...pageProps} key={router.asPath} />
      </ShopProvider>
      <Analytics />
    </>
  )
}

export default MyApp
