
# Gmail-Safe Password Reset Setup Guide

This document explains how the password reset flow works with Gmail-safe universal HTTPS links.

## Overview

The password reset flow uses a **universal HTTPS link** (`https://oliveandfable.com/reset-password`) that:
1. Works reliably in Gmail and other email clients
2. Opens the app directly (not a browser)
3. Completes the entire reset flow in-app

## Flow Diagram

```
User requests reset
    ↓
Supabase sends email with link:
https://oliveandfable.com/reset-password#token_hash=...&type=recovery
    ↓
User clicks link in Gmail
    ↓
iOS/Android intercepts link (universal link)
    ↓
App opens → app/_layout.tsx detects deep link
    ↓
Navigates to app/(auth)/callback.tsx
    ↓
Callback extracts token_hash and exchanges for session
    ↓
Navigates to app/(auth)/reset-password.tsx
    ↓
User enters new password
    ↓
Calls supabase.auth.updateUser({ password })
    ↓
Success → Sign out → Redirect to login
```

## Configuration

### 1. Supabase Dashboard

**Redirect URLs:**
Add these to your Supabase project settings (Authentication → URL Configuration):

```
https://oliveandfable.com/reset-password
oliveandfable://*
```

**Email Templates:**
Ensure your password recovery email template uses:
```
{{ .ConfirmationURL }}
```

This ensures Supabase respects the `redirectTo` parameter.

### 2. App Configuration (app.json)

**iOS Universal Links:**
```json
{
  "ios": {
    "associatedDomains": [
      "applinks:oliveandfable.com"
    ]
  }
}
```

**Android App Links:**
```json
{
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
}
```

### 3. Domain Verification Files

For production, you must host these files on `oliveandfable.com`:

**iOS (/.well-known/apple-app-site-association):**
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

**Android (/.well-known/assetlinks.json):**
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.oliveandfable.studio",
      "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
    }
  }
]
```

## Code Implementation

### 1. Forgot Password Screen (app/(auth)/forgot-password.tsx)

```typescript
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: 'https://oliveandfable.com/reset-password',
});
```

**Key Points:**
- Uses HTTPS URL (not custom scheme)
- Gmail and other email clients handle HTTPS links reliably
- Universal link configuration ensures app opens instead of browser

### 2. Deep Link Handler (app/_layout.tsx)

```typescript
// Detects https://oliveandfable.com/reset-password
if (urlObj.hostname === 'oliveandfable.com' && urlObj.pathname === '/reset-password') {
  // Extract token_hash from query params OR hash fragment
  let tokenHash = urlObj.searchParams.get('token_hash');
  
  // Supabase often uses hash fragment
  if (!tokenHash && urlObj.hash) {
    const hashParams = new URLSearchParams(urlObj.hash.substring(1));
    tokenHash = hashParams.get('token_hash');
  }
  
  // Navigate to callback handler
  router.push(`/(auth)/callback?token_hash=${tokenHash}&type=recovery&flow=recovery`);
}
```

**Key Points:**
- Checks both query params AND hash fragment (Supabase uses hash)
- Extracts `token_hash` and `type` parameters
- Routes to callback handler with recovery flow

### 3. Callback Handler (app/(auth)/callback.tsx)

```typescript
if (flow === 'recovery' || type === 'recovery') {
  if (tokenHash) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'recovery',
    });
    
    if (data.session) {
      // Session established, navigate to reset password screen
      router.replace('/(auth)/reset-password');
    } else {
      // Token expired or invalid
      router.replace('/(auth)/reset-password?expired=true');
    }
  }
}
```

**Key Points:**
- Exchanges `token_hash` for a valid Supabase session
- Handles expired/invalid tokens gracefully
- Navigates to reset password screen on success

### 4. Reset Password Screen (app/(auth)/reset-password.tsx)

```typescript
// Validate session exists
const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  // Show expired link error
  setError({ title: 'Link expired', body: '...' });
  return;
}

// User enters new password
await supabase.auth.updateUser({ password: newPassword });

// Sign out for security
await supabase.auth.signOut();

// Redirect to login
router.replace('/(auth)/login');
```

**Key Points:**
- Validates recovery session exists
- Allows user to set new password
- Signs out after password change (security best practice)
- Redirects to login screen

## Testing

### Development Testing (Expo Go)

1. Request password reset with your email
2. Check email for reset link
3. Click link in email client
4. App should open and navigate to reset password screen
5. Enter new password and confirm
6. Should redirect to login screen

### Production Testing

1. Build production app with EAS Build
2. Install on physical device
3. Request password reset
4. Click link in Gmail app
5. Verify app opens (not browser)
6. Complete password reset flow

## Troubleshooting

### Link Opens Browser Instead of App

**Cause:** Universal link configuration not set up correctly

**Fix:**
1. Verify `associatedDomains` in app.json (iOS)
2. Verify `intentFilters` with `autoVerify: true` in app.json (Android)
3. Host verification files on `oliveandfable.com`
4. Rebuild app with EAS Build

### Token Hash Not Found

**Cause:** Supabase sends token in hash fragment, not query params

**Fix:**
- Code already handles both query params AND hash fragment
- Check console logs to see where token is located

### Session Not Established

**Cause:** Token expired or invalid

**Fix:**
- Tokens expire after 1 hour
- User must request a new reset link
- App shows friendly error message

### Gmail Link Doesn't Work

**Cause:** Gmail requires HTTPS links for reliable handling

**Fix:**
- Already using HTTPS (`https://oliveandfable.com/reset-password`)
- Custom schemes (`oliveandfable://`) don't work reliably in Gmail
- Universal HTTPS links are the solution

## Security Considerations

1. **Token Expiration:** Reset tokens expire after 1 hour
2. **One-Time Use:** Tokens can only be used once
3. **Session Cleanup:** User is signed out after password change
4. **HTTPS Only:** All links use HTTPS for security
5. **No Browser Redirect:** Entire flow happens in-app

## Why Universal HTTPS Links?

**Problem with Custom Schemes:**
- Gmail and other email clients don't reliably handle custom schemes (`oliveandfable://`)
- Links may open in browser or fail to open app
- Inconsistent behavior across email clients

**Solution with Universal HTTPS Links:**
- HTTPS links work reliably in all email clients
- iOS/Android intercept the link and open the app
- No browser redirect needed
- Better user experience

## Summary

The password reset flow uses:
1. **HTTPS redirect URL** in `resetPasswordForEmail`
2. **Universal link configuration** in app.json
3. **Deep link handler** in app/_layout.tsx
4. **Callback handler** to exchange token for session
5. **Reset password screen** to update password

This ensures a seamless, Gmail-safe password reset experience entirely within the app.
