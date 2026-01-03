
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, commonStyles, buttonStyles } from "@/styles/commonStyles";
import { supabase } from "@/integrations/supabase/client";

export default function VerifyEmailScreen() {
  const { user, signOut } = useSupabaseAuth();
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleResendEmail = async () => {
    try {
      setResending(true);
      
      if (!user?.email) {
        Alert.alert("Error", "No email address found");
        return;
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) {
        console.error('Resend error:', error);
        Alert.alert("Error", error.message || "Failed to resend verification email");
      } else {
        Alert.alert(
          "Email Sent",
          "A new verification email has been sent. Please check your inbox and spam folder."
        );
      }
    } catch (error: any) {
      console.error('Resend error:', error);
      Alert.alert("Error", error.message || "Failed to resend verification email");
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      setChecking(true);
      
      // Refresh the session to get the latest email verification status
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        Alert.alert("Error", "Failed to check verification status");
        return;
      }

      // Check if email is now verified
      if (data.session?.user?.email_confirmed_at) {
        Alert.alert(
          "Email Verified! ✅",
          "Your email has been verified. You can now access the app.",
          [
            {
              text: "Continue",
              onPress: () => router.replace("/(tabs)"),
            },
          ]
        );
      } else {
        Alert.alert(
          "Not Verified Yet",
          "Please click the verification link in your email. Check your spam folder if you don't see it."
        );
      }
    } catch (error: any) {
      console.error('Check verification error:', error);
      Alert.alert("Error", "Failed to check verification status");
    } finally {
      setChecking(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch (error: any) {
      console.error('Sign out error:', error);
      Alert.alert("Error", "Failed to sign out");
    }
  };

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
            <Text style={buttonStyles.buttonText}>I&apos;ve Verified My Email</Text>
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
    marginBottom: 32,
    lineHeight: 24,
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
