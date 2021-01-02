import "../styles/index.css";
import type { AppProps /*, AppContext */ } from 'next/app'

// This default export is required in a new `pages/_app.js` file.
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
