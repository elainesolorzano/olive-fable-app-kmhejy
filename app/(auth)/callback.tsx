
/**
 * Auth Callback Handler
 * 
 * UNIFIED ENTRY POINT for all Supabase email deep links:
 * - Email verification (signup confirmation)
 * - Password reset (recovery)
 * - OAuth flows
 * 
 * Handles both:
 * 1. Custom scheme: oliveandfable://auth?redirect=<ENCODED_FULL_URL>
 * 2. Universal HTTPS: https://oliveandfable.com/appconfirmed or /reset-password
 * 
 * The Squarespace bridge page opens: oliveandfable://auth?redirect=<SUPABASE_URL>
 * where SUPABASE_URL contains either:
 * - Hash tokens: #access_token=...&refresh_token=...&type=signup|recovery
 * - Query code: ?code=... (PKCE style)
 */

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "@/integrations/supabase/client";
import { colors } from "@/styles/commonStyles";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { refreshAuthAndUser } = useSupabaseAuth();

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      console.log('=== Auth Callback Handler Started ===');
      console.log('Route params:', params);

      // Get the URL from params
      const urlParam = params.url as string;
      if (!urlParam) {
        console.log('❌ No URL parameter provided');
        setError("Invalid callback URL");
        setTimeout(() => router.replace("/(auth)/login"), 2000);
        return;
      }

      const decodedUrl = decodeURIComponent(urlParam);
      console.log('Decoded URL:', decodedUrl);

      const urlObj = new URL(decodedUrl);
      console.log('Parsed URL - pathname:', urlObj.pathname, 'hash:', urlObj.hash, 'search:', urlObj.search);

      // ============================================================
      // STEP 1: Extract redirect parameter (from Squarespace bridge)
      // ============================================================
      let rawAuthUrl = decodedUrl;
      const redirectParam = urlObj.searchParams.get('redirect');
      
      if (redirectParam) {
        console.log('Found redirect parameter from bridge page');
        rawAuthUrl = decodeURIComponent(redirectParam);
        console.log('Decoded redirect URL:', rawAuthUrl);
      }

      // ============================================================
      // STEP 2: Parse tokens/code from the auth URL
      // ============================================================
      const authUrlObj = new URL(rawAuthUrl);
      const authParams = new URLSearchParams(authUrlObj.search);
      const authHashParams = new URLSearchParams(authUrlObj.hash.substring(1));

      // Extract all possible auth parameters
      const code = authParams.get('code');
      const accessToken = authHashParams.get('access_token') || authParams.get('access_token');
      const refreshToken = authHashParams.get('refresh_token') || authParams.get('refresh_token');
      const type = authHashParams.get('type') || authParams.get('type');
      const errorCode = authHashParams.get('error') || authParams.get('error');
      const errorDescription = authHashParams.get('error_description') || authParams.get('error_description');

      console.log('Parsed auth parameters:');
      console.log('- code:', code ? 'present' : 'missing');
      console.log('- access_token:', accessToken ? 'present' : 'missing');
      console.log('- refresh_token:', refreshToken ? 'present' : 'missing');
      console.log('- type:', type);
      console.log('- error:', errorCode);

      // Check for errors in the callback
      if (errorCode) {
        console.log('❌ Error in callback:', errorCode, errorDescription);
        setError(errorDescription || "Authentication failed");
        setTimeout(() => router.replace("/(auth)/login"), 3000);
        return;
      }

      // ============================================================
      // STEP 3: Complete Supabase auth flow
      // ============================================================

      // Option A: Exchange code for session (PKCE flow)
      if (code) {
        console.log('=== Code Exchange Flow ===');
        console.log('Exchanging code for session...');
        
        try {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.log('❌ Code exchange error:', exchangeError.message);
            setError("Link expired or invalid. Please try again.");
            setTimeout(() => {
              if (type === 'recovery') {
                router.replace("/(auth)/forgot-password");
              } else {
                router.replace("/(auth)/login");
              }
            }, 3000);
            return;
          }

          if (data.session) {
            console.log('✅ Session established via code exchange');
            
            // Refresh auth state
            await refreshAuthAndUser();

            // Navigate based on type
            if (type === 'recovery') {
              console.log('Recovery flow - navigating to reset password screen');
              router.replace('/(auth)/reset-password');
            } else {
              console.log('Signup/email confirmation - navigating to app');
              router.replace('/(tabs)');
            }
            return;
          }
        } catch (err) {
          console.log('❌ Error during code exchange:', err);
          setError("Failed to complete authentication");
          setTimeout(() => router.replace("/(auth)/login"), 3000);
          return;
        }
      }

      // Option B: Set session from tokens (direct token flow)
      if (accessToken && refreshToken) {
        console.log('=== Token Flow ===');
        console.log('Setting session from tokens...');
        
        try {
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.log('❌ Set session error:', sessionError.message);
            setError("Link expired or invalid. Please try again.");
            setTimeout(() => {
              if (type === 'recovery') {
                router.replace("/(auth)/forgot-password");
              } else {
                router.replace("/(auth)/login");
              }
            }, 3000);
            return;
          }

          if (data.session) {
            console.log('✅ Session established via setSession');
            
            // Refresh auth state
            await refreshAuthAndUser();

            // Navigate based on type
            if (type === 'recovery') {
              console.log('Recovery flow - navigating to reset password screen');
              router.replace('/(auth)/reset-password');
            } else {
              console.log('Signup/email confirmation - navigating to app');
              router.replace('/(tabs)');
            }
            return;
          }
        } catch (err) {
          console.log('❌ Error during setSession:', err);
          setError("Failed to complete authentication");
          setTimeout(() => router.replace("/(auth)/login"), 3000);
          return;
        }
      }

      // ============================================================
      // STEP 4: Fallback - check if we already have a session
      // ============================================================
      console.log('=== No code or tokens found - checking current session ===');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.log("❌ Session error:", sessionError.message);
        setError("Something went wrong. Please try again.");
        setTimeout(() => router.replace("/(auth)/login"), 3000);
        return;
      }

      if (session?.user) {
        console.log('✅ Existing session found');
        
        // Refresh auth state
        await refreshAuthAndUser();

        // Check if email is verified
        if (session.user.email_confirmed_at) {
          console.log('Email verified - navigating to app');
          router.replace("/(tabs)");
        } else {
          console.log('Email not verified yet');
          router.replace("/(auth)/verify-email");
        }
      } else {
        // No session found
        console.log('❌ No session found in callback');
        setError("Authentication failed. Please try again.");
        setTimeout(() => router.replace("/(auth)/login"), 3000);
      }
    } catch (err) {
      console.log("❌ Auth callback error:", err);
      setError("Something went wrong. Please try again.");
      setTimeout(() => router.replace("/(auth)/login"), 3000);
    }
  };

  const loadingText = 'Processing authentication...';
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
