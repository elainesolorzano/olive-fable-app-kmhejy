
/**
 * Auth Callback Handler
 * 
 * Handles deep link callbacks from:
 * - Email verification
 * - Password reset (recovery)
 * - OAuth flows
 * 
 * Route: oliveandfable://auth/callback
 */

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "@/integrations/supabase/client";
import { colors } from "@/styles/commonStyles";

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      console.log('Auth callback triggered');

      // Get the initial URL that opened the app
      const initialUrl = await Linking.getInitialURL();
      console.log('Initial URL:', initialUrl);

      // Parse URL to extract tokens from hash/fragment
      // Supabase sends tokens in the URL fragment (after #)
      let tokenHash: string | null = null;
      let type: string | null = null;

      if (initialUrl) {
        // Parse the URL - Supabase uses hash fragment for tokens
        const url = new URL(initialUrl);
        
        // Check if tokens are in the hash (after #)
        if (url.hash) {
          const hashParams = new URLSearchParams(url.hash.substring(1)); // Remove the # character
          tokenHash = hashParams.get('token_hash');
          type = hashParams.get('type');
          console.log('Parsed from hash - type:', type, 'token_hash:', tokenHash ? 'present' : 'missing');
        }
        
        // Fallback: check if tokens are in query params (some flows)
        if (!tokenHash || !type) {
          tokenHash = url.searchParams.get('token_hash');
          type = url.searchParams.get('type');
          console.log('Parsed from query - type:', type, 'token_hash:', tokenHash ? 'present' : 'missing');
        }
      }

      // Also check the route params (expo-router might parse them)
      if (!tokenHash || !type) {
        tokenHash = params.token_hash as string;
        type = params.type as string;
        console.log('Using route params - type:', type, 'token_hash:', tokenHash ? 'present' : 'missing');
      }

      // Handle password recovery flow
      if (type === 'recovery' && tokenHash) {
        console.log('Password recovery flow detected - exchanging token');
        
        try {
          // Exchange the token hash for a session
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'recovery',
          });

          if (verifyError) {
            console.log('Token verification error:', verifyError.message);
            // Token is invalid or expired - redirect to reset password with error flag
            router.replace('/(auth)/reset-password?expired=true');
            return;
          }

          if (data.session) {
            console.log('Recovery session established successfully');
            // Session is now active, redirect to reset password screen
            router.replace('/(auth)/reset-password');
            return;
          } else {
            console.log('No session returned from verifyOtp');
            router.replace('/(auth)/reset-password?expired=true');
            return;
          }
        } catch (err) {
          console.log('Error during token exchange:', err);
          router.replace('/(auth)/reset-password?expired=true');
          return;
        }
      }

      // Handle email verification flow
      if ((type === 'signup' || type === 'email') && tokenHash) {
        console.log('Email verification flow detected');
        
        try {
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'email',
          });

          if (verifyError) {
            console.log('Email verification error:', verifyError.message);
            setError("We couldn't verify your email. Please try again.");
            setTimeout(() => {
              router.replace("/(auth)/login");
            }, 3000);
            return;
          }

          if (data.session) {
            console.log('Email verified successfully - redirecting to app');
            router.replace("/(tabs)");
            return;
          }
        } catch (err) {
          console.log('Error during email verification:', err);
          setError("We couldn't verify your email. Please try again.");
          setTimeout(() => {
            router.replace("/(auth)/login");
          }, 3000);
          return;
        }
      }

      // Fallback: Check current session
      console.log('No specific flow detected, checking current session');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.log("Session error:", sessionError.message);
        setError("Something went wrong. Please try again.");
        setTimeout(() => {
          router.replace("/(auth)/login");
        }, 3000);
        return;
      }

      if (session?.user) {
        // Check if email is verified
        if (session.user.email_confirmed_at) {
          console.log('Session exists and email verified - redirecting to app');
          router.replace("/(tabs)");
        } else {
          console.log('Session exists but email not verified yet');
          router.replace("/(auth)/verify-email");
        }
      } else {
        // No session found
        console.log('No session found in callback');
        setError("Something went wrong. Please try again.");
        setTimeout(() => {
          router.replace("/(auth)/login");
        }, 3000);
      }
    } catch (err) {
      console.log("Auth callback error:", err);
      setError("Something went wrong. Please try again.");
      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 3000);
    }
  };

  const loadingText = 'Processing...';
  const redirectText = 'Redirecting...';

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.redirectText}>{redirectText}</Text>
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{loadingText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingContainer: {
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  errorContainer: {
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
  },
  redirectText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
