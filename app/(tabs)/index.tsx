
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Logo } from '@/components/Logo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  welcomeSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  signature: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.textSecondary,
    marginTop: 12,
  },
  featuredTip: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  tipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tipTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.9)',
  },
  ctaSection: {
    gap: 12,
    marginBottom: 24,
  },
  ctaButton: {
    ...buttonStyles.primary,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ctaButtonText: {
    ...buttonStyles.primaryText,
    color: colors.text,
  },
  quickLinks: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  linkContent: {
    flex: 1,
    marginLeft: 12,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  linkDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default function HomeScreen() {
  const { user } = useSupabaseAuth();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Logo size="medium" />
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            {user ? `Welcome back!` : 'Welcome to Olive & Fable'}
          </Text>
          <Text style={styles.welcomeText}>
            Hi, I'm Gemma — CEO, treat tester, and quality control. This is where pet parents learn how to pose, prep, and create beautiful portraits.
          </Text>
          <Text style={styles.signature}>— Gemma 🐾</Text>
        </View>

        <View style={styles.featuredTip}>
          <Text style={styles.tipLabel}>Featured Tip</Text>
          <Text style={styles.tipTitle}>The Perfect Sit</Text>
          <Text style={styles.tipText}>
            Get your pup's attention with a treat held just above eye level. This creates natural engagement and those soulful eyes we love.
          </Text>
        </View>

        <View style={styles.ctaSection}>
          {!user && (
            <Pressable
              style={({ pressed }) => [
                buttonStyles.primary,
                pressed && buttonStyles.primaryPressed,
              ]}
              onPress={() => router.push('/(auth)/sign-up')}
            >
              <Text style={buttonStyles.primaryText}>Join The Club</Text>
            </Pressable>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => router.push('/(tabs)/book')}
          >
            <Text style={styles.ctaButtonText}>Book a Session</Text>
          </Pressable>
        </View>

        <View style={styles.quickLinks}>
          <Text style={styles.sectionTitle}>Quick Links</Text>

          <Pressable
            style={({ pressed }) => [
              styles.linkCard,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => router.push('/(tabs)/learn')}
          >
            <IconSymbol ios_icon_name="book.fill" android_material_icon_name="menu-book" size={24} color={colors.primary} />
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Learn</Text>
              <Text style={styles.linkDescription}>Posing tips & session prep</Text>
            </View>
            <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.linkCard,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => router.push('/(tabs)/workshops')}
          >
            <IconSymbol ios_icon_name="star.fill" android_material_icon_name="star" size={24} color={colors.primary} />
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Workshops</Text>
              <Text style={styles.linkDescription}>Coming soon</Text>
            </View>
            <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
