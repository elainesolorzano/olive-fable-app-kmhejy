
/**
 * Reset Password Screen
 * 
 * Allows users to set a new password after clicking the reset link in their email.
 * This screen is accessed via the callback handler after the recovery session is established.
 * 
 * CRITICAL: This screen requires an active Supabase session (established via setSession in callback.tsx)
 * to allow password updates. Without a valid session, the user will see an error.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { supabase } from '@/integrations/supabase/client';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { getFriendlyAuthError, AUTH_SUCCESS_MESSAGES } from '@/utils/authErrorMessages';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ title: string; body: string } | null>(null);
  const [success, setSuccess] = useState(false);
  const [validatingSession, setValidatingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);

  useEffect(() => {
    validateResetSession();
  }, []);

  const validateResetSession = async () => {
    console.log('=== Validating Password Reset Session ===');
    
    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('Session check result:');
      console.log('- Session exists:', !!session);
      console.log('- Session error:', sessionError?.message);
      
      if (sessionError) {
        console.log('❌ Session error:', sessionError.message);
        setHasValidSession(false);
        setError({
          title: 'Invalid or expired link',
          body: 'This password reset link has expired or is invalid. Please request a new one.',
        });
      } else if (!session) {
        console.log('❌ No session found - user must use reset link');
        setHasValidSession(false);
        setError({
          title: 'Invalid or expired link',
          body: 'This password reset link has expired or is invalid. Please request a new one.',
        });
      } else {
        console.log('✅ Valid reset session found');
        console.log('User email:', session.user.email);
        console.log('Session expires at:', session.expires_at);
        setHasValidSession(true);
      }
    } catch (err) {
      console.log('❌ Error validating reset session:', err);
      setHasValidSession(false);
      setError({
        title: 'Invalid or expired link',
        body: 'This password reset link has expired or is invalid. Please request a new one.',
      });
    } finally {
      setValidatingSession(false);
    }
  };

  const handleResetPassword = async () => {
    console.log('User tapped Save New Password button');
    setError(null);

    // Validation
    if (!password || !confirmPassword) {
      setError({
        title: 'Missing information',
        body: 'Please enter and confirm your new password.',
      });
      return;
    }

    if (password.length < 8) {
      setError({
        title: 'Password too short',
        body: 'Please use a password with at least 8 characters.',
      });
      return;
    }

    if (password !== confirmPassword) {
      setError({
        title: 'Passwords do not match',
        body: 'Please make sure both passwords are the same.',
      });
      return;
    }

    // Double-check session before attempting update
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log('❌ No session found when attempting password update');
      setError({
        title: 'Invalid or expired link',
        body: 'Your session has expired. Please request a new password reset link.',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('=== Updating User Password ===');
      console.log('Current session user:', session.user.email);
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        console.log('❌ Password update error:', updateError.message);
        const friendlyError = getFriendlyAuthError(updateError, 'resetPassword');
        setError(friendlyError);
      } else {
        console.log('✅ Password reset successful');
        setSuccess(true);
        
        // Sign out the user after password reset
        console.log('Signing out user after password reset');
        await supabase.auth.signOut();
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.replace('/(auth)/login');
        }, 2000);
      }
    } catch (err: any) {
      console.log('❌ Unexpected error during password reset:', err);
      const friendlyError = getFriendlyAuthError(err, 'resetPassword');
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const titleText = 'Reset password';
  const subtitleText = 'Enter your new password below';
  const passwordLabelText = 'New Password';
  const confirmPasswordLabelText = 'Confirm Password';
  const buttonText = 'Save new password';
  const backToLoginText = 'Return to Sign In';

  if (validatingSession) {
    return (
      <View style={commonStyles.container}>
        <Stack.Screen 
          options={{
            headerShown: true,
            title: 'Reset Password',
            headerBackTitle: 'Back',
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Validating reset link...</Text>
        </View>
      </View>
    );
  }

  if (!hasValidSession) {
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
                ios_icon_name="exclamationmark.triangle.fill"
                android_material_icon_name="warning"
                size={60}
                color="#F59E0B"
              />
            </View>
            <Text style={styles.title}>{error?.title}</Text>
            <Text style={styles.subtitle}>{error?.body}</Text>
          </View>

          <Pressable 
            style={buttonStyles.primaryButton}
            onPress={() => router.replace('/(auth)/forgot-password')}
          >
            <Text style={buttonStyles.buttonText}>Request New Link</Text>
          </Pressable>

          <View style={styles.toggleContainer}>
            <Pressable onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.toggleLink}>{backToLoginText}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (success) {
    const successTitle = AUTH_SUCCESS_MESSAGES.resetPassword.title;
    const successBody = AUTH_SUCCESS_MESSAGES.resetPassword.body;

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

          <View style={styles.successMessage}>
            <Text style={styles.redirectText}>Redirecting to sign in...</Text>
          </View>

          <Pressable 
            style={buttonStyles.primaryButton}
            onPress={() => router.replace('/(auth)/login')}
          >
            <Text style={buttonStyles.buttonText}>{backToLoginText}</Text>
          </Pressable>
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
            <Text style={styles.label}>{passwordLabelText}</Text>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Minimum 8 characters"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError(null);
              }}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{confirmPasswordLabelText}</Text>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Re-enter your new password"
              placeholderTextColor={colors.textSecondary}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (error) setError(null);
              }}
              secureTextEntry
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
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
  successMessage: {
    backgroundColor: '#10B98115',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  redirectText: {
    fontSize: 14,
    color: '#059669',
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
