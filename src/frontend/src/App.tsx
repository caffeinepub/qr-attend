import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from './hooks/useCurrentUser';
import LoginPage from './pages/LoginPage';
import SplashPage from './pages/SplashPage';
import RegistrationPage from './pages/RegistrationPage';
import DashboardPage from './pages/DashboardPage';
import ScanCheckInPage from './pages/ScanCheckInPage';
import AdminSessionsPage from './pages/admin/AdminSessionsPage';
import AttendanceHistoryPage from './pages/user/AttendanceHistoryPage';
import AdminAttendanceOverviewPage from './pages/admin/AdminAttendanceOverviewPage';
import DeliveryNotesPage from './pages/DeliveryNotesPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import AppLayout from './components/layout/AppLayout';
import { AdminRoute } from './components/auth/AdminRoute';
import { AuthGate } from './components/auth/AuthGate';
import { useEffect, useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';

// Root layout component with splash screen logic
function RootLayout() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [hasNavigated, setHasNavigated] = useState(false);

  const isAuthenticated = !!identity;

  useEffect(() => {
    // Check if splash has already been shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown === 'true') {
      setShowSplash(false);
      return;
    }

    // Wait for initial auth state to resolve
    if (isInitializing) return;

    // Show splash for minimum duration
    const timer = setTimeout(() => {
      sessionStorage.setItem('splashShown', 'true');
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isInitializing]);

  useEffect(() => {
    // Don't navigate while splash is showing or if already navigated
    if (showSplash || hasNavigated || isInitializing) return;

    // Not authenticated -> go to login
    if (!isAuthenticated) {
      navigate({ to: '/login' });
      setHasNavigated(true);
      return;
    }

    // Authenticated but profile not loaded yet
    if (profileLoading || !profileFetched) return;

    // No profile -> go to registration
    if (userProfile === null) {
      navigate({ to: '/register' });
      setHasNavigated(true);
      return;
    }

    // Has profile, check if on login/register page and redirect to dashboard
    const currentPath = window.location.pathname;
    if (currentPath === '/login' || currentPath === '/register') {
      navigate({ to: '/' });
      setHasNavigated(true);
    }
  }, [showSplash, isAuthenticated, userProfile, profileLoading, profileFetched, navigate, hasNavigated, isInitializing]);

  if (showSplash) {
    return <SplashPage />;
  }

  return <Outlet />;
}

// Root route with layout
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Public routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: () => (
    <AuthGate>
      <RegistrationPage />
    </AuthGate>
  ),
});

// Protected routes
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <AuthGate>
      <AppLayout>
        <DashboardPage />
      </AppLayout>
    </AuthGate>
  ),
});

const scanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/scan',
  component: () => (
    <AuthGate>
      <AppLayout>
        <ScanCheckInPage />
      </AppLayout>
    </AuthGate>
  ),
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: () => (
    <AuthGate>
      <AppLayout>
        <AttendanceHistoryPage />
      </AppLayout>
    </AuthGate>
  ),
});

const deliveryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/delivery',
  component: () => (
    <AuthGate>
      <AppLayout>
        <DeliveryNotesPage />
      </AppLayout>
    </AuthGate>
  ),
});

// Teacher-only routes (mapped to admin backend role)
const adminSessionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/sessions',
  component: () => (
    <AuthGate>
      <AdminRoute>
        <AppLayout>
          <AdminSessionsPage />
        </AppLayout>
      </AdminRoute>
    </AuthGate>
  ),
});

const adminOverviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/overview',
  component: () => (
    <AuthGate>
      <AdminRoute>
        <AppLayout>
          <AdminAttendanceOverviewPage />
        </AppLayout>
      </AdminRoute>
    </AuthGate>
  ),
});

const accessDeniedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/access-denied',
  component: () => (
    <AppLayout>
      <AccessDeniedPage />
    </AppLayout>
  ),
});

// Create router
const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  dashboardRoute,
  scanRoute,
  historyRoute,
  deliveryRoute,
  adminSessionsRoute,
  adminOverviewRoute,
  accessDeniedRoute,
]);

const router = createRouter({ routeTree });

// PWA Install Prompt Component
function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }

    setDeferredPrompt(null);
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-card border border-border rounded-lg shadow-lg p-4 flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm font-medium">Install QR Attend</p>
        <p className="text-xs text-muted-foreground">Add to home screen for quick access</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setShowInstallBanner(false)}
          className="px-3 py-1.5 text-xs rounded-md hover:bg-accent"
        >
          Later
        </button>
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Install
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <PWAInstallPrompt />
      <Toaster />
    </ThemeProvider>
  );
}
