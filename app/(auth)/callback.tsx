
/**
 * Auth Callback Handler
 * 
 * UNIFIED ENTRY POINT for all Supabase email deep links:
 * - Email verification (flow=signup or type=email)
 * - Password reset (flow=recovery or type=recovery)
 * - OAuth flows (access_token + refresh_token)
 * 
 * Route: oliveandfable://auth/callback
 * 
 * This is the ONLY deep link destination for Supabase auth.
 * All email links redirect here with different query params to indicate the flow.
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
      console.log('=== Auth Callback Handler Started ===');

      // Get the initial URL that opened the app
      const initialUrl = await Linking.getInitialURL();
      console.log('Initial URL:', initialUrl);
      console.log('Route params:', params);

      // Parse URL to extract tokens and flow indicators
      let flow: string | null = null;
      let type: string | null = null;
      let tokenHash: string | null = null;
      let accessToken: string | null = null;
      let refreshToken: string | null = null;

      if (initialUrl) {
        try {
          const url = new URL(initialUrl);
          console.log('Parsed URL - pathname:', url.pathname, 'hash:', url.hash, 'search:', url.search);
          
          // Check query params first (our custom flow parameter)
          flow = url.searchParams.get('flow');
          type = url.searchParams.get('type');
          
          // Check hash fragment (Supabase sends tokens here)
          if (url.hash) {
            const hashParams = new URLSearchParams(url.hash.substring(1));
            if (!flow) flow = hashParams.get('flow');
            if (!type) type = hashParams.get('type');
            tokenHash = hashParams.get('token_hash');
            accessToken = hashParams.get('access_token');
            refreshToken = hashParams.get('refresh_token');
            console.log('Parsed from hash - flow:', flow, 'type:', type, 'token_hash:', tokenHash ? 'present' : 'missing', 'access_token:', accessToken ? 'present' : 'missing');
          }
          
          // Also check query params for tokens (fallback)
          if (!tokenHash && !accessToken) {
            tokenHash = url.searchParams.get('token_hash');
            accessToken = url.searchParams.get('access_token');
            refreshToken = url.searchParams.get('refresh_token');
            console.log('Parsed from query - token_hash:', tokenHash ? 'present' : 'missing', 'access_token:', accessToken ? 'present' : 'missing');
          }
        } catch (urlError) {
          console.log('Error parsing URL:', urlError);
        }
      }

      // Also check route params (expo-router might parse them)
      if (!flow && !type) {
        flow = params.flow as string;
        type = params.type as string;
      }
      if (!tokenHash && !accessToken) {
        tokenHash = params.token_hash as string;
        accessToken = params.access_token as string;
        refreshToken = params.refresh_token as string;
      }

      console.log('Final parsed values - flow:', flow, 'type:', type);

      // ============================================================
      // PASSWORD RECOVERY FLOW (flow=recovery or type=recovery)
      // ============================================================
      if (flow === 'recovery' || type === 'recovery') {
        console.log('=== Password Recovery Flow Detected ===');
        
        // If we have access_token and refresh_token directly, set session
        if (accessToken && refreshToken) {
          console.log('Direct tokens available, setting session...');
          try {
            const { data, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) {
              console.log('❌ Error setting recovery session:', sessionError.message);
              router.replace('/(auth)/reset-password?expired=true');
              return;
            }

            if (data.session) {
              console.log('✅ Recovery session established via setSession');
              router.replace('/(auth)/reset-password');
              return;
            }
          } catch (err) {
            console.log('❌ Error during setSession:', err);
            router.replace('/(auth)/reset-password?expired=true');
            return;
          }
        }
        
        // If we have token_hash, exchange it for a session
        if (tokenHash) {
          console.log('Token hash available, exchanging for session...');
          try {
            const { data, error: verifyError } = await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: 'recovery',
            });

            if (verifyError) {
              console.log('❌ Token verification error:', verifyError.message);
              router.replace('/(auth)/reset-password?expired=true');
              return;
            }

            if (data.session) {
              console.log('✅ Recovery session established via verifyOtp');
              router.replace('/(auth)/reset-password');
              return;
            } else {
              console.log('❌ No session returned from verifyOtp');
              router.replace('/(auth)/reset-password?expired=true');
              return;
            }
          } catch (err) {
            console.log('❌ Error during token exchange:', err);
            router.replace('/(auth)/reset-password?expired=true');
            return;
          }
        }

        // No tokens found for recovery flow
        console.log('❌ Recovery flow detected but no tokens found');
        router.replace('/(auth)/reset-password?expired=true');
        return;
      }

      // ============================================================
      // EMAIL VERIFICATION FLOW (type=signup or type=email)
      // ============================================================
      if ((type === 'signup' || type === 'email') && tokenHash) {
        console.log('=== Email Verification Flow Detected ===');
        
        try {
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'email',
          });

          if (verifyError) {
            console.log('❌ Email verification error:', verifyError.message);
            setError("We couldn't verify your email. Please try again.");
            setTimeout(() => {
              router.replace("/(auth)/login");
            }, 3000);
            return;
          }

          if (data.session) {
            console.log('✅ Email verified successfully - redirecting to app');
            router.replace("/(tabs)");
            return;
          }
        } catch (err) {
          console.log('❌ Error during email verification:', err);
          setError("We couldn't verify your email. Please try again.");
          setTimeout(() => {
            router.replace("/(auth)/login");
          }, 3000);
          return;
        }
      }

      // ============================================================
      // OAUTH CALLBACK (access_token + refresh_token)
      // ============================================================
      if (accessToken && refreshToken && !flow && !type) {
        console.log('=== OAuth Callback Detected ===');
        try {
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.log('❌ Error setting OAuth session:', sessionError.message);
            setError("We couldn't sign you in. Please try again.");
            setTimeout(() => {
              router.replace("/(auth)/login");
            }, 3000);
            return;
          }

          if (data.session) {
            console.log('✅ OAuth session established successfully');
            router.replace("/(tabs)");
            return;
          }
        } catch (err) {
          console.log('❌ Error during OAuth callback:', err);
          setError("We couldn't sign you in. Please try again.");
          setTimeout(() => {
            router.replace("/(auth)/login");
          }, 3000);
          return;
        }
      }

      // ============================================================
      // FALLBACK: Check current session
      // ============================================================
      console.log('=== No Specific Flow Detected - Checking Current Session ===');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.log("❌ Session error:", sessionError.message);
        setError("Something went wrong. Please try again.");
        setTimeout(() => {
          router.replace("/(auth)/login");
        }, 3000);
        return;
      }

      if (session?.user) {
        // Check if email is verified
        if (session.user.email_confirmed_at) {
          console.log('✅ Session exists and email verified - redirecting to app');
          router.replace("/(tabs)");
        } else {
          console.log('⚠️ Session exists but email not verified yet');
          router.replace("/(auth)/verify-email");
        }
      } else {
        // No session found
        console.log('❌ No session found in callback');
        setError("Something went wrong. Please try again.");
        setTimeout(() => {
          router.replace("/(auth)/login");
        }, 3000);
      }
    } catch (err) {
      console.log("❌ Auth callback error:", err);
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
