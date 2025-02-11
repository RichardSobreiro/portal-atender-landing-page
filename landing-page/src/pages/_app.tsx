import Spinner from '@/components/Spinner';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DeviceProvider } from '@/context/DeviceContext';
import { SpinnerProvider, useSpinner } from '@/context/SpinnerContext';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { MantineProvider, createTheme } from '@mantine/core';

// ✅ Define an optimized Mantine Theme
const theme = createTheme({
  fontFamily: 'Inter, sans-serif',
  headings: { fontFamily: 'Inter, sans-serif' },
  components: {
    RichTextEditor: {
      defaultProps: {
        size: 'sm', // ✅ Reduced button size for better spacing
        radius: 'xs', // ✅ Smaller rounded corners
      },
      styles: {
        toolbar: {
          minHeight: '42px', // ✅ Slightly smaller toolbar height
          padding: '5px',
          backgroundColor: '#f8f9fa', // ✅ Light background for contrast
          borderBottom: '1px solid #ddd',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        },
        control: {
          width: '32px', // ✅ Optimized button width
          height: '32px', // ✅ Optimized button height
          fontSize: '16px', // ✅ Reduced icon size for balance
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '5px',
        },
        icon: {
          width: '18px',
          height: '18px',
        },
      },
    },
  },
});

function AppContent({ Component, pageProps, router }: AppProps) {
  const { isLoading } = useSpinner();
  const { user } = useAuth();
  const publicPages = ['/entrar', '/cadastro', '/'];

  useEffect(() => {
    if (user && publicPages.includes(router.pathname)) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  return (
    <MantineProvider theme={theme}>
      {isLoading && <Spinner />}
      <Component {...pageProps} router={router} />
    </MantineProvider>
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
