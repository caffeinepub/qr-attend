import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ShieldAlert } from 'lucide-react';

export default function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">You don't have permission to view this page</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col items-center text-center">
            <ShieldAlert className="w-12 h-12 text-destructive mb-4" />
            <CardTitle>Teacher Access Required</CardTitle>
            <CardDescription className="mt-2">
              This page is only accessible to teachers. If you believe you should have access, please contact your administrator.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate({ to: '/' })} className="w-full">
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
