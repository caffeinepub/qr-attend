import { useEffect } from 'react';
import { QrCode } from 'lucide-react';

export default function SplashPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-primary/5 via-background to-muted/20">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-6 animate-in fade-in duration-700">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary/10 mb-4">
            <QrCode className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight">QR Attend</h1>
          <p className="text-lg text-muted-foreground">Modern attendance tracking</p>
        </div>

        <div className="mt-12">
          <img
            src="/assets/generated/splash-illustration.dim_1080x1920.png"
            alt="QR Attend Illustration"
            className="w-64 h-auto mx-auto opacity-60"
          />
        </div>

        <div className="flex justify-center gap-2 mt-8">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150" />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300" />
        </div>
      </div>
    </div>
  );
}
