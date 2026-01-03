
/**
 * Auth Callback Handler
 * 
 * Handles deep link callbacks from email verification and OAuth flows
 * Route: oliveandfable://auth/callback
 */

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { authClient } from "@/lib/auth";
import { colors, commonStyles } from "@/styles/commonStyles";

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Better Auth automatically handles the callback via deep linking
      // We just need to verify the session was established
      const session = await authClient.getSession();
      
      if (session?.user) {
        // Session restored successfully, navigate to main app
        router.replace("/(tabs)");
      } else {
        // No session found, might be an error
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
    ...commonStyles.bodyText,
    color: colors.textSecondary,
    textAlign: "center",
  },
  errorContainer: {
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    ...commonStyles.bodyText,
    color: colors.error,
    textAlign: "center",
    fontSize: 16,
  },
  redirectText: {
    ...commonStyles.bodyText,
    color: colors.textSecondary,
    textAlign: "center",
    fontSize: 14,
  },
});
