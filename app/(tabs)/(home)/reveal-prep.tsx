
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Linking, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 64;

// Data structures with stable unique IDs to prevent React key warnings
const selectionProcessSteps = [
  { id: 'step-1', text: 'View your carefully curated gallery for the first time' },
  { id: 'step-2', text: 'Narrow down your favorites with our guidance' },
  { id: 'step-3', text: 'Choose your artwork and sizes that fit your home' },
  { id: 'step-4', text: 'Select any digital files and heirloom products you'd love to take home' },
  { id: 'step-5', text: 'Finalize your order and review delivery timing' },
];

const revealTips = [
  { id: 'tip-1', text: 'Bring measurements or photos of your wall space' },
  { id: 'tip-2', text: 'Consider bringing a partner for a second opinion' },
  { id: 'tip-3', text: 'Think about which rooms you want to feature your portraits' },
  { id: 'tip-4', text: 'Trust your instincts — choose what feels like you' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subheader: {
    fontSize: 17,
    color: colors.textSecondary,
    lineHeight: 26,
    marginBottom: 16,
  },
  gemmaCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  gemmaAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.border,
  },
  gemmaTextContainer: {
    flex: 1,
  },
  gemmaText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  cardBody: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  bulletList: {
    marginTop: 4,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    flex: 1,
  },
  ctaContainer: {
    marginTop: 8,
    marginBottom: 24,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  secondaryLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryLinkText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default function RevealPrepScreen() {
  const insets = useSafeAreaInsets();

  const handleViewProductGuide = async () => {
    console.log('User tapped View Product Guide button');
    try {
      await WebBrowser.openBrowserAsync('https://www.oliveandfable.com/products');
    } catch (error) {
      console.error('Error opening product guide:', error);
    }
  };

  const handleContactUs = async () => {
    console.log('User tapped Contact Us link');
    const mailtoUrl = 'mailto:info@oliveandfable.com?subject=Question%20About%20Reveal%20Appointment';
    try {
      await Linking.openURL(mailtoUrl);
    } catch (error) {
      console.error('Error opening email client:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 32 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Hero */}
        <View style={styles.header}>
          <Text style={styles.title}>Reveal Preparation</Text>
          <Text style={styles.subheader}>
            Everything you need to feel relaxed, confident, and excited for your portrait reveal.
          </Text>
        </View>

        {/* Gemma Intro Card */}
        <View style={styles.gemmaCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop' }}
            style={styles.gemmaAvatar}
          />
          <View style={styles.gemmaTextContainer}>
            <Text style={styles.gemmaText}>
              The reveal is one of my favorite moments. You'll see your carefully curated gallery for the first time, and together we'll choose the artwork and products that feel most like you.
            </Text>
          </View>
        </View>

        {/* Section 1: What to Expect */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What to Expect</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>The Gallery Reveal</Text>
            <Text style={styles.cardBody}>
              One to two weeks after your session, we'll meet on Zoom for your gallery reveal. This is where the magic comes together. You'll see your curated set of images for the first time, and we'll walk through each portrait so you can choose your favorite artwork pieces, digital files, and any heirloom products you'd love to bring home.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Duration</Text>
            <Text style={styles.cardBody}>
              Plan for 60–90 minutes. This gives you time to view images, explore artwork options, and make thoughtful selections.
            </Text>
          </View>
        </View>

        {/* Section 2: Selection Process */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selection Process</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>How It Works</Text>
            <View style={styles.bulletList}>
              {selectionProcessSteps.map((step) => (
                <View key={step.id} style={styles.bulletItem}>
                  <Text style={styles.bulletText}>• {step.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Section 3: Tips for Your Reveal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips for Your Reveal</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Make the Most of It</Text>
            <View style={styles.bulletList}>
              {revealTips.map((tip) => (
                <View key={tip.id} style={styles.bulletItem}>
                  <Text style={styles.bulletText}>• {tip.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* CTA Area */}
        <View style={styles.ctaContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && { opacity: 0.85 }
            ]}
            onPress={handleViewProductGuide}
          >
            <Text style={styles.primaryButtonText}>View Product Guide</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryLink}
            onPress={handleContactUs}
          >
            <Text style={styles.secondaryLinkText}>Questions? Contact Us</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
