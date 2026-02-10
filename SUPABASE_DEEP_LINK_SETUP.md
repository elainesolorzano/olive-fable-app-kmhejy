
# Supabase Deep Link Configuration for Password Reset

## Problem
Password reset emails are redirecting to the website (`https://oliveandfable.com`) instead of opening the app.

## Solution
You need to configure Supabase to allow deep link redirects.

## Steps to Fix in Supabase Dashboard

### 1. Go to Supabase Dashboard
- Navigate to: https://supabase.com/dashboard/project/lynqyzidefvwttxbwarb
- Go to **Authentication** → **URL Configuration**

### 2. Add Deep Link to Redirect URLs
In the **Redirect URLs** section, add:
```
oliveandfable://*
```

**IMPORTANT:** Make sure to include the wildcard (`*`) at the end so all deep link paths are allowed.

### 3. Verify Site URL
The **Site URL** should be set to:
```
https://oliveandfable.com
```

This is the fallback URL if the deep link doesn't work.

### 4. Save Changes
Click **Save** at the bottom of the page.

## How to Test

1. **Trigger Password Reset:**
   - Open the app
   - Go to Login → "Forgot password?"
   - Enter your email
   - Tap "Send Reset Link"

2. **Check Your Email:**
   - Open the password reset email
   - The link should look like: `oliveandfable://auth/callback?type=recovery&token_hash=...`

3. **Tap the Link:**
   - The app should open (not the website)
   - You should see the "Reset Password" screen
   - Enter your new password
   - Success!

## Troubleshooting

### If the link still opens the website:
1. Double-check that `oliveandfable://*` is in the Redirect URLs list
2. Make sure you saved the changes in Supabase Dashboard
3. Try requesting a new password reset email (old emails may still have the old URL)

### If the app doesn't open:
1. Make sure the app is installed on your device
2. Check that the deep link scheme is configured in `app.json` (it is: `"scheme": "oliveandfable"`)
3. On iOS, you may need to reinstall the app for deep link changes to take effect

### If you see "Link expired":
1. Password reset links expire after a certain time
2. Request a new password reset email
3. Tap the link within a few minutes

## Technical Details

The app is configured to:
- Send password reset emails with redirect URL: `oliveandfable://auth/callback?type=recovery`
- Listen for deep links starting with `oliveandfable://auth/callback`
- Parse the token from the URL and exchange it for a session
- Show the Reset Password screen where users can set a new password

All of this happens **inside the app** - no website redirect needed!
