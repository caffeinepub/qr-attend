import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import ScannerPanel from '../components/scan/ScannerPanel';
import ManualEntryPanel from '../components/scan/ManualEntryPanel';
import CheckInResultCard from '../components/scan/CheckInResultCard';
import { useGetAllSessions, useCheckIn } from '../hooks/useQueries';
import { toast } from 'sonner';

type ResultState = {
  status: 'success' | 'error' | 'invalid';
  message: string;
  sessionName?: string;
} | null;

export default function ScanCheckInPage() {
  const [result, setResult] = useState<ResultState>(null);
  const { data: sessions } = useGetAllSessions();
  const checkIn = useCheckIn();

  const handleScan = async (scannedData: string) => {
    if (!scannedData.startsWith('QR-')) {
      setResult({
        status: 'invalid',
        message: 'This QR code is not valid for attendance check-in',
      });
      return;
    }

    // Find matching session
    const sessionIdStr = scannedData.replace('QR-', '');
    const sessionId = BigInt(sessionIdStr);
    const session = sessions?.find((s) => s.id === sessionId);

    if (!session) {
      setResult({
        status: 'invalid',
        message: 'Session not found. The QR code may be expired or invalid.',
      });
      return;
    }

    // Check if session is active
    const now = BigInt(Date.now()) * BigInt(1_000_000);
    if (now < session.startTime) {
      setResult({
        status: 'error',
        message: 'This session has not started yet',
        sessionName: session.name,
      });
      return;
    }

    if (now > session.endTime) {
      setResult({
        status: 'error',
        message: 'This session has ended',
        sessionName: session.name,
      });
      return;
    }

    // Attempt check-in
    try {
      await checkIn.mutateAsync({ sessionId, scannedData });
      setResult({
        status: 'success',
        message: 'You have been successfully checked in',
        sessionName: session.name,
      });
      toast.success('Check-in successful');
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error';
      setResult({
        status: 'error',
        message: errorMessage,
        sessionName: session.name,
      });
      toast.error('Check-in failed');
    }
  };

  const handleRetry = () => {
    setResult(null);
  };

  if (result) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Check-in Result</h1>
          <p className="text-muted-foreground">Scan result</p>
        </div>
        <CheckInResultCard
          status={result.status}
          message={result.message}
          sessionName={result.sessionName}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Scan QR Code</h1>
        <p className="text-muted-foreground">Check in to a session</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Camera Scanner</CardTitle>
          <CardDescription>Point your camera at the QR code</CardDescription>
        </CardHeader>
        <CardContent>
          <ScannerPanel onScan={handleScan} />
        </CardContent>
      </Card>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manual Entry</CardTitle>
          <CardDescription>Enter the QR code manually</CardDescription>
        </CardHeader>
        <CardContent>
          <ManualEntryPanel onSubmit={handleScan} disabled={checkIn.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
