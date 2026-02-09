
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  ScrollView, 
  ActivityIndicator, 
  useWindowDimensions 
} from 'react-native';
import { router } from 'expo-router';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Logo } from '@/components/Logo';
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
    color: colors.textSecondary,
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
    height: 50,
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
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    marginTop: 6,
  },
  signUpButton: {
    ...buttonStyles.primary,
    marginTop: 8,
    marginBottom: 16,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    ...buttonStyles.primaryText,
  },
  successMessage: {
    backgroundColor: '#10B98115',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  errorMessage: {
    backgroundColor: '#DC262615',
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signInText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  signInLink: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  continueButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: '#111F0F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: { title: string; body: string };
  }>({});

  const { signUp } = useSupabaseAuth();
  const { height } = useWindowDimensions();

  const isSmallPhone = height < 750;
  const logoToTitleGap = isSmallPhone ? 14 : 28;
  const topPadding = isSmallPhone ? 22 : 40;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    console.log('User tapped Sign Up button');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { error: signUpError } = await signUp(email, password, name);

      if (signUpError) {
        console.log('Sign up error:', signUpError.message);
        const friendlyError = getFriendlyAuthError(signUpError, 'signup');
        setErrors({ general: friendlyError });
      } else {
        console.log('Sign up successful - showing success message');
        setShowSuccess(true);
      }
    } catch (err: any) {
      console.log('Sign up exception');
      const friendlyError = getFriendlyAuthError(err, 'signup');
      setErrors({ general: friendlyError });
    } finally {
      setLoading(false);
    }
  };

  const successTitleText = '✓ Account Created Successfully!';
  const successDescriptionText = 'We have sent a verification email to your inbox. Please check your email and click the verification link to activate your account.';
  const continueButtonText = 'Continue to Sign In';

  if (showSuccess) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: topPadding }]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={[styles.logoWrapper, { marginBottom: logoToTitleGap }]}>
            <Logo size="large" />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Check Your Email</Text>
            
            <View style={styles.successMessage}>
              <Text style={styles.successTitle}>{successTitleText}</Text>
              <Text style={styles.successText}>{successDescriptionText}</Text>
            </View>

            <Pressable
              style={styles.continueButton}
              onPress={() => {
                console.log('User tapped Continue to Sign In');
                router.replace('/(auth)/login');
              }}
            >
              <Text style={styles.continueButtonText}>{continueButtonText}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Olive & Fable Studio</Text>

          {errors.general && (
            <View style={styles.errorMessage}>
              <Text style={styles.errorTitle}>{errors.general.title}</Text>
              <Text style={styles.errorDescription}>{errors.general.body}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Your name"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              autoCapitalize="words"
              editable={!loading}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="your@email.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Minimum 8 characters"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput
              style={[styles.input, errors.confirmPassword && styles.inputError]}
              placeholder="Re-enter your password"
              placeholderTextColor={colors.textSecondary}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
              }}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          <Pressable
            style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            )}
          </Pressable>

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <Pressable onPress={() => router.push('/(auth)/login')} disabled={loading}>
              <Text style={styles.signInLink}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
