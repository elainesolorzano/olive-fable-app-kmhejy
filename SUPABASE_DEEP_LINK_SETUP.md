
# Supabase Deep Link Setup for Password Reset

## Problem
Password reset links were showing "Link expired" because the app was opening directly to the reset-password screen WITHOUT processing the authentication tokens first.

## Solution
ALL Supabase auth links (signup confirmation AND password reset) must go through the callback handler to establish the session before showing the reset password form.

## Configuration

### 1. Supabase Dashboard Settings

Go to: Authentication → URL Configuration

**Redirect URLs** (add both):
```
https://oliveandfable.com/appconfirmed
https://oliveandfable.com/reset-password
```

**Site URL**:
```
https://oliveandfable.com
```

### 2. Email Templates

Both signup confirmation and password reset emails should use:
```
{{ .ConfirmationURL }}
```

This URL will contain the tokens needed to establish the session.

### 3. Bridge Page Setup

On your Squarespace site (oliveandfable.com), create two pages:

#### /appconfirmed (for signup confirmation)
```html
<!DOCTYPE html>
<html>
<head>
    <title>Confirming...</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <h1>Confirming your email...</h1>
    <p>Opening Olive & Fable app...</p>
    <script>
        // Get the full URL with all parameters
        const fullUrl = window.location.href;
        console.log('Full URL:', fullUrl);
        
        // Encode the full URL and pass it to the app
        const appUrl = 'oliveandfable://auth?redirect=' + encodeURIComponent(fullUrl);
        console.log('Opening app with:', appUrl);
        
        // Try to open the app
        window.location.href = appUrl;
        
        // Fallback: Show App Store link after 2 seconds
        setTimeout(function() {
            document.body.innerHTML = '<h1>Don\'t have the app?</h1><p><a href="https://apps.apple.com/app/olive-fable">Download from App Store</a></p>';
        }, 2000);
    </script>
</body>
</html>
```

#### /reset-password (for password recovery)
```html
<!DOCTYPE html>
<html>
<head>
    <title>Resetting Password...</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <h1>Resetting your password...</h1>
    <p>Opening Olive & Fable app...</p>
    <script>
        // Get the full URL with all parameters
        const fullUrl = window.location.href;
        console.log('Full URL:', fullUrl);
        
        // Encode the full URL and pass it to the app
        const appUrl = 'oliveandfable://auth?redirect=' + encodeURIComponent(fullUrl);
        console.log('Opening app with:', appUrl);
        
        // Try to open the app
        window.location.href = appUrl;
        
        // Fallback: Show App Store link after 2 seconds
        setTimeout(function() {
            document.body.innerHTML = '<h1>Don\'t have the app?</h1><p><a href="https://apps.apple.com/app/olive-fable">Download from App Store</a></p>';
        }, 2000);
    </script>
</body>
</html>
```

### 4. How It Works

1. User clicks "Reset Password" in app
2. App calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://oliveandfable.com/reset-password' })`
3. Supabase sends email with link like: `https://oliveandfable.com/reset-password#access_token=...&refresh_token=...&type=recovery`
4. User clicks link in email → Opens Safari
5. Safari loads the bridge page at oliveandfable.com/reset-password
6. Bridge page JavaScript extracts the full URL (including tokens in hash)
7. Bridge page opens: `oliveandfable://auth?redirect=<ENCODED_URL_WITH_TOKENS>`
8. iOS shows "Open in Olive & Fable?" prompt
9. User taps "Open"
10. App opens and deep link listener in `app/_layout.tsx` catches it
11. Deep link listener navigates to `/(auth)/callback?url=<ENCODED_URL>`
12. Callback handler extracts tokens and calls `supabase.auth.setSession()` or `supabase.auth.verifyOtp()`
13. Session is established
14. Callback handler navigates to `/(auth)/reset-password`
15. Reset password screen checks for session → ✅ Session exists!
16. User can now enter new password

### 5. Testing

To test password reset:
1. Request password reset from app
2. Check email (including spam folder)
3. Click the reset link
4. Should see "Resetting your password..." page briefly
5. Should see "Open in Olive & Fable?" prompt
6. Tap "Open"
7. App should open and show the reset password form (NOT "Link expired")
8. Enter new password and save
9. Should see success message and redirect to login

### 6. Troubleshooting

If you see "Link expired":
- Check the console logs in the app (use `read_frontend_logs`)
- Look for "=== Auth Callback Handler Started ===" - if you don't see this, the callback handler was not triggered
- Check if the deep link listener in `app/_layout.tsx` is catching the URL
- Verify the bridge page is correctly encoding the full URL with tokens
- Make sure the app is installed and the custom scheme `oliveandfable://` is registered

Common issues:
- **Bridge page not encoding tokens**: The hash fragment (#access_token=...) must be included in the redirect parameter
- **App not catching deep link**: Check app.json scheme configuration
- **Session not being set**: Check callback.tsx logs for token extraction and setSession calls
- **Direct navigation to reset-password**: The app should NEVER navigate directly to /(auth)/reset-password without going through callback first
