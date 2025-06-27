import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GenreProvider } from "@/components/GenreContext";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  return (
    <GenreProvider>
      <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </GenreProvider>
  );
}
