
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

import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "@/integrations/supabase/client";
import { colors } from "@/styles/commonStyles";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import * as Linking from "expo-linking";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Key for storing processed URLs
const PROCESSED_URLS_KEY = 'processed_auth_urls';

// Helper to get processed URLs from storage
async function getProcessedUrls(): Promise<Set<string>> {
  try {
    let storedUrls: string | null = null;
    
    if (Platform.OS === 'web') {
      storedUrls = localStorage.getItem(PROCESSED_URLS_KEY);
    } else {
      storedUrls = await AsyncStorage.getItem(PROCESSED_URLS_KEY);
    }
    
    if (storedUrls) {
      const urlsArray = JSON.parse(storedUrls);
      return new Set(urlsArray);
    }
  } catch (error) {
    console.log('Error loading processed URLs:', error);
  }
  
  return new Set();
}

// Helper to save processed URLs to storage
async function saveProcessedUrl(url: string) {
  try {
    const processedUrls = await getProcessedUrls();
    processedUrls.add(url);
    
    // Convert Set to Array for storage
    const urlsArray = Array.from(processedUrls);
    
    // Keep only last 50 URLs to prevent storage bloat
    const recentUrls = urlsArray.slice(-50);
    
    if (Platform.OS === 'web') {
      localStorage.setItem(PROCESSED_URLS_KEY, JSON.stringify(recentUrls));
    } else {
      await AsyncStorage.setItem(PROCESSED_URLS_KEY, JSON.stringify(recentUrls));
    }
    
    console.log('✅ URL marked as processed and saved to storage');
  } catch (error) {
    console.log('Error saving processed URL:', error);
  }
}

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { refreshAuthAndUser } = useSupabaseAuth();
  const [processing, setProcessing] = useState(false);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing within the same component instance
    if (hasProcessed.current) {
      console.log('Already processed in this component instance, skipping...');
      return;
    }
    
    hasProcessed.current = true;
    handleCallback();
  }, []);

  const handleCallback = async () => {
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
      // CRITICAL: Check if this URL has already been processed
      // This prevents consuming the same one-time token multiple times
      // Now persisted across app restarts!
      // ============================================================
      const urlKey = urlParam.split('#')[0].split('?')[0]; // Use base URL as key
      
      const processedUrls = await getProcessedUrls();
      
      if (processedUrls.has(urlKey)) {
        console.log('⚠️ This URL has already been processed. Redirecting to login.');
        setError("This link has already been used. Each reset link can only be used once. Please request a new password reset link if needed.");
        setTimeout(() => router.replace("/(auth)/forgot-password"), 4000);
        return;
      }

      console.log('✅ URL has not been processed before, continuing...');

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
        
        // Provide user-friendly error messages
        let friendlyError = errorDescription || "Authentication failed";
        
        if (errorCode === 'access_denied') {
          friendlyError = "Access was denied. Please try again.";
        } else if (errorDescription?.includes('expired')) {
          friendlyError = "This link has expired. Password reset links are only valid for a short time. Please request a new one.";
        } else if (errorDescription?.includes('invalid')) {
          friendlyError = "This link is invalid. Please request a new one.";
        }
        
        setError(friendlyError);
        setTimeout(() => {
          if (type === 'recovery') {
            router.replace("/(auth)/forgot-password");
          } else {
            router.replace("/(auth)/login");
          }
        }, 4000);
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
            
            // Provide specific error messages based on the error
            let friendlyError = "This password reset link is invalid or has expired.";
            
            if (verifyError.message.includes('expired')) {
              friendlyError = "This password reset link has expired. Password reset links are only valid for 1 hour. Please request a new one.";
            } else if (verifyError.message.includes('already been used') || verifyError.message.includes('not found') || verifyError.message.includes('One-time')) {
              friendlyError = "This password reset link has already been used. Each link can only be used once. Please request a new password reset link.";
            } else if (verifyError.message.includes('invalid')) {
              friendlyError = "This password reset link is invalid. Please request a new one.";
            }
            
            setError(friendlyError);
            
            setTimeout(() => {
              router.replace("/(auth)/forgot-password");
            }, 4000);
            return;
          }

          if (data.session) {
            console.log('✅ Recovery session established via token_hash');
            console.log('Session user:', data.session.user.email);
            console.log('Session expires at:', data.session.expires_at);
            
            // Mark URL as processed AFTER successful session establishment
            await saveProcessedUrl(urlKey);
            
            // Refresh auth state
            await refreshAuthAndUser();

            console.log('🔐 Navigating to reset password screen');
            router.replace('/(auth)/reset-password');
            return;
          } else {
            console.log('❌ verifyOtp returned no session');
            setError("Failed to establish recovery session. Please request a new password reset link.");
            setTimeout(() => router.replace("/(auth)/forgot-password"), 3000);
            return;
          }
        } catch (err: any) {
          console.log('❌ Error during token hash verification:', err);
          
          let friendlyError = "Failed to verify reset link.";
          
          if (err.message?.includes('expired')) {
            friendlyError = "This password reset link has expired. Please request a new one.";
          } else if (err.message?.includes('already been used') || err.message?.includes('not found')) {
            friendlyError = "This password reset link has already been used. Please request a new one.";
          }
          
          setError(friendlyError);
          setTimeout(() => router.replace("/(auth)/forgot-password"), 4000);
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
            
            let friendlyError = "This link has expired or is invalid.";
            
            if (exchangeError.message.includes('expired')) {
              friendlyError = "This link has expired. Links are only valid for a short time. Please request a new one.";
            } else if (exchangeError.message.includes('already been used')) {
              friendlyError = "This link has already been used. Each link can only be used once. Please request a new one.";
            }
            
            setError(friendlyError);
            
            setTimeout(() => {
              if (type === 'recovery') {
                router.replace("/(auth)/forgot-password");
              } else {
                router.replace("/(auth)/login");
              }
            }, 4000);
            return;
          }

          if (data.session) {
            console.log('✅ Session established via code exchange');
            console.log('Session user:', data.session.user.email);
            
            // Mark URL as processed AFTER successful session establishment
            await saveProcessedUrl(urlKey);
            
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
          setError("Failed to complete authentication. Please try again.");
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
            
            let friendlyError = "This link has expired or is invalid.";
            
            if (sessionError.message.includes('expired')) {
              friendlyError = "This link has expired. Password reset links are only valid for 1 hour. Please request a new one.";
            } else if (sessionError.message.includes('invalid')) {
              friendlyError = "This link is invalid. Please request a new one.";
            } else if (sessionError.message.includes('already been used') || sessionError.message.includes('not found')) {
              friendlyError = "This link has already been used. Each link can only be used once. Please request a new password reset link.";
            }
            
            setError(friendlyError);
            
            setTimeout(() => {
              if (type === 'recovery') {
                router.replace("/(auth)/forgot-password");
              } else {
                router.replace("/(auth)/login");
              }
            }, 4000);
            return;
          }

          if (data.session) {
            console.log('✅ Session established via setSession');
            console.log('Session user:', data.session.user.email);
            console.log('Session expires at:', data.session.expires_at);
            
            // Mark URL as processed AFTER successful session establishment
            await saveProcessedUrl(urlKey);
            
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
            setError("Failed to establish session. Please request a new link.");
            setTimeout(() => router.replace("/(auth)/login"), 3000);
            return;
          }
        } catch (err: any) {
          console.log('❌ Error during setSession:', err);
          
          let friendlyError = "Failed to complete authentication.";
          
          if (err.message?.includes('expired')) {
            friendlyError = "This link has expired. Please request a new one.";
          } else if (err.message?.includes('already been used') || err.message?.includes('not found')) {
            friendlyError = "This link has already been used. Please request a new one.";
          }
          
          setError(friendlyError);
          setTimeout(() => router.replace("/(auth)/login"), 4000);
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
    lineHeight: 24,
  },
  redirectText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
