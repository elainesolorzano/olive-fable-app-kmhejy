
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { supabase } from '@/integrations/supabase/client';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { getFriendlyAuthError, AUTH_SUCCESS_MESSAGES } from '@/utils/authErrorMessages';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ title: string; body: string } | null>(null);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    console.log('User tapped Send Reset Link button');
    setError(null);

    if (!email) {
      setError({
        title: 'Email required',
        body: 'Please enter your email address.',
      });
      return;
    }

    if (!validateEmail(email)) {
      setError({
        title: 'Invalid email',
        body: 'Please enter a valid email address.',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('=== Requesting Password Reset ===');
      console.log('Email:', email);
      console.log('Redirect URL: https://oliveandfable.com/reset-password');
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://oliveandfable.com/reset-password',
      });

      if (resetError) {
        console.log('❌ Password reset request error:', resetError.message);
        const friendlyError = getFriendlyAuthError(resetError, 'forgotPassword');
        setError(friendlyError);
      } else {
        console.log('✅ Password reset email sent successfully');
        setSuccess(true);
      }
    } catch (err: any) {
      console.log('❌ Unexpected error during password reset request:', err);
      const friendlyError = getFriendlyAuthError(err, 'forgotPassword');
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const titleText = 'Reset your password';
  const subtitleText = 'Enter your email address and we will send you a link to reset your password';
  const emailLabelText = 'Email Address';
  const buttonText = 'Send reset link';
  const backToLoginText = 'Back to Sign In';

  if (success) {
    const successTitle = AUTH_SUCCESS_MESSAGES.forgotPassword.title;
    const successBody = AUTH_SUCCESS_MESSAGES.forgotPassword.body;

    return (
      <View style={commonStyles.container}>
        <Stack.Screen 
          options={{
            headerShown: true,
            title: 'Reset Password',
            headerBackTitle: 'Back',
          }}
        />
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <IconSymbol 
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={60}
                color="#10B981"
              />
            </View>
            <Text style={styles.title}>{successTitle}</Text>
            <Text style={styles.subtitle}>{successBody}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Check your email inbox and spam folder. The link will expire in 1 hour.
            </Text>
          </View>

          <Pressable 
            style={buttonStyles.primaryButton}
            onPress={() => router.replace('/(auth)/login')}
          >
            <Text style={buttonStyles.buttonText}>{backToLoginText}</Text>
          </Pressable>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>Didn&apos;t receive the email? </Text>
            <Pressable onPress={() => setSuccess(false)}>
              <Text style={styles.toggleLink}>Try again</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Reset Password',
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <IconSymbol 
              ios_icon_name="lock.fill"
              android_material_icon_name="lock"
              size={60}
              color={colors.primary}
            />
          </View>
          <Text style={styles.title}>{titleText}</Text>
          <Text style={styles.subtitle}>{subtitleText}</Text>
        </View>

        {error && (
          <View style={styles.errorMessage}>
            <Text style={styles.errorTitle}>{error.title}</Text>
            <Text style={styles.errorBody}>{error.body}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{emailLabelText}</Text>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="your@email.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <Pressable 
            style={({ pressed }) => [
              buttonStyles.primaryButton,
              styles.submitButton,
              pressed && styles.pressed,
              loading && styles.disabled
            ]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={buttonStyles.buttonText}>{buttonText}</Text>
            )}
          </Pressable>

          <View style={styles.toggleContainer}>
            <Pressable 
              onPress={() => router.replace('/(auth)/login')}
              disabled={loading}
            >
              <Text style={styles.toggleLink}>{backToLoginText}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  errorMessage: {
    backgroundColor: '#DC262615',
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 8,
  },
  errorBody: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#10B98115',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  inputError: {
    borderColor: '#DC2626',
  },
  submitButton: {
    marginTop: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  toggleText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  toggleLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
});
</write file>

Now let me fix the callback handler to add better logging and handle the missing dependencies warning:

<write file="app/(auth)/callback.tsx">
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
 * - Token hash: ?token_hash=...&type=recovery (for password reset)
 */

import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "@/integrations/supabase/client";
import { colors } from "@/styles/commonStyles";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import * as Linking from "expo-linking";

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { refreshAuthAndUser } = useSupabaseAuth();
  const [processing, setProcessing] = useState(false);

  const handleCallback = useCallback(async () => {
    if (processing) {
      console.log('Already processing callback, skipping...');
      return;
    }
    
    setProcessing(true);
    
    try {
      console.log('=== Auth Callback Handler Started ===');
      console.log('Route params:', params);

      // Get the URL - either from params or from initial URL
      let urlParam = params.url as string;
      
      if (!urlParam) {
        console.log('No URL in params, checking initial URL...');
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          console.log('Found initial URL:', initialUrl);
          urlParam = initialUrl;
        }
      }

      if (!urlParam) {
        console.log('❌ No URL parameter provided');
        setError("Invalid callback URL");
        setTimeout(() => router.replace("/(auth)/login"), 2000);
        return;
      }

      console.log('Processing URL:', urlParam);

      // ============================================================
      // STEP 1: Parse the URL and extract redirect parameter if present
      // ============================================================
      let rawAuthUrl = urlParam;
      
      try {
        const urlObj = new URL(urlParam);
        console.log('Parsed URL - pathname:', urlObj.pathname, 'hash:', urlObj.hash, 'search:', urlObj.search);

        // Check for redirect parameter (from Squarespace bridge)
        const redirectParam = urlObj.searchParams.get('redirect');
        
        if (redirectParam) {
          console.log('✅ Found redirect parameter from bridge page');
          rawAuthUrl = decodeURIComponent(redirectParam);
          console.log('Decoded redirect URL:', rawAuthUrl);
        }
      } catch (urlError) {
        console.log('Error parsing URL, will try to extract tokens directly:', urlError);
      }

      // ============================================================
      // STEP 2: Extract tokens/code from the auth URL
      // ============================================================
      let accessToken: string | null = null;
      let refreshToken: string | null = null;
      let code: string | null = null;
      let tokenHash: string | null = null;
      let type: string | null = null;
      let errorCode: string | null = null;
      let errorDescription: string | null = null;

      try {
        const authUrlObj = new URL(rawAuthUrl);
        const authParams = new URLSearchParams(authUrlObj.search);
        const authHashParams = new URLSearchParams(authUrlObj.hash.substring(1));

        // Extract all possible auth parameters
        code = authParams.get('code');
        tokenHash = authParams.get('token_hash') || authHashParams.get('token_hash');
        accessToken = authHashParams.get('access_token') || authParams.get('access_token');
        refreshToken = authHashParams.get('refresh_token') || authParams.get('refresh_token');
        type = authHashParams.get('type') || authParams.get('type');
        errorCode = authHashParams.get('error') || authParams.get('error');
        errorDescription = authHashParams.get('error_description') || authParams.get('error_description');

        console.log('Parsed auth parameters:');
        console.log('- code:', code ? 'present' : 'missing');
        console.log('- token_hash:', tokenHash ? 'present' : 'missing');
        console.log('- access_token:', accessToken ? 'present' : 'missing');
        console.log('- refresh_token:', refreshToken ? 'present' : 'missing');
        console.log('- type:', type);
        console.log('- error:', errorCode);
      } catch (parseError) {
        console.log('Error parsing auth URL:', parseError);
        
        // Fallback: Try to extract tokens from raw string
        const hashMatch = rawAuthUrl.match(/#(.+)/);
        if (hashMatch) {
          const hashString = hashMatch[1];
          const hashParams = new URLSearchParams(hashString);
          accessToken = hashParams.get('access_token');
          refreshToken = hashParams.get('refresh_token');
          tokenHash = hashParams.get('token_hash');
          type = hashParams.get('type');
          console.log('Extracted from hash string - access_token:', accessToken ? 'present' : 'missing');
          console.log('Extracted from hash string - refresh_token:', refreshToken ? 'present' : 'missing');
          console.log('Extracted from hash string - token_hash:', tokenHash ? 'present' : 'missing');
          console.log('Extracted from hash string - type:', type);
        }
      }

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

      // Option A: Token hash flow (password reset with token_hash)
      if (tokenHash && type === 'recovery') {
        console.log('=== Token Hash Recovery Flow ===');
        console.log('Verifying OTP with token_hash for password reset...');
        
        try {
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'recovery',
          });

          if (verifyError) {
            console.log('❌ Token hash verification error:', verifyError.message);
            
            // Check if token is expired or already used
            if (verifyError.message.includes('expired') || verifyError.message.includes('invalid')) {
              setError("This password reset link has expired or is invalid. Please request a new one.");
            } else {
              setError(verifyError.message);
            }
            
            setTimeout(() => {
              router.replace("/(auth)/forgot-password");
            }, 3000);
            return;
          }

          if (data.session) {
            console.log('✅ Recovery session established via token_hash');
            console.log('Session user:', data.session.user.email);
            console.log('Session expires at:', data.session.expires_at);
            
            // Refresh auth state
            await refreshAuthAndUser();

            console.log('🔐 Navigating to reset password screen');
            router.replace('/(auth)/reset-password');
            return;
          } else {
            console.log('❌ verifyOtp returned no session');
            setError("Failed to establish recovery session");
            setTimeout(() => router.replace("/(auth)/forgot-password"), 3000);
            return;
          }
        } catch (err: any) {
          console.log('❌ Error during token hash verification:', err);
          setError("Failed to verify reset link");
          setTimeout(() => router.replace("/(auth)/forgot-password"), 3000);
          return;
        }
      }

      // Option B: Exchange code for session (PKCE flow)
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
            console.log('Session user:', data.session.user.email);
            
            // Refresh auth state
            await refreshAuthAndUser();

            // Navigate based on type
            if (type === 'recovery') {
              console.log('🔐 Recovery flow - navigating to reset password screen');
              router.replace('/(auth)/reset-password');
            } else {
              console.log('✅ Signup/email confirmation - navigating to app');
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

      // Option C: Set session from tokens (direct token flow)
      if (accessToken && refreshToken) {
        console.log('=== Token Flow ===');
        console.log('Setting session from access_token and refresh_token...');
        console.log('Token type:', type);
        
        try {
          // CRITICAL: Set the session with the tokens from the URL
          // This establishes the recovery session needed for password reset
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
            console.log('Session user:', data.session.user.email);
            console.log('Session expires at:', data.session.expires_at);
            
            // Refresh auth state to update context
            await refreshAuthAndUser();

            // Navigate based on type
            if (type === 'recovery') {
              console.log('🔐 Recovery flow - navigating to reset password screen');
              console.log('User can now update their password');
              router.replace('/(auth)/reset-password');
            } else {
              console.log('✅ Signup/email confirmation - navigating to app');
              router.replace('/(tabs)');
            }
            return;
          } else {
            console.log('❌ setSession returned no session');
            setError("Failed to establish session");
            setTimeout(() => router.replace("/(auth)/login"), 3000);
            return;
          }
        } catch (err: any) {
          console.log('❌ Error during setSession:', err);
          setError("Failed to complete authentication");
          setTimeout(() => router.replace("/(auth)/login"), 3000);
          return;
        }
      }

      // ============================================================
      // STEP 4: Fallback - check if we already have a session
      // ============================================================
      console.log('=== No code, token_hash, or tokens found - checking current session ===');
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
  }, [params, processing, refreshAuthAndUser]);

  useEffect(() => {
    handleCallback();
  }, [handleCallback]);

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
