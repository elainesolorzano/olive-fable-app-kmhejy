
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 64;

// Data structures with stable unique IDs to prevent React key warnings
const selectionProcessSteps = [
  { id: 'step-1', text: 'View your fully retouched portraits' },
  { id: 'step-2', text: 'Choose favorites and refine your final set' },
  { id: 'step-3', text: 'Explore sizes and products that fit your space' },
  { id: 'step-4', text: 'Finalize your order and delivery timeline' },
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
  gemmaNote: {
    fontSize: 15,
    color: colors.textTertiary,
    fontStyle: 'italic',
    lineHeight: 22,
    paddingLeft: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
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
          <Text style={styles.gemmaNote}>
            Gemma's tip: bring your measurements — it makes choosing artwork effortless.
          </Text>
        </View>

        {/* Section 1: What to Expect */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What to Expect</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>The Reveal Experience</Text>
            <Text style={styles.cardBody}>
              Your reveal is where everything comes together. You'll see your portraits for the first time, narrow favorites, and design artwork that fits your home beautifully.
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
