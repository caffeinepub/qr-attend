import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { QrCode } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoggingIn, isLoginError } = useInternetIdentity();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <QrCode className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">QR Attend</h1>
          <p className="text-muted-foreground">Modern attendance tracking with QR codes</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to access your attendance dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={login} disabled={isLoggingIn} className="w-full" size="lg">
              {isLoggingIn ? 'Signing in...' : 'Sign In'}
            </Button>
            {isLoginError && (
              <p className="mt-4 text-sm text-destructive text-center">Login failed. Please try again.</p>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <img
            src="/assets/generated/splash-illustration.dim_1080x1920.png"
            alt="QR Attend"
            className="w-48 h-auto mx-auto opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
