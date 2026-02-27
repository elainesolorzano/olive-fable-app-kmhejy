
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

/**
 * Authentication guard hook that redirects to login if session is null.
 * This is a backup layer in case a user reaches a screen via stale navigation state.
 * 
 * @returns { isLoading: boolean } - True while checking session, false when ready
 */
export function useAuthGuard() {
  const { session, isLoading, isInitialLoading } = useSupabaseAuth();

  useEffect(() => {
    // Don't redirect while session is still loading
    if (isLoading || isInitialLoading) {
      console.log('useAuthGuard: Session loading, waiting...');
      return;
    }

    // If no session after loading completes, redirect to login
    if (!session) {
      console.log('useAuthGuard: No session found, redirecting to login');
      router.replace('/(auth)/login');
    }
  }, [session, isLoading, isInitialLoading]);

  // Return loading state so screens can show loading UI if needed
  return { isLoading: isLoading || isInitialLoading };
}
