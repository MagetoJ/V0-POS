'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log('ProtectedLayout: isLoading=', isLoading, 'isAuthenticated=', isAuthenticated, 'pathname=', pathname);
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log('ProtectedLayout: Not authenticated, redirecting to login');
        router.push('/'); // Redirect to login if not authenticated
      } else if (user) {
        console.log('ProtectedLayout: Authenticated as', user.role);
        // Standardized redirection map based on live database roles
        const roleRoutes: Record<string, string> = {
          admin: '/dashboard',
          manager: '/dashboard',
          kitchen_staff: '/kitchen',
          receptionist: '/rooms',
          accountant: '/accounting',
          cashier: '/quick-pos',
          waiter: '/pos'
        };

        const targetRoute = roleRoutes[user.role];
        console.log('ProtectedLayout: targetRoute=', targetRoute);
        if (targetRoute && pathname !== targetRoute && (pathname === '/' || pathname === '/dashboard')) {
          console.log('ProtectedLayout: Redirecting from', pathname, 'to', targetRoute);
          router.push(targetRoute);
        }
      }
    }
  }, [isAuthenticated, isLoading, router, user, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
