import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, QrCode, History, Settings, BarChart3, Package } from 'lucide-react';
import { useIsCallerAdmin } from '../../hooks/useCurrentUser';

export default function BottomNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { data: isTeacher } = useIsCallerAdmin();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/scan', icon: QrCode, label: 'Scan' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/delivery', icon: Package, label: 'Delivery' },
    ...(isTeacher
      ? [
          { path: '/admin/sessions', icon: Settings, label: 'Sessions' },
          { path: '/admin/overview', icon: BarChart3, label: 'Overview' },
        ]
      : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="container max-w-2xl mx-auto">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate({ to: item.path })}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
