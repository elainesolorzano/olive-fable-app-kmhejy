
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export default function ResetPasswordOTPScreen() {
  const params = useLocalSearchParams();
  const passedEmail = (params.email as string) || '';

  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ title: string; body: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = async () => {
    console.log('User tapped Update Password button');
    setError(null);

    // Validation
    if (!otpCode) {
      setError({
        title: 'Code required',
        body: 'Please enter the reset code from your email.',
      });
      return;
    }

    if (otpCode.length < 6 || otpCode.length > 8) {
      setError({
        title: 'Invalid code',
        body: 'The code must be 6-8 digits.',
      });
      return;
    }

    if (!newPassword) {
      setError({
        title: 'Password required',
        body: 'Please enter a new password.',
      });
      return;
    }

    if (newPassword.length < 8) {
      setError({
        title: 'Password too short',
        body: 'Password must be at least 8 characters.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setError({
        title: 'Passwords do not match',
        body: 'Please make sure both passwords match.',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('=== STEP A: Verifying OTP ===');
      console.log('Email:', passedEmail);
      console.log('OTP Code:', otpCode);
      console.log('Using Supabase REST API: /auth/v1/verify');

      // STEP A: Verify OTP
      const verifyResponse = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'recovery',
          email: passedEmail,
          token: otpCode,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        console.log('❌ OTP verification failed:', verifyData);
        setError({
          title: 'Invalid or expired code',
          body: 'The code you entered is invalid or has expired. Please request a new code.',
        });
        setLoading(false);
        return;
      }

      console.log('✅ OTP verified successfully');
      
      const accessToken = verifyData.access_token;
      const refreshToken = verifyData.refresh_token;

      if (!accessToken) {
        console.log('❌ No access token in verify response');
        setError({
          title: 'Verification failed',
          body: 'Could not verify your code. Please try again.',
        });
        setLoading(false);
        return;
      }

      console.log('=== STEP B: Updating Password ===');
      console.log('Using access token from OTP verification');
      console.log('Using Supabase REST API: /auth/v1/user');

      // STEP B: Update password
      const updateResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method: 'PUT',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      });

      const updateData = await updateResponse.json();

      if (!updateResponse.ok) {
        console.log('❌ Password update failed:', updateData);
        setError({
          title: 'Password update failed',
          body: updateData.error_description || updateData.msg || 'Could not update your password. Please try again.',
        });
        setLoading(false);
        return;
      }

      console.log('✅ Password updated successfully');

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
      console.log('❌ Unexpected error during password reset:', err);
      setError({
        title: 'Connection issue',
        body: 'We could not reach our server. Please try again in a moment.',
      });
      setLoading(false);
    }
  };

  const titleText = 'Enter Reset Code';
  const emailLabelText = 'Email';
  const codeLabelText = 'Reset code';
  const newPasswordLabelText = 'New Password';
  const confirmPasswordLabelText = 'Confirm Password';
  const buttonText = 'Update Password';
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
            <View style={styles.readOnlyInput}>
              <Text style={styles.readOnlyText}>{passedEmail}</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{codeLabelText}</Text>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Enter code"
              placeholderTextColor={colors.textSecondary}
              value={otpCode}
              onChangeText={(text) => {
                // Only allow numbers and limit to 8 digits
                const numericText = text.replace(/[^0-9]/g, '').slice(0, 8);
                setOtpCode(numericText);
                if (error) setError(null);
              }}
              keyboardType="number-pad"
              maxLength={8}
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
  inputError: {
    borderColor: '#DC2626',
  },
  readOnlyInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.accent,
    opacity: 0.6,
  },
  readOnlyText: {
    fontSize: 16,
    color: colors.text,
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
