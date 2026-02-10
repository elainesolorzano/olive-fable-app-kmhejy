
# Universal Links Setup for Password Reset

This guide explains how to configure universal HTTPS links for password recovery in the Olive & Fable app.

## Overview

The app now uses **universal HTTPS links** instead of custom URL schemes for password reset. This provides a better user experience and works reliably across:
- ✅ Expo Go
- ✅ Development builds
- ✅ Production builds
- ✅ iOS and Android

## How It Works

1. User requests password reset via "Forgot Password" screen
2. Supabase sends email with link: `https://oliveandfable.com/reset-password?token_hash=...&type=recovery`
3. When user clicks the link:
   - **On mobile devices with the app installed**: The app opens directly (universal link)
   - **On devices without the app**: The link opens in browser (you can show a "Download App" page)
4. The app processes the token and shows the reset password screen
5. User enters new password and it's saved securely

## Configuration Steps

### 1. App Configuration (Already Done ✅)

The `app.json` has been updated with:

**iOS:**
```json
"ios": {
  "associatedDomains": [
    "applinks:oliveandfable.com"
  ]
}
```

**Android:**
```json
"android": {
  "intentFilters": [
    {
      "action": "VIEW",
      "autoVerify": true,
      "data": [
        {
          "scheme": "https",
          "host": "oliveandfable.com",
          "pathPrefix": "/reset-password"
        }
      ],
      "category": ["BROWSABLE", "DEFAULT"]
    }
  ]
}
```

### 2. Supabase Configuration (REQUIRED - Manual Step)

You **MUST** configure Supabase to allow the universal link as a redirect URL:

1. Go to your Supabase Dashboard
2. Navigate to **Authentication → URL Configuration**
3. Under **Redirect URLs**, add:
   ```
   https://oliveandfable.com/reset-password
   ```
4. Click **Save**

### 3. Domain Configuration (REQUIRED for Production)

For universal links to work in production, you need to host two files on your domain:

#### For iOS - Apple App Site Association (AASA)

Create a file at: `https://oliveandfable.com/.well-known/apple-app-site-association`

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.oliveandfable.studio",
        "paths": ["/reset-password"]
      }
    ]
  }
}
```

**Important:**
- Replace `TEAM_ID` with your Apple Developer Team ID
- This file must be served with `Content-Type: application/json`
- No `.json` extension in the filename
- Must be accessible via HTTPS

#### For Android - Digital Asset Links

Create a file at: `https://oliveandfable.com/.well-known/assetlinks.json`

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.oliveandfable.studio",
      "sha256_cert_fingerprints": [
        "YOUR_SHA256_FINGERPRINT_HERE"
      ]
    }
  }
]
```

**To get your SHA256 fingerprint:**

For debug builds:
```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

For production builds:
```bash
keytool -list -v -keystore your-release-key.keystore -alias your-key-alias
```

Copy the SHA256 fingerprint and add it to the `assetlinks.json` file.

### 4. Testing Universal Links

#### Testing in Expo Go

Universal links work in Expo Go! When you click the email link:
1. The link opens Expo Go
2. Expo Go opens your app
3. The app processes the password reset

#### Testing in Development Builds

1. Build a development build:
   ```bash
   eas build --profile development --platform ios
   eas build --profile development --platform android
   ```

2. Install the build on your device

3. Request a password reset email

4. Click the link in the email - the app should open directly

#### Testing in Production

Same as development builds, but use production builds:
```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

### 5. Fallback for Web/Desktop

If someone clicks the reset link on a device without the app installed, you should create a simple web page at `https://oliveandfable.com/reset-password` that:

1. Detects if the user is on mobile or desktop
2. Shows a "Download the App" button with links to App Store / Google Play
3. Optionally, you could implement web-based password reset as a fallback

Example HTML:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Reset Password - Olive & Fable</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>Reset Your Password</h1>
  <p>Please open this link in the Olive & Fable mobile app.</p>
  <p>Don't have the app yet?</p>
  <a href="https://apps.apple.com/app/your-app-id">Download for iOS</a>
  <a href="https://play.google.com/store/apps/details?id=com.oliveandfable.studio">Download for Android</a>
</body>
</html>
```

## Troubleshooting

### Universal Link Not Opening App

1. **Check domain files are accessible:**
   - Visit `https://oliveandfable.com/.well-known/apple-app-site-association`
   - Visit `https://oliveandfable.com/.well-known/assetlinks.json`
   - Both should return JSON (not 404)

2. **Verify Supabase redirect URL:**
   - Check Supabase Dashboard → Authentication → URL Configuration
   - Ensure `https://oliveandfable.com/reset-password` is listed

3. **iOS: Clear Universal Links Cache:**
   - Uninstall the app completely
   - Restart the device
   - Reinstall the app

4. **Android: Verify Digital Asset Links:**
   - Use Google's testing tool: https://developers.google.com/digital-asset-links/tools/generator
   - Enter your domain and package name
   - Verify the SHA256 fingerprint matches

### Link Opens Browser Instead of App

This is expected behavior if:
- The app is not installed
- The domain verification files are missing or incorrect
- You're testing in a simulator (use a real device)

### Token Expired Error

Password reset tokens expire after a certain time (default: 1 hour). If the user waits too long to click the link, they'll need to request a new one.

## Security Notes

1. **HTTPS Only:** Universal links only work with HTTPS, not HTTP
2. **Token Expiration:** Reset tokens expire automatically for security
3. **One-Time Use:** Each reset token can only be used once
4. **Session Cleanup:** After password reset, the user is signed out and must log in with the new password

## Support

If you encounter issues:
1. Check the console logs in the app (use `read_frontend_logs` tool)
2. Verify all configuration steps above
3. Test on a real device (not simulator) for accurate results
4. Ensure your domain's SSL certificate is valid

## Summary

✅ **What's Configured:**
- App deep link handling for `https://oliveandfable.com/reset-password`
- Supabase integration to send universal HTTPS links
- Token verification and session management
- User-friendly error handling

⚠️ **What You Need to Do:**
1. Add `https://oliveandfable.com/reset-password` to Supabase redirect URLs
2. Host `.well-known/apple-app-site-association` on your domain (for iOS)
3. Host `.well-known/assetlinks.json` on your domain (for Android)
4. Optionally create a web fallback page at `/reset-password`

Once these steps are complete, password reset will work seamlessly across all platforms! 🎉
