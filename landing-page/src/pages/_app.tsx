import Spinner from '@/components/Spinner';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DeviceProvider } from '@/context/DeviceContext';
import { SpinnerProvider, useSpinner } from '@/context/SpinnerContext';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function AppContent({ Component, pageProps, router }: AppProps) {
  const { isLoading } = useSpinner();
  const { user } = useAuth();
  const publicPages = ['/entrar', '/cadastro', '/']; // Pages that should NOT be accessed when logged in

  useEffect(() => {
    if (user && publicPages.includes(router.pathname)) {
      router.replace('/dashboard'); // Redirect to a protected area if logged in
    }
  }, [user, router]);

  return (
    <>
      {isLoading && <Spinner />}
      <Component {...pageProps} router={router} />
      <ToastContainer />
    </>
  );
}

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <SpinnerProvider>
      <DeviceProvider>
        <AuthProvider>
          <AppContent
            Component={Component}
            pageProps={pageProps}
            router={router}
          />
        </AuthProvider>
      </DeviceProvider>
    </SpinnerProvider>
  );
}
