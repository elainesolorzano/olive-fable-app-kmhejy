
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { getFriendlyAuthError } from '@/utils/authErrorMessages';
import { supabase } from '@/integrations/supabase/client';

const BUILD_INFO = `Build: ${new Date().toLocaleString()} | Env: production`;

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ title: string; body: string } | null>(null);
  const [success, setSuccess] = useState(false);

  // 🔍 DEBUG STATE - Always visible
  const [debugInfo, setDebugInfo] = useState({
    lastAction: 'idle',
    lastSupabaseCall: null as string | null,
    success: null as boolean | null,
    error: null as string | null,
    returnedSessionExists: null as boolean | null,
    timestamp: '',
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendResetCode = async () => {
    console.log('User tapped Send Reset Code button');
    
    // 🔍 CHECKPOINT 1: Starting
    setDebugInfo({
      lastAction: 'sending_code',
      lastSupabaseCall: null,
      success: null,
      error: null,
      returnedSessionExists: null,
      timestamp: new Date().toISOString(),
    });
    setError(null);

    if (!email) {
      setDebugInfo(prev => ({
        ...prev,
        lastSupabaseCall: 'resetPasswordForEmail',
        success: false,
        error: 'Email is required.',
        lastAction: 'send_failed',
      }));
      setError({
        title: 'Email required',
        body: 'Please enter your email address.',
      });
      return;
    }

    if (!validateEmail(email)) {
      setDebugInfo(prev => ({
        ...prev,
        lastSupabaseCall: 'resetPasswordForEmail',
        success: false,
        error: 'Invalid email format.',
        lastAction: 'send_failed',
      }));
      setError({
        title: 'Invalid email',
        body: 'Please enter a valid email address.',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('=== Requesting Password Reset OTP ===');
      console.log('Email:', email);
      console.log('Using Supabase SDK: supabase.auth.resetPasswordForEmail()');
      
      // 🔍 CHECKPOINT 2: Calling Supabase
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim());

      if (resetError) {
        // 🔍 CHECKPOINT 3: Error from Supabase
        console.log('❌ Password reset OTP request error:', resetError);
        setDebugInfo(prev => ({
          ...prev,
          lastSupabaseCall: 'resetPasswordForEmail',
          success: false,
          error: resetError.message,
          lastAction: 'send_failed',
        }));
        
        const friendlyError = getFriendlyAuthError(resetError, 'reset');
        setError({
          title: friendlyError.title,
          body: friendlyError.body,
        });
      } else {
        // 🔍 CHECKPOINT 4: Success from Supabase
        console.log('✅ Password reset OTP email sent successfully');
        setDebugInfo(prev => ({
          ...prev,
          lastSupabaseCall: 'resetPasswordForEmail',
          success: true,
          error: null,
          lastAction: 'send_success',
        }));
        setSuccess(true);
      }
    } catch (err: any) {
      // 🔍 CHECKPOINT 5: Network/unexpected error
      console.log('❌ Unexpected error during password reset OTP request:', err);
      setDebugInfo(prev => ({
        ...prev,
        lastSupabaseCall: 'resetPasswordForEmail',
        success: false,
        error: err.message || 'Network error',
        lastAction: 'send_failed',
      }));
      
      setError({
        title: 'Connection issue',
        body: 'We could not reach our server. Please try again in a moment.',
      });
    } finally {
      setLoading(false);
    }
  };

  const titleText = 'Reset your password';
  const subtitleText = 'Enter your email address and we will send you a code to reset your password';
  const emailLabelText = 'Email Address';
  const buttonText = 'Send reset code';
  const backToLoginText = 'Back to Sign In';

  if (success) {
    const successTitle = 'Check your email';
    const successBody = 'We have sent you a reset code. Enter the code on the next screen to reset your password.';

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
          {/* 🔍 DEBUG PANEL - Always visible */}
          <View style={styles.debugPanel}>
            <Text style={styles.debugTitle}>🔍 Auth Debug Panel</Text>
            <Text style={styles.debugText}>lastAction: {debugInfo.lastAction}</Text>
            <Text style={styles.debugText}>lastSupabaseCall: {debugInfo.lastSupabaseCall || 'null'}</Text>
            <Text style={styles.debugText}>success: {debugInfo.success !== null ? String(debugInfo.success) : 'null'}</Text>
            <Text style={styles.debugText}>error: {debugInfo.error || 'null'}</Text>
            <Text style={styles.debugText}>returnedSessionExists: {debugInfo.returnedSessionExists !== null ? String(debugInfo.returnedSessionExists) : 'N/A'}</Text>
          </View>

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
            <View style={styles.infoRow}>
              <IconSymbol 
                ios_icon_name="clock.fill"
                android_material_icon_name="schedule"
                size={20}
                color="#059669"
              />
              <Text style={styles.infoText}>The code will expire in 1 hour</Text>
            </View>
            <View style={styles.infoRow}>
              <IconSymbol 
                ios_icon_name="exclamationmark.circle.fill"
                android_material_icon_name="info"
                size={20}
                color="#059669"
              />
              <Text style={styles.infoText}>Each code can only be used once</Text>
            </View>
            <View style={styles.infoRow}>
              <IconSymbol 
                ios_icon_name="envelope.fill"
                android_material_icon_name="email"
                size={20}
                color="#059669"
              />
              <Text style={styles.infoText}>Check your spam folder if you don&apos;t see it</Text>
            </View>
          </View>

          <Pressable 
            style={buttonStyles.primary}
            onPress={() => {
              console.log('Navigating to OTP verification screen with email:', email);
              router.push({
                pathname: '/(auth)/reset-password-otp',
                params: { email: email.trim() },
              });
            }}
          >
            <Text style={buttonStyles.primaryText}>I have a code</Text>
          </Pressable>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>Didn&apos;t receive the code? </Text>
            <Pressable onPress={() => setSuccess(false)}>
              <Text style={styles.toggleLink}>Try again</Text>
            </Pressable>
          </View>

          {/* 🔍 BUILD INFO FOOTER */}
          <View style={styles.buildInfo}>
            <Text style={styles.buildInfoText}>{BUILD_INFO}</Text>
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
        {/* 🔍 DEBUG PANEL - Always visible */}
        <View style={styles.debugPanel}>
          <Text style={styles.debugTitle}>🔍 Auth Debug Panel</Text>
          <Text style={styles.debugText}>lastAction: {debugInfo.lastAction}</Text>
          <Text style={styles.debugText}>lastSupabaseCall: {debugInfo.lastSupabaseCall || 'null'}</Text>
          <Text style={styles.debugText}>success: {debugInfo.success !== null ? String(debugInfo.success) : 'null'}</Text>
          <Text style={styles.debugText}>error: {debugInfo.error || 'null'}</Text>
          <Text style={styles.debugText}>returnedSessionExists: {debugInfo.returnedSessionExists !== null ? String(debugInfo.returnedSessionExists) : 'N/A'}</Text>
        </View>

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
              buttonStyles.primary,
              styles.submitButton,
              pressed && styles.pressed,
              loading && styles.disabled
            ]}
            onPress={handleSendResetCode}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={buttonStyles.primaryText}>{buttonText}</Text>
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

        {/* 🔍 BUILD INFO FOOTER */}
        <View style={styles.buildInfo}>
          <Text style={styles.buildInfoText}>{BUILD_INFO}</Text>
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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  debugPanel: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 12,
  },
  debugText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#D1D5DB',
    marginBottom: 6,
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
    lineHeight: 24,
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
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    flex: 1,
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
  buildInfo: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  buildInfoText: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});
