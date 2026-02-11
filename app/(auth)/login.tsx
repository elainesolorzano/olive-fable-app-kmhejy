
import { colors, commonStyles } from '@/styles/commonStyles';
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Logo } from '@/components/Logo';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import { supabase } from '@/integrations/supabase/client';
import { getFriendlyAuthError } from '@/utils/authErrorMessages';

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
  unverifiedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D97706',
    marginBottom: 8,
  },
  unverifiedBody: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
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
  const params = useLocalSearchParams();
  const successMessage = params.message as string;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ title: string; body: string; type: 'invalid' | 'unverified' } | null>(null);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailResent, setEmailResent] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { height } = useWindowDimensions();
  const { signIn } = useSupabaseAuth();

  const isSmallPhone = height < 750;
  const logoToTitleGap = isSmallPhone ? 14 : 28;
  const topPadding = isSmallPhone ? 22 : 40;

  useEffect(() => {
    if (successMessage) {
      console.log('Password reset success message:', successMessage);
      setShowSuccessMessage(true);
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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
        console.log('Resend verification error:', resendError.message);
      } else {
        console.log('Verification email resent successfully');
        setEmailResent(true);
      }
    } catch (err) {
      console.log('Network error while resending verification email');
    } finally {
      setResendingEmail(false);
    }
  };

  const handleSignIn = async () => {
    console.log('User tapped Sign In button');
    setError(null);
    setEmailResent(false);
    setShowSuccessMessage(false);

    if (!email.trim() || !password) {
      setError({
        title: 'Missing information',
        body: 'Please enter your email and password.',
        type: 'invalid',
      });
      return;
    }

    if (!validateEmail(email)) {
      setError({
        title: 'Invalid email',
        body: 'Please enter a valid email address.',
        type: 'invalid',
      });
      return;
    }

    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        // Check for unconfirmed email
        const isUnverified = 
          signInError.message?.toLowerCase().includes('email not confirmed') || 
          signInError.message?.toLowerCase().includes('not confirmed');

        if (isUnverified) {
          const friendlyError = getFriendlyAuthError(signInError, 'login');
          setError({
            ...friendlyError,
            type: 'unverified',
          });
        } else {
          const friendlyError = getFriendlyAuthError(signInError, 'login');
          setError({
            ...friendlyError,
            type: 'invalid',
          });
        }
      } else {
        console.log('Sign in successful');
      }
    } catch (err: any) {
      console.log('Network error or exception during sign in');
      const friendlyError = getFriendlyAuthError(err, 'login');
      setError({
        ...friendlyError,
        type: 'invalid',
      });
    } finally {
      setLoading(false);
    }
  };

  const emailResentText = '✓ Verification email sent! Check your inbox.';
  const resendButtonText = 'Resend verification email';

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

          {showSuccessMessage && successMessage && (
            <View style={styles.successMessage}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          )}

          {error && error.type === 'invalid' && (
            <View style={styles.errorMessage}>
              <Text style={styles.errorTitle}>{error.title}</Text>
              <Text style={styles.errorBody}>{error.body}</Text>
              <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
                <Text style={styles.forgotPasswordInError}>Forgot password?</Text>
              </Pressable>
            </View>
          )}

          {error && error.type === 'unverified' && (
            <View style={styles.unverifiedMessage}>
              <Text style={styles.unverifiedTitle}>{error.title}</Text>
              <Text style={styles.unverifiedBody}>{error.body}</Text>
              <Pressable
                style={styles.resendButton}
                onPress={handleResendVerification}
                disabled={resendingEmail}
              >
                {resendingEmail ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.resendButtonText}>{resendButtonText}</Text>
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
