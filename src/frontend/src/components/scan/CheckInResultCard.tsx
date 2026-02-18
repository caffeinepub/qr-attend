import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface CheckInResultCardProps {
  status: 'success' | 'error' | 'invalid';
  message: string;
  sessionName?: string;
  onRetry: () => void;
}

export default function CheckInResultCard({ status, message, sessionName, onRetry }: CheckInResultCardProps) {
  const icons = {
    success: <CheckCircle2 className="w-12 h-12 text-green-500" />,
    error: <XCircle className="w-12 h-12 text-destructive" />,
    invalid: <AlertCircle className="w-12 h-12 text-yellow-500" />,
  };

  const titles = {
    success: 'Check-in Successful',
    error: 'Check-in Failed',
    invalid: 'Invalid QR Code',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{titles[status]}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center text-center">
          {icons[status]}
          {sessionName && <p className="mt-4 font-medium">{sessionName}</p>}
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        </div>
        <Button onClick={onRetry} className="w-full">
          Scan Another Code
        </Button>
      </CardContent>
    </Card>
  );
}
