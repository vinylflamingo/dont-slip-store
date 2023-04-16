import '../styles/globals.css';
import '../styles/fonts.css';
import ShopProvider from '../context/shopContext'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  return (
    <ShopProvider>
      <Component {...pageProps} key={router.asPath} />
    </ShopProvider>
  )
}

export default MyApp
