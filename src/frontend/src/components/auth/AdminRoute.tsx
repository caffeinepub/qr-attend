import { useIsCallerAdmin } from '../../hooks/useCurrentUser';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { data: isTeacher, isLoading } = useIsCallerAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isTeacher) {
      navigate({ to: '/access-denied' });
    }
  }, [isTeacher, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  if (!isTeacher) {
    return null;
  }

  return <>{children}</>;
}
