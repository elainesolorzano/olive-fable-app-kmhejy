
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, commonStyles, buttonStyles } from "@/styles/commonStyles";
import { supabase } from "@/integrations/supabase/client";

export default function VerifyEmailScreen() {
  const { user, signOut, refreshAuthAndUser } = useSupabaseAuth();
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [emailResent, setEmailResent] = useState(false);

  const handleResendEmail = async () => {
    console.log('User tapped Resend Verification Email');
    try {
      setResending(true);
      setEmailResent(false);
      
      if (!user?.email) {
        console.error('No email address found');
        return;
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: "https://oliveandfable.com/appconfirmed",
        },
      });

      if (error) {
        console.error('Resend error:', error);
      } else {
        console.log('Verification email resent successfully');
        setEmailResent(true);
      }
    } catch (error: any) {
      console.error('Resend error:', error);
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    console.log('User tapped "I already verified" button');
    try {
      setChecking(true);
      
      // Use the new refreshAuthAndUser function to get latest auth state
      await refreshAuthAndUser();
      
      // After refresh, check if email is now verified
      const { data: { user: freshUser } } = await supabase.auth.getUser();
      
      if (freshUser?.email_confirmed_at) {
        console.log('Email verified successfully, redirecting to tabs');
        router.replace("/(tabs)");
      } else {
        console.log('Email not yet verified');
        // Show a brief message that verification hasn't been detected yet
        setEmailResent(false);
      }
    } catch (error: any) {
      console.error('Check verification error:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleSignOut = async () => {
    console.log('User tapped Sign Out');
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch (error: any) {
      console.error('Sign out error:', error);
    }
  };

  const emailResentText = '✓ Verification email sent! Check your inbox.';
  const alreadyVerifiedButtonText = "I already verified";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.iconContainer}>
        <IconSymbol 
          ios_icon_name="envelope.badge"
          android_material_icon_name="email"
          size={80} 
          color={colors.primary} 
        />
      </View>

      <Text style={styles.title}>Verify Your Email</Text>
      
      <Text style={styles.description}>
        We&apos;ve sent a verification email to:
      </Text>
      
      <Text style={styles.email}>{user?.email}</Text>

      <Text style={styles.instructions}>
        Please check your inbox and click the verification link to activate your account.
      </Text>

      {emailResent && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>{emailResentText}</Text>
        </View>
      )}

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Can&apos;t find the email?</Text>
        <Text style={styles.tip}>• Check your spam or junk folder</Text>
        <Text style={styles.tip}>• Make sure {user?.email} is correct</Text>
        <Text style={styles.tip}>• Wait a few minutes for the email to arrive</Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          buttonStyles.primaryButton,
          styles.button,
          pressed && styles.pressed,
          checking && styles.disabled
        ]}
        onPress={handleCheckVerification}
        disabled={checking}
      >
        {checking ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <IconSymbol 
              ios_icon_name="checkmark.circle"
              android_material_icon_name="check-circle"
              size={20} 
              color="#fff" 
            />
            <Text style={buttonStyles.buttonText}>{alreadyVerifiedButtonText}</Text>
          </>
        )}
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          buttonStyles.outlineButton,
          styles.button,
          pressed && styles.pressed,
          resending && styles.disabled
        ]}
        onPress={handleResendEmail}
        disabled={resending}
      >
        {resending ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            <IconSymbol 
              ios_icon_name="arrow.clockwise"
              android_material_icon_name="refresh"
              size={20} 
              color={colors.primary} 
            />
            <Text style={buttonStyles.outlineButtonText}>Resend Verification Email</Text>
          </>
        )}
      </Pressable>

      <Pressable style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100%",
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 8,
  },
  email: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 24,
    textAlign: "center",
  },
  instructions: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  successMessage: {
    backgroundColor: '#10B98115',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  successText: {
    fontSize: 15,
    color: '#059669',
    textAlign: 'center',
  },
  tipsContainer: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  tip: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  button: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  signOutButton: {
    marginTop: 16,
    padding: 12,
  },
  signOutText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
});
