
# Stripe Membership Integration Setup

This app uses Stripe for membership payments. Follow these steps to complete the setup:

## 1. Stripe Account Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard (Developers > API keys)
3. Create a subscription product and price in Stripe Dashboard (Products > Add Product)
4. Note down your Price ID (starts with `price_`)

## 2. Configure Supabase Environment Variables

Set the following environment variables in your Supabase project:

```bash
# In Supabase Dashboard: Project Settings > Edge Functions > Secrets
STRIPE_SECRET_KEY=sk_test_... # Your Stripe Secret Key
STRIPE_PRICE_ID=price_... # Your Stripe Price ID
STRIPE_WEBHOOK_SECRET=whsec_... # Stripe Webhook Secret (see step 3)
```

Or use the Supabase CLI:

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_PRICE_ID=price_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

## 3. Configure Stripe Webhooks

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Set the endpoint URL to:
   ```
   https://lynqyzidefvwttxbwarb.supabase.co/functions/v1/stripe-webhook
   ```
4. Select the following events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret (starts with `whsec_`)
6. Add it to Supabase secrets as `STRIPE_WEBHOOK_SECRET`

## 4. Database Setup

The database migration has already been applied with the following:
- `profiles` table with membership_status field
- RLS policies for secure access
- Automatic profile creation on user signup
- Trigger to update updated_at timestamp

## 5. Edge Functions

Two Edge Functions have been deployed:

### create-checkout-session
- Creates Stripe Checkout sessions
- Requires authentication (JWT verification enabled)
- Called from the app when user clicks "Join Membership"

### stripe-webhook
- Handles Stripe webhook events
- Updates user membership status in database
- No JWT verification (uses webhook signature verification)

## 6. Testing

### Test Mode
1. Use Stripe test mode keys (sk_test_...)
2. Use test card: 4242 4242 4242 4242
3. Any future expiry date and CVC

### Production Mode
1. Switch to live mode keys in Stripe Dashboard
2. Update Supabase secrets with live keys
3. Update webhook endpoint to use live mode

## 7. App Configuration

The app is configured with:
- `expo-web-browser` for opening Stripe Checkout
- Deep linking scheme: `natively://`
- Success URL: `https://natively.dev/membership-success`
- Cancel URL: `https://natively.dev/membership-cancelled`

## 8. Features Implemented

✅ Membership purchase via Stripe Checkout
✅ Automatic profile update on successful payment
✅ Content gating in Learn tab (premium content locked)
✅ Workshop early access for members
✅ Persistent membership state across sessions
✅ Dynamic UI based on membership status
✅ No demo toggles or mock data

## 9. User Flow

1. User signs up/logs in
2. User navigates to My Studio > Membership
3. User clicks "Join Now - $9.99/month"
4. App creates Stripe Checkout session via Edge Function
5. Browser opens with Stripe Checkout page
6. User completes payment
7. Stripe sends webhook to stripe-webhook Edge Function
8. Edge Function updates user profile with membership_status = "active"
9. User returns to app
10. App refreshes profile and shows "Membership Active"
11. Premium content is now unlocked

## 10. Troubleshooting

### Webhook not working
- Check webhook secret is correct
- Verify webhook endpoint URL
- Check Supabase Edge Function logs

### Payment not updating membership
- Check Stripe webhook events in Dashboard
- Verify user_id is in session metadata
- Check Supabase logs for errors

### Content still locked after payment
- Refresh the app
- Check profile.membership_status in database
- Verify RLS policies allow user to read their profile

## Support

For issues, check:
- Supabase Edge Function logs
- Stripe Dashboard > Events
- App console logs
