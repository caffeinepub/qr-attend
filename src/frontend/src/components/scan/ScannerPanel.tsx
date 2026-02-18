import { useQRScanner } from '../../qr-code/useQRScanner';
import { Button } from '../ui/button';
import { Camera, CameraOff, SwitchCamera, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface ScannerPanelProps {
  onScan: (data: string) => void;
}

export default function ScannerPanel({ onScan }: ScannerPanelProps) {
  const {
    qrResults,
    isScanning,
    isActive,
    isSupported,
    error,
    canStartScanning,
    startScanning,
    stopScanning,
    switchCamera,
    videoRef,
    canvasRef,
  } = useQRScanner({
    facingMode: 'environment',
    scanInterval: 100,
    maxResults: 1,
  });

  // Auto-handle first scan result
  if (qrResults.length > 0 && isScanning) {
    const latestResult = qrResults[0];
    onScan(latestResult.data);
    stopScanning();
  }

  if (isSupported === false) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Camera is not supported on this device</AlertDescription>
      </Alert>
    );
  }

  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          style={{ display: isActive ? 'block' : 'none' }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <CameraOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm opacity-75">Camera inactive</p>
            </div>
          </div>
        )}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-8 border-2 border-primary rounded-lg animate-pulse"></div>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        {!isActive ? (
          <Button onClick={startScanning} disabled={!canStartScanning} className="flex-1">
            <Camera className="w-4 h-4 mr-2" />
            Start Camera
          </Button>
        ) : (
          <>
            <Button onClick={stopScanning} variant="outline" className="flex-1">
              <CameraOff className="w-4 h-4 mr-2" />
              Stop
            </Button>
            {isMobile && (
              <Button onClick={switchCamera} variant="outline" size="icon">
                <SwitchCamera className="w-4 h-4" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
