
import { colors, commonStyles } from '@/styles/commonStyles';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Logo } from '@/components/Logo';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import { supabase } from '@/integrations/supabase/client';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoWrapper: {
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 0,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textLight,
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    minHeight: 52,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.card,
  },
  inputError: {
    borderColor: '#DC2626',
  },
  errorMessage: {
    backgroundColor: '#DC262615',
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 15,
    color: '#DC2626',
    lineHeight: 22,
    marginBottom: 12,
  },
  forgotPasswordInError: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
  },
  unverifiedMessage: {
    backgroundColor: '#F59E0B15',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  unverifiedText: {
    fontSize: 15,
    color: '#D97706',
    lineHeight: 22,
    marginBottom: 12,
  },
  resendButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  signInButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: '#111F0F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signUpText: {
    fontSize: 15,
    color: colors.textLight,
  },
  signUpLink: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  successMessage: {
    backgroundColor: '#10B98115',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  successText: {
    fontSize: 15,
    color: '#059669',
    lineHeight: 22,
  },
});

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<'invalid' | 'unverified' | null>(null);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailResent, setEmailResent] = useState(false);

  const { height } = useWindowDimensions();
  const { signIn } = useSupabaseAuth();

  const isSmallPhone = height < 750;
  const logoToTitleGap = isSmallPhone ? 14 : 28;
  const topPadding = isSmallPhone ? 22 : 40;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResendVerification = async () => {
    console.log('User tapped Resend Verification Email');
    setResendingEmail(true);
    setEmailResent(false);

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (resendError) {
        console.error('Resend verification error:', resendError);
      } else {
        console.log('Verification email resent successfully');
        setEmailResent(true);
      }
    } catch (err) {
      console.error('Error resending verification email:', err);
    } finally {
      setResendingEmail(false);
    }
  };

  const handleSignIn = async () => {
    console.log('User tapped Sign In button');
    setError(null);
    setEmailResent(false);

    if (!email.trim() || !password) {
      setError('invalid');
      return;
    }

    if (!validateEmail(email)) {
      setError('invalid');
      return;
    }

    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        console.error('Sign in error:', signInError);

        // Check for unconfirmed email
        if (signInError.message?.includes('Email not confirmed') || 
            signInError.message?.includes('not confirmed')) {
          setError('unverified');
        } else {
          // All other errors (invalid credentials, etc.)
          setError('invalid');
        }
      } else {
        console.log('Sign in successful');
        // Router will automatically redirect to /(tabs) via _layout.tsx
      }
    } catch (err: any) {
      console.error('Sign in exception:', err);
      setError('invalid');
    } finally {
      setLoading(false);
    }
  };

  const errorMessageText = 'Email or password is incorrect.';
  const unverifiedMessageText = 'Please verify your email to continue.';
  const emailResentText = '✓ Verification email sent! Check your inbox.';

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPadding }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.logoWrapper, { marginBottom: logoToTitleGap }]}>
          <Logo size="large" />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          {error === 'invalid' && (
            <View style={styles.errorMessage}>
              <Text style={styles.errorText}>{errorMessageText}</Text>
              <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
                <Text style={styles.forgotPasswordInError}>Forgot password?</Text>
              </Pressable>
            </View>
          )}

          {error === 'unverified' && (
            <View style={styles.unverifiedMessage}>
              <Text style={styles.unverifiedText}>{unverifiedMessageText}</Text>
              <Pressable
                style={styles.resendButton}
                onPress={handleResendVerification}
                disabled={resendingEmail}
              >
                {resendingEmail ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.resendButtonText}>Resend verification email</Text>
                )}
              </Pressable>
            </View>
          )}

          {emailResent && (
            <View style={styles.successMessage}>
              <Text style={styles.successText}>{emailResentText}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="your@email.com"
              placeholderTextColor={colors.textLight}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError(null);
                if (emailResent) setEmailResent(false);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Enter your password"
              placeholderTextColor={colors.textLight}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError(null);
                if (emailResent) setEmailResent(false);
              }}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {!error && (
            <Pressable
              style={styles.forgotPassword}
              onPress={() => router.push('/(auth)/forgot-password')}
              disabled={loading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </Pressable>
          )}

          <Pressable
            style={[styles.signInButton, loading && styles.signInButtonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </Pressable>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don&apos;t have an account?</Text>
            <Pressable onPress={() => router.push('/(auth)/sign-up')} disabled={loading}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
