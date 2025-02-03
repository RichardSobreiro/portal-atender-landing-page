import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ComponentWithAuth = (props: P) => {
    const router = useRouter();
    const { user } = useAuth();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
      if (user === null) {
        setIsCheckingAuth(false);
      } else if (!user) {
        router.replace('/entrar'); // Redirect if user is not authenticated
      } else {
        setIsCheckingAuth(false);
      }
    }, [user, router]);

    if (isCheckingAuth) return null; // Prevent flickering while checking auth

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default withAuth;
