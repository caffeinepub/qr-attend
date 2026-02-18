import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Smartphone, Download, Globe, Info, Copy } from 'lucide-react';
import { useState } from 'react';

export default function DeliveryNotesPage() {
  const [copied, setCopied] = useState(false);

  const bubblewrapCommands = `# Install Bubblewrap CLI globally
npm install -g @bubblewrap/cli

# Initialize TWA project with your deployed PWA URL
bubblewrap init --manifest https://your-app-url.com/manifest.json

# Build the Android APK
bubblewrap build`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bubblewrapCommands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Delivery Notes</h1>
        <p className="text-muted-foreground">Installation and APK build instructions</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> This platform produces a Progressive Web App (PWA) build, not a pre-built
          downloadable APK file. To create an Android APK, you must use external tools like Bubblewrap or PWA Builder
          after deploying your app to a public HTTPS URL.
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
          <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong>Prerequisite:</strong> Your app must be deployed to a public HTTPS URL before you can generate a
              TWA APK. The APK will load your deployed web app, not a local build.
            </AlertDescription>
          </Alert>

          <p className="text-sm text-muted-foreground">
            To create a downloadable APK from this PWA, use Android Trusted Web Activity (TWA) wrapper tools:
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Option 1: Bubblewrap CLI (Recommended)</h3>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                  <code>{bubblewrapCommands}</code>
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-2 bg-background border border-border rounded hover:bg-accent transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <span className="text-xs text-green-600 dark:text-green-400">Copied!</span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Replace <code className="bg-muted px-1 py-0.5 rounded">https://your-app-url.com</code> with your actual
                deployed PWA URL.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Option 2: PWA Builder (No-Code)</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>
                  Visit{' '}
                  <a
                    href="https://www.pwabuilder.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    pwabuilder.com
                  </a>
                </li>
                <li>Enter your deployed PWA URL</li>
                <li>Click "Package for Stores" and select Android</li>
                <li>Download the generated Android package</li>
                <li>Build and sign using Android Studio</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm">General Steps:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Deploy your PWA to a public HTTPS URL</li>
                <li>Use Bubblewrap CLI or PWA Builder to generate an Android project</li>
                <li>Configure the TWA with your PWA URL and app details (name, icons, theme colors)</li>
                <li>Build the Android project using Android Studio or Gradle</li>
                <li>Sign the APK with your keystore</li>
                <li>The resulting APK can be distributed or uploaded to Google Play Store</li>
              </ol>
            </div>
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
