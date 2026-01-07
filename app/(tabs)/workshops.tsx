
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, buttonStyles } from '@/styles/commonStyles';

interface WorkshopFeature {
  id: string;
  title: string;
  description: string;
}

const TAB_BAR_HEIGHT = 80;

export default function WorkshopsScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const workshopFeatures: WorkshopFeature[] = [
    {
      id: 'pet-parents',
      title: 'For Pet Parents: Better Photos',
      description: 'Easy tips for posing, lighting, and getting your pet's attention—using your phone or camera.',
    },
    {
      id: 'styling',
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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isButtonDisabled = !validateEmail(email.trim());

  const handleJoinWaitlist = async () => {
    setEmailError(null);
    setSuccessMessage(null);

    if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }

    const to = 'info@oliveandfable.com';
    const subject = 'Olive & Fable Workshops Waitlist';
    const timestamp = new Date().toISOString();
    const body = `Email: ${email.trim()}\nTimestamp: ${timestamp}`;
    const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
        setEmail('');
        setSuccessMessage('Check your email app to send your request 💚');
      } else {
        Alert.alert(
          'Email App Not Found',
          `Couldn't open your mail app. Please email us directly at ${to}.`
        );
      }
    } catch (error) {
      Alert.alert(
        'Email Error',
        `Couldn't open your mail app. Please email us directly at ${to}.`
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar,
        ]}
      >
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>COMING SOON</Text>
        </View>

        <Text style={styles.title}>Workshops</Text>

        <Text style={styles.introText}>
          Workshops are coming soon for pet parents who want better everyday photos and photographers who want to level up styling, lighting, editing, and client-ready workflows. Join the waitlist to get early access and launch perks.
        </Text>

        <View style={styles.featuresContainer}>
          {workshopFeatures.map((feature) => (
            <View key={feature.id} style={styles.featureCard}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Your email address"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}
          {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
        </View>

        <Pressable
          style={[
            buttonStyles.primary,
            styles.primaryButton,
            isButtonDisabled && styles.disabledButton,
          ]}
          onPress={handleJoinWaitlist}
          disabled={isButtonDisabled}
        >
          <Text style={buttonStyles.primaryText}>Join the Workshops Waitlist</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: TAB_BAR_HEIGHT + 20,
  },
  comingSoonBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  comingSoonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  introText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureCard: {
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.backgroundAlt,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 8,
  },
  successText: {
    color: colors.success,
    fontSize: 14,
    marginTop: 8,
  },
  primaryButton: {
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
