
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { supabase } from '@/integrations/supabase/client';
import { getFriendlyAuthError } from '@/utils/authErrorMessages';

export default function ResetPasswordOTPScreen() {
  const params = useLocalSearchParams();
  const passedEmail = (params.email as string) || '';

  const [email, setEmail] = useState(passedEmail);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ title: string; body: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🔍 DEBUG STATE - Always visible
  const [debugInfo, setDebugInfo] = useState({
    lastAction: 'idle',
    lastSupabaseCall: null as string | null,
    success: null as boolean | null,
    error: null as string | null,
    returnedSessionExists: null as boolean | null,
    timestamp: '',
  });

  const handleResetPassword = async () => {
    console.log('User tapped Reset Password button');
    
    // 🔍 CHECKPOINT 1: Starting
    setDebugInfo({
      lastAction: 'verifying_code',
      lastSupabaseCall: null,
      success: null,
      error: null,
      returnedSessionExists: null,
      timestamp: new Date().toISOString(),
    });
    setError(null);

    // Validation
    if (!email) {
      setDebugInfo(prev => ({
        ...prev,
        lastSupabaseCall: 'verifyOtp',
        success: false,
        error: 'Email is required.',
        lastAction: 'verify_failed',
      }));
      setError({
        title: 'Email required',
        body: 'Please enter your email address.',
      });
      return;
    }

    if (!otpCode) {
      setDebugInfo(prev => ({
        ...prev,
        lastSupabaseCall: 'verifyOtp',
        success: false,
        error: 'Code is required.',
        lastAction: 'verify_failed',
      }));
      setError({
        title: 'Code required',
        body: 'Please enter the reset code from your email.',
      });
      return;
    }

    if (otpCode.length < 6 || otpCode.length > 10) {
      setDebugInfo(prev => ({
        ...prev,
        lastSupabaseCall: 'verifyOtp',
        success: false,
        error: 'Code must be 6-10 digits.',
        lastAction: 'verify_failed',
      }));
      setError({
        title: 'Invalid code',
        body: 'The code must be 6-10 digits.',
      });
      return;
    }

    if (!newPassword) {
      setDebugInfo(prev => ({
        ...prev,
        lastSupabaseCall: 'verifyOtp',
        success: false,
        error: 'Password is required.',
        lastAction: 'verify_failed',
      }));
      setError({
        title: 'Password required',
        body: 'Please enter a new password.',
      });
      return;
    }

    if (newPassword.length < 8) {
      setDebugInfo(prev => ({
        ...prev,
        lastSupabaseCall: 'verifyOtp',
        success: false,
        error: 'Password must be at least 8 characters.',
        lastAction: 'verify_failed',
      }));
      setError({
        title: 'Password too short',
        body: 'Password must be at least 8 characters.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setDebugInfo(prev => ({
        ...prev,
        lastSupabaseCall: 'verifyOtp',
        success: false,
        error: 'Passwords do not match.',
        lastAction: 'verify_failed',
      }));
      setError({
        title: 'Passwords do not match',
        body: 'Please make sure both passwords match.',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('=== STEP 1: Verifying OTP ===');
      console.log('Email:', email);
      console.log('OTP Code:', otpCode);
      console.log('Using Supabase SDK: supabase.auth.verifyOtp()');

      // 🔍 CHECKPOINT 2: Calling verifyOtp
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode,
        type: 'recovery',
      });

      if (verifyError) {
        // 🔍 CHECKPOINT 3: OTP verification failed
        console.log('❌ OTP verification failed:', verifyError);
        setDebugInfo(prev => ({
          ...prev,
          lastSupabaseCall: 'verifyOtp',
          success: false,
          error: verifyError.message,
          returnedSessionExists: false,
          lastAction: 'verify_failed',
        }));
        
        setError({
          title: 'Invalid or expired code',
          body: 'The code you entered is invalid or has expired. Please request a new code.',
        });
        setLoading(false);
        return;
      }

      // 🔍 CHECKPOINT 4: Check if session exists
      const sessionExists = !!verifyData.session;
      console.log('Session exists:', sessionExists);

      if (!sessionExists) {
        // 🔍 CHECKPOINT 4a: verifyOtp succeeded but no session
        console.log('⚠️ verifyOtp succeeded but no session returned');
        setDebugInfo(prev => ({
          ...prev,
          lastSupabaseCall: 'verifyOtp',
          success: true,
          error: 'verifyOtp succeeded but no session returned',
          returnedSessionExists: false,
          lastAction: 'verify_failed',
        }));
        
        setError({
          title: 'Session error',
          body: 'OTP verified but no session was created. Please try again or contact support.',
        });
        setLoading(false);
        return;
      }

      // 🔍 CHECKPOINT 5: OTP verified successfully with session
      console.log('✅ OTP verified successfully with session');
      setDebugInfo(prev => ({
        ...prev,
        lastSupabaseCall: 'verifyOtp',
        success: true,
        error: null,
        returnedSessionExists: true,
        lastAction: 'updating_password',
      }));

      console.log('=== STEP 2: Updating Password ===');
      console.log('Using Supabase SDK: supabase.auth.updateUser()');

      // 🔍 CHECKPOINT 6: Calling updateUser
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        // 🔍 CHECKPOINT 7: Password update failed
        console.log('❌ Password update failed:', updateError);
        setDebugInfo(prev => ({
          ...prev,
          lastSupabaseCall: 'updateUser',
          success: false,
          error: updateError.message,
          lastAction: 'update_failed',
        }));
        
        const friendlyError = getFriendlyAuthError(updateError, 'reset');
        setError({
          title: friendlyError.title,
          body: friendlyError.body,
        });
        setLoading(false);
        return;
      }

      // 🔍 CHECKPOINT 8: Password updated successfully
      console.log('✅ Password updated successfully');
      setDebugInfo(prev => ({
        ...prev,
        lastSupabaseCall: 'updateUser',
        success: true,
        error: null,
        lastAction: 'done',
      }));

      // Optional: Sign out to ensure clean login flow
      console.log('Signing out to ensure clean login flow');
      await supabase.auth.signOut();

      // Show success message and navigate to login
      setLoading(false);
      
      // Navigate to login with success message
      router.replace({
        pathname: '/(auth)/login',
        params: { 
          message: 'Password updated. Please sign in.',
        },
      });

    } catch (err: any) {
      // 🔍 CHECKPOINT 9: Network/unexpected error
      console.log('❌ Unexpected error during password reset:', err);
      setDebugInfo(prev => ({
        ...prev,
        lastSupabaseCall: prev.lastSupabaseCall || 'unknown',
        success: false,
        error: err.message || 'Network error',
        lastAction: 'update_failed',
      }));
      
      setError({
        title: 'Connection issue',
        body: 'We could not reach our server. Please try again in a moment.',
      });
      setLoading(false);
    }
  };

  const titleText = 'Reset your password';
  const emailLabelText = 'Email';
  const codeLabelText = 'Reset code (8 digits)';
  const newPasswordLabelText = 'New Password';
  const confirmPasswordLabelText = 'Confirm Password';
  const buttonText = 'Reset Password';
  const backText = 'Back';

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
          <Text style={styles.debugText}>returnedSessionExists: {debugInfo.returnedSessionExists !== null ? String(debugInfo.returnedSessionExists) : 'null'}</Text>
        </View>

        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <IconSymbol 
              ios_icon_name="lock.shield.fill"
              android_material_icon_name="lock"
              size={60}
              color={colors.primary}
            />
          </View>
          <Text style={styles.title}>{titleText}</Text>
          <Text style={styles.subtitle}>Enter the code from your email and choose a new password</Text>
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{codeLabelText}</Text>
            <TextInput
              style={[styles.input, styles.codeInput, error && styles.inputError]}
              placeholder="Enter 8-digit code"
              placeholderTextColor={colors.textSecondary}
              value={otpCode}
              onChangeText={(text) => {
                // Only allow numbers and limit to 10 digits
                const numericText = text.replace(/[^0-9]/g, '').slice(0, 10);
                setOtpCode(numericText);
                if (error) setError(null);
              }}
              keyboardType="number-pad"
              maxLength={10}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{newPasswordLabelText}</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, error && styles.inputError]}
                placeholder="Enter new password"
                placeholderTextColor={colors.textSecondary}
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  if (error) setError(null);
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              <Pressable 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <IconSymbol 
                  ios_icon_name={showPassword ? "eye.slash.fill" : "eye.fill"}
                  android_material_icon_name={showPassword ? "visibility-off" : "visibility"}
                  size={24}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{confirmPasswordLabelText}</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, error && styles.inputError]}
                placeholder="Confirm new password"
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (error) setError(null);
                }}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              <Pressable 
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <IconSymbol 
                  ios_icon_name={showConfirmPassword ? "eye.slash.fill" : "eye.fill"}
                  android_material_icon_name={showConfirmPassword ? "visibility-off" : "visibility"}
                  size={24}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          <Pressable 
            style={({ pressed }) => [
              buttonStyles.primary,
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
              <Text style={buttonStyles.primaryText}>{buttonText}</Text>
            )}
          </Pressable>

          <View style={styles.toggleContainer}>
            <Pressable 
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.toggleLink}>{backText}</Text>
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
  codeInput: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 4,
    textAlign: 'center',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    paddingRight: 50,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
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
