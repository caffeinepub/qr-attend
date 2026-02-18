# QR Attend - Delivery Notes

## Overview

QR Attend is delivered as a **Progressive Web App (PWA)** that can be installed on Android devices. **This platform produces a web/PWA build, not a pre-built downloadable APK file.** To create an Android APK, you must use external tools after deploying your app.

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

If you need a downloadable APK file for distribution, you can wrap this PWA using Android Trusted Web Activity (TWA).

### Prerequisites

⚠️ **Important:** The PWA must be deployed to a public HTTPS URL before you can generate a TWA APK. The APK will load your deployed web app, not a local build.

- Android development environment (Android Studio or Gradle)
- A signing keystore for the APK

### Option 1: Bubblewrap CLI (Recommended)

