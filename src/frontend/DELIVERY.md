# QR Attend - Delivery Notes

## Overview

QR Attend is delivered as a **Progressive Web App (PWA)** that can be installed on Android devices. This platform does not produce a pre-built downloadable APK file directly.

## Installing on Android

### Chrome Browser (Recommended)

1. Open QR Attend in Chrome browser on your Android device
2. Tap the menu (three dots) in the top right corner
3. Select "Add to Home screen" or "Install app"
4. Confirm the installation
5. The app will appear on your home screen and run like a native app

### Features

- ✓ Installable on Android home screen
- ✓ Runs in standalone mode (no browser UI)
- ✓ Offline support for app shell
- ✓ Camera access for QR code scanning
- ✓ Responsive design optimized for mobile

## Building a Standalone APK (Advanced)

If you need a downloadable APK file for distribution, you can wrap this PWA using Android Trusted Web Activity (TWA):

### Prerequisites

- The PWA must be deployed to a public HTTPS URL
- Android development environment (Android Studio or Gradle)
- A signing keystore for the APK

### Steps

1. **Deploy the PWA**
   - Deploy your application to a public URL with HTTPS
   - Ensure the web app manifest and service worker are accessible

2. **Use Bubblewrap CLI** (Recommended)
   ```bash
   npm install -g @bubblewrap/cli
   bubblewrap init --manifest https://your-app-url.com/manifest.json
   bubblewrap build
   ```

3. **Alternative: PWA Builder**
   - Visit [pwabuilder.com](https://www.pwabuilder.com)
   - Enter your PWA URL
   - Download the Android package
   - Build using Android Studio

4. **Configure TWA Settings**
   - Set your PWA URL as the launch URL
   - Configure app name, icons, and theme colors
   - Set up Digital Asset Links for domain verification

5. **Build and Sign**
   - Build the Android project using Gradle or Android Studio
   - Sign the APK with your keystore
   - The resulting APK can be distributed or uploaded to Google Play Store

### Important Notes

- TWA apps require the target URL to be served over HTTPS
- The PWA must have a valid web app manifest (already included)
- Digital Asset Links must be configured for production apps
- The APK will essentially be a wrapper that loads your PWA

## Technical Details

### PWA Components Included

- **Web App Manifest** (`/manifest.json`): Defines app metadata, icons, and display mode
- **Service Worker** (`/sw.js`): Provides offline support and caching
- **App Icons**: 512x512 standard and maskable icons for Android
- **Theme Colors**: Configured for Android status bar integration

### Offline Behavior

- The app shell (HTML, CSS, JS) is cached and loads offline
- Data operations require an internet connection
- Users see appropriate offline messages when network is unavailable

## Support

For issues or questions about installation or APK building, please refer to:
- [PWA Builder Documentation](https://docs.pwabuilder.com/)
- [Bubblewrap Documentation](https://github.com/GoogleChromeLabs/bubblewrap)
- [Android TWA Guide](https://developer.chrome.com/docs/android/trusted-web-activity/)
