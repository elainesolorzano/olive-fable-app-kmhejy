
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GemmaMessage } from '@/components/GemmaMessage';

const TAB_BAR_HEIGHT = 60;

interface SessionType {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  features: string[];
}

const sessionTypes: SessionType[] = [
  {
    id: '1',
    title: 'Classic Portrait',
    description: 'Our signature pet portrait experience',
    duration: '60 minutes',
    price: 'Starting at $350',
    features: [
      'Professional studio or outdoor location',
      'Multiple poses and setups',
      '20+ edited images',
      'Online gallery access',
    ],
  },
  {
    id: '2',
    title: 'Mini Session',
    description: 'Perfect for quick updates or gift portraits',
    duration: '30 minutes',
    price: 'Starting at $200',
    features: [
      'Studio or local park',
      '2-3 poses',
      '10+ edited images',
      'Online gallery access',
    ],
  },
  {
    id: '3',
    title: 'Luxury Experience',
    description: 'The ultimate pet portrait session',
    duration: '90 minutes',
    price: 'Starting at $550',
    features: [
      'Premium location of your choice',
      'Unlimited poses and setups',
      '40+ edited images',
      'Printed album included',
      'Priority scheduling',
    ],
  },
];

export default function BookScreen() {
  const insets = useSafeAreaInsets();

  // Calculate bottom padding: tab bar height + safe area bottom + extra spacing
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 24;

  const handleBooking = () => {
    console.log('Book with Olive & Fable button pressed - opening external URL');
    Linking.openURL('https://example.com');
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
          <Text style={commonStyles.title}>Book Your Session</Text>
          <Text style={styles.subtitle}>
            Choose the perfect portrait experience for you and your pet
          </Text>
        </View>

        {/* Gemma Quote */}
        <GemmaMessage style={styles.gemmaMessage}>
          <Text style={styles.quoteText}>
            I don&apos;t take bookings myself (paws, no thumbs), but my humans do.
          </Text>
          <Text style={styles.quoteAuthor}>— Gemma, CEO</Text>
        </GemmaMessage>

        {/* Session Types */}
        {sessionTypes.map((session, sessionIndex) => (
          <View key={`session-${session.id}-${sessionIndex}`} style={commonStyles.card}>
            <View style={styles.sessionHeader}>
              <View>
                <Text style={commonStyles.cardTitle}>{session.title}</Text>
                <Text style={styles.sessionPrice}>{session.price}</Text>
              </View>
              <View style={styles.durationBadge}>
                <IconSymbol 
                  ios_icon_name="clock.fill"
                  android_material_icon_name="schedule"
                  size={16}
                  color={colors.primary}
                />
                <Text style={styles.durationText}>{session.duration}</Text>
              </View>
            </View>
            
            <Text style={[commonStyles.cardText, styles.sessionDescription]}>
              {session.description}
            </Text>

            <View style={styles.featuresContainer}>
              {session.features.map((feature, featureIndex) => (
                <View key={`session-${session.id}-feature-${featureIndex}`} style={styles.featureItem}>
                  <IconSymbol 
                    ios_icon_name="checkmark.circle.fill"
                    android_material_icon_name="check-circle"
                    size={18}
                    color={colors.secondary}
                  />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Booking CTA */}
        <View style={[commonStyles.card, styles.ctaCard]}>
          <IconSymbol 
            ios_icon_name="calendar.badge.plus"
            android_material_icon_name="event"
            size={40}
            color={colors.primary}
            style={styles.ctaIcon}
          />
          <Text style={commonStyles.cardTitle}>Ready to Book?</Text>
          <Text style={commonStyles.cardText}>
            Let&apos;s create beautiful memories together. Click below to schedule your session.
          </Text>
          <Pressable 
            style={({ pressed }) => [
              buttonStyles.primaryButton,
              pressed && styles.pressed
            ]}
            onPress={handleBooking}
          >
            <Text style={buttonStyles.buttonText}>Book with Olive & Fable</Text>
          </Pressable>
        </View>

        {/* What to Expect */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>What to Expect</Text>
          <View style={styles.expectationItem}>
            <Text style={styles.expectationNumber}>1</Text>
            <View style={styles.expectationText}>
              <Text style={styles.expectationTitle}>Choose Your Session</Text>
              <Text style={commonStyles.cardText}>Select the package that fits your needs</Text>
            </View>
          </View>
          <View style={styles.expectationItem}>
            <Text style={styles.expectationNumber}>2</Text>
            <View style={styles.expectationText}>
              <Text style={styles.expectationTitle}>Prepare Your Pet</Text>
              <Text style={commonStyles.cardText}>Follow our prep guides for best results</Text>
            </View>
          </View>
          <View style={styles.expectationItem}>
            <Text style={styles.expectationNumber}>3</Text>
            <View style={styles.expectationText}>
              <Text style={styles.expectationTitle}>Enjoy the Session</Text>
              <Text style={commonStyles.cardText}>Relax and let us capture the magic</Text>
            </View>
          </View>
          <View style={styles.expectationItem}>
            <Text style={styles.expectationNumber}>4</Text>
            <View style={styles.expectationText}>
              <Text style={styles.expectationTitle}>Receive Your Gallery</Text>
              <Text style={commonStyles.cardText}>View and download your beautiful portraits</Text>
            </View>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    // paddingBottom handled dynamically
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 24,
    marginTop: 8,
  },
  gemmaMessage: {
    marginBottom: 24,
  },
  quoteText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111F0F',
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111F0F',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 4,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  sessionDescription: {
    marginBottom: 16,
  },
  featuresContainer: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text,
    marginLeft: 10,
    flex: 1,
  },
  ctaCard: {
    alignItems: 'center',
    backgroundColor: colors.accent,
  },
  ctaIcon: {
    marginBottom: 16,
  },
  expectationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  expectationNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    color: colors.card,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 12,
  },
  expectationText: {
    flex: 1,
  },
  expectationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  pressed: {
    opacity: 0.7,
  },
});
