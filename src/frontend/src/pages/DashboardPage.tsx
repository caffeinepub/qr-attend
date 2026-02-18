import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useCurrentUser';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { QrCode, History, Settings, BarChart3, LogOut, FileText } from 'lucide-react';

export default function DashboardPage() {
  const { clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isTeacher } = useIsCallerAdmin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {userProfile?.name || 'User'}</p>
        </div>
        <Button variant="outline" size="icon" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid gap-4">
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate({ to: '/scan' })}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <QrCode className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Scan QR Code</CardTitle>
                <CardDescription>Check in to a session</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => navigate({ to: '/history' })}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <History className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>My Attendance</CardTitle>
                <CardDescription>View your check-in history</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {isTeacher && (
          <>
            <Card
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate({ to: '/admin/sessions' })}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Manage Sessions</CardTitle>
                    <CardDescription>Create and view attendance sessions</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate({ to: '/admin/overview' })}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Attendance Overview</CardTitle>
                    <CardDescription>View all attendance records</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </>
        )}

        <Card
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => navigate({ to: '/delivery' })}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Delivery Notes</CardTitle>
                <CardDescription>Installation and APK build instructions</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
