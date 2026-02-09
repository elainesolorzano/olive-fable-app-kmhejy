
/**
 * Auth Error Message Mapping Utility
 * 
 * Translates raw Supabase auth errors into user-friendly messages
 * for display in the UI. This ensures consistent, friendly error
 * messaging across all authentication flows.
 */

export interface FriendlyAuthError {
  title: string;
  body: string;
}

/**
 * Maps Supabase auth errors to friendly user-facing messages
 * 
 * @param error - The error object from Supabase auth
 * @param type - The type of auth operation (login, signup, forgotPassword, resetPassword)
 * @returns A friendly error message with title and body
 */
export function getFriendlyAuthError(
  error: any,
  type: 'login' | 'signup' | 'forgotPassword' | 'resetPassword'
): FriendlyAuthError {
  // Handle null/undefined errors
  if (!error) {
    return {
      title: 'An error occurred',
      body: 'Something went wrong. Please try again.',
    };
  }

  const errorMessage = error?.message?.toLowerCase() || error?.toString()?.toLowerCase() || '';

  // Login errors
  if (type === 'login') {
    if (errorMessage.includes('invalid login credentials') || 
        errorMessage.includes('invalid email or password') ||
        errorMessage.includes('email not found') ||
        errorMessage.includes('incorrect password')) {
      return {
        title: 'Sign in failed',
        body: 'Email or password is incorrect. Please try again.',
      };
    }

    if (errorMessage.includes('email not confirmed') || 
        errorMessage.includes('not confirmed')) {
      return {
        title: 'Verify your email',
        body: 'Please check your inbox to confirm your email, then try signing in.',
      };
    }

    if (errorMessage.includes('network') || 
        errorMessage.includes('timeout') ||
        errorMessage.includes('fetch')) {
      return {
        title: 'Connection issue',
        body: 'We could not reach our server. Please try again in a moment.',
      };
    }

    // Generic login error
    return {
      title: 'Sign in failed',
      body: 'We could not sign you in. Please try again.',
    };
  }

  // Sign up errors
  if (type === 'signup') {
    if (errorMessage.includes('user already registered') || 
        errorMessage.includes('already exists') ||
        errorMessage.includes('already registered')) {
      return {
        title: 'Account already exists',
        body: 'An account with this email already exists. Try signing in or reset your password.',
      };
    }

    if (errorMessage.includes('password should be at least') ||
        errorMessage.includes('password is too short') ||
        errorMessage.includes('password must be')) {
      return {
        title: 'Password too short',
        body: 'Please use a stronger password and try again.',
      };
    }

    if (errorMessage.includes('invalid email') ||
        errorMessage.includes('email is invalid')) {
      return {
        title: 'Invalid email',
        body: 'Please enter a valid email address.',
      };
    }

    if (errorMessage.includes('network') || 
        errorMessage.includes('timeout') ||
        errorMessage.includes('fetch')) {
      return {
        title: 'Connection issue',
        body: 'We could not reach our server. Please try again in a moment.',
      };
    }

    // Generic signup error
    return {
      title: 'Sign up failed',
      body: 'We could not create your account. Please try again.',
    };
  }

  // Forgot password errors
  if (type === 'forgotPassword') {
    if (errorMessage.includes('network') || 
        errorMessage.includes('timeout') ||
        errorMessage.includes('fetch')) {
      return {
        title: 'Connection issue',
        body: 'We could not reach our server. Please try again in a moment.',
      };
    }

    // Generic forgot password error
    return {
      title: 'Password reset failed',
      body: 'We could not process your request. Please try again.',
    };
  }

  // Reset password errors
  if (type === 'resetPassword') {
    if (errorMessage.includes('password should be at least') ||
        errorMessage.includes('password is too short') ||
        errorMessage.includes('password must be')) {
      return {
        title: 'Password too short',
        body: 'Please use a stronger password (at least 8 characters).',
      };
    }

    if (errorMessage.includes('same as the old password') ||
        errorMessage.includes('same password')) {
      return {
        title: 'Password unchanged',
        body: 'Please choose a different password than your current one.',
      };
    }

    if (errorMessage.includes('invalid') || 
        errorMessage.includes('expired') ||
        errorMessage.includes('token')) {
      return {
        title: 'Link expired',
        body: 'This password reset link has expired. Please request a new one.',
      };
    }

    if (errorMessage.includes('network') || 
        errorMessage.includes('timeout') ||
        errorMessage.includes('fetch')) {
      return {
        title: 'Connection issue',
        body: 'We could not reach our server. Please try again in a moment.',
      };
    }

    // Generic reset password error
    return {
      title: 'Password reset failed',
      body: 'We could not reset your password. Please try again.',
    };
  }

  // Fallback for unknown error types
  return {
    title: 'An error occurred',
    body: 'Something went wrong. Please try again.',
  };
}

/**
 * Success messages for auth operations
 */
export const AUTH_SUCCESS_MESSAGES = {
  forgotPassword: {
    title: 'Check your email',
    body: 'If an account exists for this email, we sent a password reset link.',
  },
  resetPassword: {
    title: 'Password updated',
    body: 'Your password has been successfully changed. You can now sign in with your new password.',
  },
  emailVerification: {
    title: 'Email verified',
    body: 'Your email has been verified successfully. You can now sign in.',
  },
};
