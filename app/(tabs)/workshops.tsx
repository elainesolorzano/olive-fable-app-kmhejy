
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WorkshopFeature {
  id: string;
  title: string;
  description: string;
}

const TAB_BAR_HEIGHT = 80;

const workshopFeatures: WorkshopFeature[] = [
  {
    id: 'pet-parents',
    title: 'For Pet Parents: Better Photos',
    description: 'Easy tips for posing, lighting, and getting your pet\'s attention - using your phone or camera.',
  },
  {
    id: 'styling-design',
    title: 'For Photographers: Styling + Set Design',
    description: 'Learn backdrops, props, color stories, and how to create consistent luxury looks.',
  },
  {
    id: 'editing',
    title: 'Editing + Retouching',
    description: 'Step-by-step workflows in Lightroom/Photoshop for clean, timeless, client-ready images.',
  },
  {
    id: 'community',
    title: 'Community + Critiques',
    description: 'Connect with others, get feedback, and learn what sells in fine-art pet portraiture.',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: TAB_BAR_HEIGHT + 40,
  },
  comingSoonBadge: {
    alignSelf: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  waitlistSection: {
    marginTop: 32,
    padding: 24,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  waitlistTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  waitlistSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  button: {
    ...buttonStyles.primary,
    marginTop: 8,
  },
  buttonDisabled: {
    ...buttonStyles.primary,
    backgroundColor: colors.border,
    marginTop: 8,
  },
  buttonText: {
    ...buttonStyles.primaryText,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: -8,
    marginBottom: 8,
  },
});

export default function WorkshopsScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleJoinWaitlist = async () => {
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    const timestamp = new Date().toLocaleString();
    const subject = encodeURIComponent('Olive & Fable Workshops Waitlist');
    const body = encodeURIComponent(
      `Email: ${email}\nTimestamp: ${timestamp}\n\nI'd like to join the waitlist for Olive & Fable workshops.`
    );
    const mailtoUrl = `mailto:info@oliveandfable.com?subject=${subject}&body=${body}`;

    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
        setEmail('');
      } else {
        Alert.alert(
          'Email Not Available',
          `Please email us directly at info@oliveandfable.com with your email address: ${email}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Unable to Open Email',
        `Please send an email to info@oliveandfable.com with your email address: ${email}`,
        [{ text: 'OK' }]
      );
    }
  };

  const isEmailValid = email.trim() && validateEmail(email);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>COMING SOON</Text>
        </View>

        <Text style={styles.title}>Workshops</Text>

        <Text style={styles.description}>
          Workshops are coming soon for pet parents who want better everyday photos and photographers who want to level up styling, lighting, editing, and client-ready workflows. Join the waitlist to get early access and launch perks.
        </Text>

        {workshopFeatures.map((feature) => (
          <View key={feature.id} style={styles.featureCard}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
        ))}

        <View style={styles.waitlistSection}>
          <Text style={styles.waitlistTitle}>Join the Waitlist</Text>
          <Text style={styles.waitlistSubtitle}>
            Be the first to know when workshops launch
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <Pressable
            style={isEmailValid ? styles.button : styles.buttonDisabled}
            onPress={handleJoinWaitlist}
            disabled={!isEmailValid}
          >
            <Text style={styles.buttonText}>Join Waitlist</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
