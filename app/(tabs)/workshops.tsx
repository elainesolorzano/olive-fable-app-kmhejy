
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator, TextInput, Platform } from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

interface WorkshopFeature {
  id: string;
  icon: string;
  iosIcon: string;
  title: string;
  description: string;
}

const TAB_BAR_HEIGHT = 60;

const workshopFeatures: WorkshopFeature[] = [
  {
    id: 'prep',
    icon: 'pets',
    iosIcon: 'pawprint.fill',
    title: 'Pet Posing Mastery',
    description: 'Learn professional techniques to capture your pet\'s personality',
  },
  {
    id: 'lighting',
    icon: 'wb-sunny',
    iosIcon: 'sun.max.fill',
    title: 'Natural Lighting',
    description: 'Master the art of using natural light for stunning portraits',
  },
  {
    id: 'editing',
    icon: 'photo-filter',
    iosIcon: 'wand.and.stars',
    title: 'Photo Editing',
    description: 'Transform your photos with simple editing techniques',
  },
  {
    id: 'connection',
    icon: 'favorite',
    iosIcon: 'heart.fill',
    title: 'Deeper Connection',
    description: 'Build trust and connection with your pet through photography',
  },
];

export default function WorkshopsScreen() {
  const insets = useSafeAreaInsets();
  const { session } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate bottom padding: tab bar height + safe area bottom + extra spacing
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 24;

  const handleJoinWaitlist = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address to join the waitlist.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Backend Integration - Save email to waitlist table
      console.log('Joining waitlist with email:', email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      Alert.alert(
        'Success!',
        'You\'ve been added to the workshop waitlist. We\'ll notify you when workshops launch!',
        [{ text: 'OK', onPress: () => setEmail('') }]
      );
    } catch (error) {
      console.error('Error joining waitlist:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={commonStyles.container} pointerEvents="auto">
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: bottomPadding }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Workshops</Text>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={[commonStyles.card, styles.heroCard]}>
          <IconSymbol 
            ios_icon_name="sparkles"
            android_material_icon_name="auto-awesome"
            size={48}
            color={colors.primary}
            style={styles.heroIcon}
          />
          <Text style={styles.heroTitle}>Something Exciting is Coming</Text>
          <Text style={styles.heroDescription}>
            Workshops for pet parents who want better photos and deeper connection with their furry friends.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What You&apos;ll Learn</Text>
          {workshopFeatures.map((feature) => (
            <View
              key={feature.id}
              style={styles.featureCard}
            >
              <View style={styles.featureIconContainer}>
                <IconSymbol 
                  ios_icon_name={feature.iosIcon}
                  android_material_icon_name={feature.icon}
                  size={28}
                  color={colors.primary}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Waitlist Section */}
        <View style={[commonStyles.card, styles.waitlistCard]}>
          <Text style={commonStyles.cardTitle}>Join the Waitlist</Text>
          <Text style={commonStyles.cardText}>
            Be the first to know when workshops launch. We&apos;ll send you all the details!
          </Text>
          
          <TextInput
            style={styles.emailInput}
            placeholder="Enter your email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
          />

          <Pressable 
            style={({ pressed }) => [
              buttonStyles.primaryButton,
              pressed && styles.pressed,
              isSubmitting && styles.disabled
            ]}
            onPress={handleJoinWaitlist}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.card} />
            ) : (
              <Text style={buttonStyles.buttonText}>Notify Me When Workshops Launch</Text>
            )}
          </Pressable>
        </View>

        {/* Membership CTA */}
        <View style={[commonStyles.card, styles.membershipCard]}>
          <IconSymbol 
            ios_icon_name="star.fill"
            android_material_icon_name="star"
            size={32}
            color={colors.accent}
            style={styles.membershipIcon}
          />
          <Text style={commonStyles.cardTitle}>Get Early Access</Text>
          <Text style={commonStyles.cardText}>
            Members of The Olive & Fable Club will get exclusive early access to all workshops, plus special member pricing.
          </Text>
          <Pressable 
            style={({ pressed }) => [
              buttonStyles.secondaryButton,
              pressed && styles.pressed
            ]}
            onPress={() => {
              Alert.alert(
                'Membership',
                'Membership features coming soon! Join the waitlist to be notified.',
                [{ text: 'OK' }]
              );
            }}
          >
            <Text style={buttonStyles.secondaryButtonText}>Learn About Membership</Text>
          </Pressable>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    // paddingBottom handled dynamically
  },
  header: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  comingSoonBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroCard: {
    alignItems: 'center',
    backgroundColor: colors.highlight,
    marginBottom: 32,
  },
  heroIcon: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  waitlistCard: {
    marginBottom: 16,
  },
  emailInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginTop: 16,
    marginBottom: 16,
  },
  membershipCard: {
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
  },
  membershipIcon: {
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
});
