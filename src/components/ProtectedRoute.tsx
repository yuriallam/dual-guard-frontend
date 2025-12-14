import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * ProtectedRoute component that handles authentication-based routing
 * 
 * @param children - The component to render if access is granted
 * @param requireAuth - If true, requires user to be authenticated (default: true)
 * @param redirectTo - Where to redirect if access is denied (default: '/signin')
 */
export function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = '/signin',
}: ProtectedRouteProps) {
  const { isSignedIn, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is required but user is not signed in, redirect to login
  if (requireAuth && !isSignedIn) {
    // Save the location they were trying to access
    return (
      <Navigate to={redirectTo} state={{ from: location }} replace />
    );
  }

  // If auth is not required but user is signed in, you might want to redirect
  // For example, redirect logged-in users away from login/signup pages
  if (!requireAuth && isSignedIn) {
    // Optional: redirect authenticated users away from auth pages
    // return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

