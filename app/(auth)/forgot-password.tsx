
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
    const trimmedEmail = email.trim().toLowerCase();

    setError(null);
    setSuccess(false);

    if (!trimmedEmail) {
      setError({
        title: 'Email required',
        body: 'Please enter your email address.',
      });
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError({
        title: 'Invalid email',
        body: 'Please enter a valid email address.',
      });
      return;
    }

    setLoading(true);

    try {
      // CRITICAL: Use the deep link that opens directly to the reset password screen
      // This ensures the email link contains redirect_to=oliveandfable%3A%2F%2Freset-password
      const redirectUrl = 'oliveandfable://reset-password';
      
      console.log('Sending password reset email to:', trimmedEmail);
      console.log('Redirect URL (deep link):', redirectUrl);
      console.log('Expected email link format: redirect_to=oliveandfable%3A%2F%2Freset-password');

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: redirectUrl,
      });

      if (resetError) {
        console.log('Password reset error:', resetError.message);
        const friendlyError = getFriendlyAuthError(resetError, 'forgotPassword');
        setError(friendlyError);
      } else {
        console.log('Password reset email sent successfully');
        console.log('✅ Check your email - the link should contain: redirect_to=oliveandfable%3A%2F%2Freset-password');
        setSuccess(true);
      }
    } catch (err: any) {
      console.log('Unexpected error during password reset:', err);
      const friendlyError = getFriendlyAuthError(err, 'forgotPassword');
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const titleText = 'Forgot Password?';
  const subtitleText = 'Enter your email address and we will send you a link to reset your password';
  const emailLabelText = 'Email';
  const buttonText = 'Send Reset Link';
  const rememberPasswordText = 'Remember your password?';
  const signInText = 'Sign In';
  const infoText = 'If you do not receive an email within a few minutes, please check your spam folder or try again.';

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

        {success && (
          <View style={styles.successMessage}>
            <Text style={styles.successTitle}>{successTitle}</Text>
            <Text style={styles.successBody}>{successBody}</Text>
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
                if (success) setSuccess(false);
              }}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              editable={!loading}
              returnKeyType="done"
              onSubmitEditing={handleResetPassword}
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
            <Text style={styles.toggleText}>{rememberPasswordText}</Text>
            <Pressable 
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.toggleLink}>{signInText}</Text>
            </Pressable>
          </View>
        </View>

        <View style={[commonStyles.card, styles.infoCard]}>
          <IconSymbol 
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.infoText}>{infoText}</Text>
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
  successMessage: {
    backgroundColor: '#10B98115',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
  },
  successBody: {
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
    gap: 6,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  toggleLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
});
