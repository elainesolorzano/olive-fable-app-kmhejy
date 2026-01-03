
/**
 * Auth Callback Handler
 * 
 * Handles deep link callbacks from email verification and OAuth flows
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
      // Get the current session to check if email verification succeeded
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        setError("Failed to verify email. Please try again.");
        setTimeout(() => {
          router.replace("/(auth)/login");
        }, 3000);
        return;
      }

      if (session?.user) {
        // Check if email is verified
        if (session.user.email_confirmed_at) {
          // Email verified successfully, navigate to main app
          router.replace("/(tabs)");
        } else {
          // Session exists but email not verified yet
          router.replace("/(auth)/verify-email");
        }
      } else {
        // No session found
        setError("Failed to verify email. Please try again.");
        setTimeout(() => {
          router.replace("/(auth)/login");
        }, 3000);
      }
    } catch (err) {
      console.error("Auth callback error:", err);
      setError("An error occurred during verification.");
      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.redirectText}>Redirecting to login...</Text>
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Verifying your email...</Text>
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
