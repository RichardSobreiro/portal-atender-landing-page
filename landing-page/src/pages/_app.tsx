import Spinner from '@/components/Spinner';
import { AuthProvider } from '@/context/AuthContext';
import { DeviceProvider } from '@/context/DeviceContext';
import { SpinnerProvider, useSpinner } from '@/context/SpinnerContext ';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

function AppContent({ Component, pageProps, router }: AppProps) {
  const { isLoading } = useSpinner();

  return (
    <>
      {isLoading && <Spinner />}
      <Component {...pageProps} router={router} />
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
