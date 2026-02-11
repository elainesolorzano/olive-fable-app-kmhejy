
# Password Reset "Link Expired" Troubleshooting Guide

## Symptoms
User clicks password reset link from email → App opens → Shows "Link expired" error

## Root Cause Analysis

The "Link expired" error occurs when the reset-password screen loads WITHOUT an active Supabase session. This happens when:

1. **The callback handler is not triggered** - The app opens directly to reset-password screen
2. **Tokens are not being passed** - The deep link doesn't contain the auth tokens
3. **Session is not being established** - The callback handler fails to call setSession/verifyOtp

## Diagnostic Steps

### Step 1: Check Email Link Format

When you receive the password reset email, the link should look like:
```
https://oliveandfable.com/reset-password#access_token=...&refresh_token=...&type=recovery
```

OR (for PKCE flow):
```
https://oliveandfable.com/reset-password?code=...&type=recovery
```

OR (for token_hash flow):
```
https://oliveandfable.com/reset-password?token_hash=...&type=recovery
```

**Action**: Copy the link from the email and check if it contains these parameters.

### Step 2: Check Bridge Page

When you click the link, it should:
1. Open Safari
2. Load oliveandfable.com/reset-password
3. Show "Resetting your password..." message
4. Immediately try to open the app with: `oliveandfable://auth?redirect=<ENCODED_URL>`

**Action**: Open Safari developer tools (if testing on Mac) and check the console logs.

### Step 3: Check Deep Link Reception

The app should receive a deep link like:
```
oliveandfable://auth?redirect=https%3A%2F%2Foliveandfable.com%2Freset-password%23access_token%3D...
```

**Action**: Check app logs for "=== Deep link received ===" message.

### Step 4: Check Callback Handler

The callback handler should:
1. Decode the redirect parameter
2. Extract tokens from the decoded URL
3. Call `supabase.auth.setSession()` or `supabase.auth.verifyOtp()`
4. Navigate to reset-password screen AFTER session is established

**Action**: Check app logs for:
- "=== Auth Callback Handler Started ==="
- "Parsed auth parameters:"
- "✅ Session established via..."
- "🔐 Navigating to reset password screen"

### Step 5: Check Session Validation

The reset-password screen should:
1. Check for an active session
2. If session exists → Show password form
3. If no session → Show "Link expired" error

**Action**: Check app logs for:
- "=== Validating Password Reset Session ==="
- "✅ Valid reset session found" (good) OR
- "❌ No session found" (bad - means callback didn't work)

## Common Issues and Fixes

### Issue 1: Bridge Page Not Passing Tokens

**Symptom**: Deep link received but no tokens in URL

**Fix**: Update bridge page JavaScript to include hash fragment:
```javascript
const fullUrl = window.location.href; // This includes #hash
const appUrl = 'oliveandfable://auth?redirect=' + encodeURIComponent(fullUrl);
```

### Issue 2: App Not Catching Deep Link

**Symptom**: No "Deep link received" log message

**Fix**: Check app.json configuration:
```json
{
  "expo": {
    "scheme": "oliveandfable",
    "ios": {
      "associatedDomains": ["applinks:oliveandfable.com"]
    }
  }
}
```

### Issue 3: Callback Handler Not Processing Tokens

**Symptom**: Callback handler runs but doesn't establish session

**Fix**: Check token extraction logic in callback.tsx. The handler should try multiple methods:
1. Extract from query params: `?token_hash=...`
2. Extract from hash params: `#access_token=...`
3. Extract from encoded redirect: `?redirect=<URL_WITH_TOKENS>`

### Issue 4: Direct Navigation to Reset Password

**Symptom**: App opens directly to reset-password without going through callback

**Fix**: Ensure ALL password reset flows go through callback:
- Remove any direct routes to /(auth)/reset-password
- All deep links should go to /(auth)/callback first
- Callback handler navigates to reset-password AFTER establishing session

### Issue 5: Session Expires Too Quickly

**Symptom**: Session exists in callback but expires before reset-password screen loads

**Fix**: This is unlikely but possible. Check:
- Supabase session expiration settings
- Time between callback and reset-password navigation
- Any code that might be calling signOut() prematurely

## Testing Checklist

- [ ] Request password reset from app
- [ ] Receive email with reset link
- [ ] Click link in email
- [ ] See "Resetting your password..." page in Safari
- [ ] See "Open in Olive & Fable?" prompt
- [ ] Tap "Open"
- [ ] App opens (check logs for deep link reception)
- [ ] Callback handler processes tokens (check logs)
- [ ] Session is established (check logs)
- [ ] Reset password screen shows password form (NOT "Link expired")
- [ ] Enter new password
- [ ] Password is updated successfully
- [ ] Redirected to login screen

## Log Messages to Look For

### ✅ Good Flow (Working)
```
=== Deep link received ===
URL: oliveandfable://auth?redirect=https%3A%2F%2F...
✅ Auth-related URL detected, navigating to callback
=== Auth Callback Handler Started ===
Parsed auth parameters:
- token_hash: present (or access_token: present)
- type: recovery
=== Token Hash Recovery Flow === (or === Token Flow ===)
✅ Recovery session established via token_hash
Session user: user@example.com
Session expires at: 2024-...
🔐 Navigating to reset password screen
=== Validating Password Reset Session ===
✅ Valid reset session found
User can now update their password
```

### ❌ Bad Flow (Broken)
```
=== Validating Password Reset Session ===
❌ No session found - user must use reset link
This means the callback handler did not establish a session
```

This means the callback handler was either:
1. Not triggered at all
2. Triggered but failed to extract tokens
3. Triggered but failed to establish session

## Next Steps

If you're still seeing "Link expired" after checking all the above:

1. **Enable verbose logging**: Add more console.log statements in:
   - app/_layout.tsx (deep link listener)
   - app/(auth)/callback.tsx (token extraction and session establishment)
   - app/(auth)/reset-password.tsx (session validation)

2. **Test with a fresh reset link**: Old links may have expired tokens

3. **Check Supabase dashboard**: Look at the Auth logs to see if the session was created

4. **Test on different devices**: iOS vs Android may behave differently

5. **Check network connectivity**: Ensure the app can reach Supabase servers

## Support

If the issue persists, provide:
- Full console logs from the app (use `read_frontend_logs`)
- The exact URL from the password reset email
- Screenshots of the error
- Device type and OS version
