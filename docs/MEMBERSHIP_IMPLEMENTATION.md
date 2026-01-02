
# Membership Implementation Documentation

## Overview

This document describes the technical implementation of the Stripe-based membership system in the Olive & Fable app.

## Architecture

```
┌─────────────┐
│   React     │
│   Native    │
│     App     │
└──────┬──────┘
       │
       │ 1. Request checkout session
       ▼
┌─────────────────────────┐
│  Supabase Edge Function │
│ create-checkout-session │
└──────┬──────────────────┘
       │
       │ 2. Create session
       ▼
┌─────────────┐
│   Stripe    │
│     API     │
└──────┬──────┘
       │
       │ 3. Return checkout URL
       ▼
┌─────────────┐
│   Browser   │
│  (Checkout) │
└──────┬──────┘
       │
       │ 4. Payment completed
       ▼
┌─────────────────────────┐
│  Stripe Webhook Event   │
└──────┬──────────────────┘
       │
       │ 5. Send event
       ▼
┌─────────────────────────┐
│  Supabase Edge Function │
│     stripe-webhook      │
└──────┬──────────────────┘
       │
       │ 6. Update profile
       ▼
┌─────────────┐
│  Supabase   │
│  Database   │
└─────────────┘
```

## Database Schema

### profiles table

```sql
create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null unique,
  membership_status text default 'inactive' check (membership_status in ('active', 'inactive', 'cancelled')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### RLS Policies

- Users can view their own profile
- Users can update their own profile
- Users can insert their own profile
- Automatic profile creation on user signup via trigger

## Edge Functions

### create-checkout-session

**Purpose**: Create a Stripe Checkout session for membership purchase

**Authentication**: Required (JWT verification enabled)

**Request Body**:
```typescript
{
  successUrl: string;
  cancelUrl: string;
}
```

**Response**:
```typescript
{
  url: string;        // Stripe Checkout URL
  sessionId: string;  // Session ID
}
```

**Flow**:
1. Verify user authentication
2. Get or create Stripe customer
3. Create Stripe Checkout session
4. Return checkout URL

### stripe-webhook

**Purpose**: Handle Stripe webhook events and update membership status

**Authentication**: None (uses Stripe signature verification)

**Events Handled**:
- `checkout.session.completed`: Activate membership
- `customer.subscription.updated`: Update membership status
- `customer.subscription.deleted`: Cancel membership

**Flow**:
1. Verify Stripe webhook signature
2. Parse event data
3. Update user profile in database
4. Return success response

## Frontend Implementation

### AuthContext

**File**: `contexts/AuthContext.tsx`

**New Features**:
- `profile` state: User profile with membership status
- `refreshProfile()`: Refresh user profile from database
- Automatic profile fetching on auth state change

**Usage**:
```typescript
const { profile, refreshProfile } = useAuth();
const isMember = profile?.membership_status === 'active';
```

### My Studio Screen

**File**: `app/(tabs)/my-studio.tsx`

**Changes**:
- Removed demo `userRole` state
- Uses real `profile.membership_status`
- Shows "Membership Active" when active
- Shows "Become a Member" when inactive

### Membership Screen

**File**: `app/my-studio/membership.tsx`

**Features**:
- Displays membership benefits
- "Join Now" button for non-members
- Opens Stripe Checkout in browser
- Refreshes profile after checkout
- Shows success alert on activation
- "Manage Membership" for active members

**Flow**:
1. User clicks "Join Now"
2. Call `create-checkout-session` Edge Function
3. Open Stripe Checkout URL in browser
4. Wait for browser to close
5. Refresh user profile
6. Show success message if activated

### Learn Screen

**File**: `app/(tabs)/learn.tsx`

**Content Gating**:
- Free content: Always accessible
- Premium content: Locked for non-members
- Shows lock icon for premium content
- Alert prompts to join membership
- Hides "Unlock All Guides" CTA for members

**Implementation**:
```typescript
const handleContentItemPress = (item: ContentItem) => {
  if (!item.isFree && !isMember) {
    Alert.alert(
      'Premium Content',
      'This content is available to members only.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Join Membership', onPress: () => router.push('/my-studio/membership') }
      ]
    );
    return;
  }
  // Open content...
};
```

### Workshops Screen

**File**: `app/(tabs)/workshops.tsx`

**Features**:
- Shows "You're All Set!" for members
- Shows "Join Membership" CTA for non-members
- Notify Me button for all users

## Security Considerations

### RLS Policies
- Users can only access their own profile
- Service role key used in webhook for admin access

### Webhook Verification
- Stripe signature verification in webhook
- Prevents unauthorized profile updates

### JWT Verification
- Checkout session creation requires authentication
- Prevents unauthorized checkout sessions

## Testing

### Test Membership Activation

1. Sign up/login to app
2. Navigate to My Studio > Membership
3. Click "Join Now"
4. Use test card: 4242 4242 4242 4242
5. Complete checkout
6. Return to app
7. Verify "Membership Active" shows
8. Verify premium content is unlocked

### Test Content Gating

1. As non-member, try to access premium content
2. Verify lock icon shows
3. Verify alert prompts to join
4. As member, verify all content is accessible

### Test Webhook

1. Complete a test payment
2. Check Stripe Dashboard > Events
3. Verify `checkout.session.completed` event
4. Check Supabase logs for webhook processing
5. Verify profile updated in database

## Monitoring

### Stripe Dashboard
- Monitor successful payments
- Check webhook delivery status
- View customer subscriptions

### Supabase Dashboard
- Check Edge Function logs
- Monitor database updates
- View RLS policy usage

### App Logs
- Console logs for user actions
- Error logging for failed requests
- Profile refresh logging

## Future Enhancements

- [ ] Add subscription management portal
- [ ] Implement trial periods
- [ ] Add multiple membership tiers
- [ ] Email notifications for membership events
- [ ] Analytics for conversion tracking
- [ ] Promo codes and discounts
- [ ] Annual subscription option
- [ ] Cancellation flow in-app

## Maintenance

### Monthly Tasks
- Review failed payments
- Check webhook delivery rates
- Monitor subscription churn

### Quarterly Tasks
- Review pricing strategy
- Analyze membership conversion
- Update content offerings

### Annual Tasks
- Review Stripe fees
- Evaluate alternative payment processors
- Update terms and conditions
