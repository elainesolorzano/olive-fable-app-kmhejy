
/**
 * Auth Callback Handler
 * 
 * Handles deep link callbacks from:
 * - Email verification
 * - Password reset
 * - OAuth flows
 * 
 * Route: olivefable://auth/callback
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

      // Get the current session to check auth state
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
        // Check if this is a password recovery flow
        // Supabase sets a recovery token when user clicks password reset link
        const isPasswordRecovery = params.type === 'recovery' || 
                                   params.recovery === 'true' ||
                                   session.user.recovery_sent_at;

        if (isPasswordRecovery) {
          console.log('Password recovery flow detected - redirecting to reset password');
          router.replace('/(auth)/reset-password');
          return;
        }

        // Check if email is verified (email verification flow)
        if (session.user.email_confirmed_at) {
          console.log('Email verified successfully - redirecting to app');
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
