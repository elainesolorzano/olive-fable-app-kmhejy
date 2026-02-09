
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
      console.log('Auth callback triggered with params:', params);

      // Extract token_hash and type from URL params
      // Supabase sends these in the URL fragment for password recovery
      const tokenHash = params.token_hash as string;
      const type = params.type as string;

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
          }
        } catch (err) {
          console.log('Error during token exchange:', err);
          router.replace('/(auth)/reset-password?expired=true');
          return;
        }
      }

      // Handle email verification flow
      if (type === 'signup' || type === 'email') {
        console.log('Email verification flow detected');
        
        if (tokenHash) {
          try {
            const { data, error: verifyError } = await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: 'email',
            });

            if (verifyError) {
              console.log('Email verification error:', verifyError.message);
              setError("Failed to verify email. Please try again.");
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
            setError("Failed to verify email. Please try again.");
            setTimeout(() => {
              router.replace("/(auth)/login");
            }, 3000);
            return;
          }
        }
      }

      // Fallback: Check current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.log("Session error:", sessionError.message);
        setError("Failed to verify. Please try again.");
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
        setError("Failed to verify. Please try again.");
        setTimeout(() => {
          router.replace("/(auth)/login");
        }, 3000);
      }
    } catch (err) {
      console.log("Auth callback error:", err);
      setError("An error occurred during verification.");
      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 3000);
    }
  };

  const loadingText = 'Processing...';
  const redirectText = 'Redirecting to login...';

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
    color: colors.error,
    textAlign: "center",
  },
  redirectText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
