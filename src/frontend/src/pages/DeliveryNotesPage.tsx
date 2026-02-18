import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Smartphone, Download, Globe, Info } from 'lucide-react';

export default function DeliveryNotesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Delivery Notes</h1>
        <p className="text-muted-foreground">Installation and APK build instructions</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          QR Attend is delivered as a Progressive Web App (PWA) that can be installed on Android devices. This platform
          does not produce a pre-built APK file.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-primary" />
            <div>
              <CardTitle>Installing on Android</CardTitle>
              <CardDescription>Add QR Attend to your home screen</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Chrome (Recommended)</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Open QR Attend in Chrome browser</li>
              <li>Tap the menu (three dots) in the top right</li>
              <li>Select "Add to Home screen" or "Install app"</li>
              <li>Confirm the installation</li>
              <li>The app will appear on your home screen like a native app</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Download className="w-6 h-6 text-primary" />
            <div>
              <CardTitle>Building an APK (Advanced)</CardTitle>
              <CardDescription>For developers who need a standalone APK</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To create a downloadable APK from this PWA, you can use Android Trusted Web Activity (TWA) wrapper:
          </p>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                Deploy your PWA to a public URL (the app must be accessible via HTTPS)
              </li>
              <li>
                Use Bubblewrap CLI or PWA Builder to generate an Android project:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Bubblewrap: <code className="text-xs bg-muted px-1 py-0.5 rounded">npm install -g @bubblewrap/cli</code></li>
                  <li>PWA Builder: Visit <a href="https://www.pwabuilder.com" className="text-primary hover:underline">pwabuilder.com</a></li>
                </ul>
              </li>
              <li>Configure the TWA with your PWA URL and app details (name, icons, theme colors)</li>
              <li>Build the Android project using Android Studio or Gradle</li>
              <li>Sign the APK with your keystore</li>
              <li>The resulting APK can be distributed or uploaded to Google Play Store</li>
            </ol>
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Note: TWA apps require the target URL to be served over HTTPS and have a valid web app manifest. This PWA
              already includes the necessary manifest and service worker.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-primary" />
            <div>
              <CardTitle>PWA Features</CardTitle>
              <CardDescription>What you get with this Progressive Web App</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Installable on Android home screen</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Runs in standalone mode (no browser UI)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Offline support for app shell (UI loads without internet)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Camera access for QR code scanning</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Responsive design optimized for mobile</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
