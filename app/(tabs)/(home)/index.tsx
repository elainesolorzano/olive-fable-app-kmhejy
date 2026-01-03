
import React from 'react';
import { Logo } from '@/components/Logo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { GemmaMessage } from '@/components/GemmaMessage';

const TAB_BAR_HEIGHT = 60;

export default function ClientLoungeScreen() {
  const { user } = useSupabaseAuth();
  const insets = useSafeAreaInsets();

  // Calculate bottom padding: tab bar height + safe area bottom + extra spacing
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 24;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Logo size="medium" />
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Welcome to the Olive & Fable Client Lounge
          </Text>
          <Text style={styles.introText}>
            Your exclusive space for session preparation, studio information, and everything you need to create beautiful portraits with your pet.
          </Text>
        </View>

        <GemmaMessage style={styles.gemmaSection}>
          <Text style={styles.gemmaText}>
            Welcome to your Client Lounge! I&apos;ve gathered everything you need to prepare for your session. From finding the studio to getting your pup camera-ready, it&apos;s all here.
          </Text>
          <Text style={styles.signature}>— Gemma 🐾</Text>
        </GemmaMessage>

        <View style={styles.startHereSection}>
          <Text style={styles.sectionTitle}>Start Here</Text>
          <Text style={styles.sectionSubtitle}>
            Essential guides to prepare for your Olive & Fable experience
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.primaryCard,
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => router.push('/(tabs)/(home)/getting-to-studio')}
          >
            <View style={styles.cardIconContainer}>
              <IconSymbol 
                ios_icon_name="map.fill" 
                android_material_icon_name="place" 
                size={28} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Getting to the Studio</Text>
              <Text style={styles.cardDescription}>
                Location, parking, and what to expect when you arrive
              </Text>
            </View>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right" 
              size={24} 
              color={colors.textSecondary} 
            />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.primaryCard,
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => router.push('/(tabs)/(home)/session-prep')}
          >
            <View style={styles.cardIconContainer}>
              <IconSymbol 
                ios_icon_name="camera.fill" 
                android_material_icon_name="camera" 
                size={28} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Session Preparation Guide</Text>
              <Text style={styles.cardDescription}>
                How to prepare your pet for a successful photo session
              </Text>
            </View>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right" 
              size={24} 
              color={colors.textSecondary} 
            />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.primaryCard,
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => router.push('/(tabs)/(home)/reveal-prep')}
          >
            <View style={styles.cardIconContainer}>
              <IconSymbol 
                ios_icon_name="photo.fill" 
                android_material_icon_name="image" 
                size={28} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Reveal Preparation Guide</Text>
              <Text style={styles.cardDescription}>
                What to expect at your gallery reveal appointment
              </Text>
            </View>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right" 
              size={24} 
              color={colors.textSecondary} 
            />
          </Pressable>
        </View>

        <View style={styles.quickAccessSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryCard,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => router.push('/(tabs)/learn')}
          >
            <IconSymbol 
              ios_icon_name="book.fill" 
              android_material_icon_name="menu-book" 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Learn</Text>
              <Text style={styles.linkDescription}>Posing tips & photography guides</Text>
            </View>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right" 
              size={20} 
              color={colors.textSecondary} 
            />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryCard,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => router.push('/(tabs)/book')}
          >
            <IconSymbol 
              ios_icon_name="calendar" 
              android_material_icon_name="event" 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Book a Session</Text>
              <Text style={styles.linkDescription}>Schedule your portrait session</Text>
            </View>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right" 
              size={20} 
              color={colors.textSecondary} 
            />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    // paddingBottom handled dynamically
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
    lineHeight: 36,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  gemmaSection: {
    marginBottom: 32,
  },
  gemmaText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#111F0F',
  },
  signature: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#111F0F',
    marginTop: 12,
  },
  startHereSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  primaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  quickAccessSection: {
    marginBottom: 24,
  },
  secondaryCard: {
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
