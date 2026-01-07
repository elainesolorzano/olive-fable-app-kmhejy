
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  TextInput, 
  Platform,
  Linking 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';

interface WorkshopFeature {
  id: string;
  icon: string;
  iosIcon: string;
  title: string;
  description: string;
}

const TAB_BAR_HEIGHT = Platform.select({ ios: 83, android: 60, default: 60 });

const workshopFeatures: WorkshopFeature[] = [
  {
    id: '1',
    icon: 'camera',
    iosIcon: 'camera.fill',
    title: 'For Pet Parents: Better Photos',
    description: "Easy tips for posing, lighting, and getting your pet's attention—using your phone or camera.",
  },
  {
    id: '2',
    icon: 'palette',
    iosIcon: 'paintpalette.fill',
    title: 'For Photographers: Styling + Set Design',
    description: 'Learn backdrops, props, color stories, and how to create consistent luxury looks.',
  },
  {
    id: '3',
    icon: 'edit',
    iosIcon: 'slider.horizontal.3',
    title: 'Editing + Retouching',
    description: 'Step-by-step workflows in Lightroom/Photoshop for clean, timeless, client-ready images.',
  },
  {
    id: '4',
    icon: 'people',
    iosIcon: 'person.3.fill',
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
    paddingBottom: TAB_BAR_HEIGHT + 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  comingSoonBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.background,
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 26,
    marginBottom: 32,
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  waitlistSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  inputError: {
    borderColor: '#E63946',
  },
  errorText: {
    fontSize: 14,
    color: '#E63946',
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4,
  },
  successText: {
    fontSize: 14,
    color: colors.accent,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4,
  },
  primaryButton: {
    ...buttonStyles.primary,
    marginBottom: 16,
  },
  primaryButtonText: {
    ...buttonStyles.primaryText,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '600',
  },
  fallbackText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default function WorkshopsScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [smsError, setSmsError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleJoinWaitlist = async () => {
    setEmailError('');
    setSuccessMessage('');
    setSmsError('');

    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return;
    }

    if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }

    const to = 'hello@oliveandfable.com';
    const subject = 'Workshops Waitlist';
    const body = `Please add me to the Olive & Fable Workshops waitlist.\n\nEmail: ${email.trim()}\nI am a: Pet Parent / Photographer / Both (choose one)\n(Optional) What I want to learn: `;

    const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
        setEmail('');
        setSuccessMessage('Check your email app to send your request 💚');
      } else {
        setEmailError(`Couldn't open your mail app. Copy this email: ${to}`);
      }
    } catch (error) {
      setEmailError(`Couldn't open your mail app. Copy this email: ${to}`);
    }
  };

  const handleTextMeTheLink = async () => {
    setEmailError('');
    setSuccessMessage('');
    setSmsError('');

    const message = 'Send me the Olive & Fable Workshops waitlist link';
    const smsUrl = Platform.select({
      ios: `sms:&body=${encodeURIComponent(message)}`,
      android: `sms:?body=${encodeURIComponent(message)}`,
      default: `sms:?body=${encodeURIComponent(message)}`,
    });

    try {
      const canOpen = await Linking.canOpenURL(smsUrl);
      if (canOpen) {
        await Linking.openURL(smsUrl);
      } else {
        setSmsError("Couldn't open SMS. Text \"workshops\" to your preferred number.");
      }
    } catch (error) {
      setSmsError("Couldn't open SMS. Text \"workshops\" to your preferred number.");
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>COMING SOON</Text>
          </View>
          
          <Text style={styles.title}>Workshops</Text>
          
          <Text style={styles.subtitle}>
            Workshops are launching soon. Join the waitlist to get early access + launch perks.
          </Text>
          
          <Text style={styles.description}>
            Workshops are coming soon for pet parents who want better everyday photos and photographers who want to level up styling, lighting, editing, and client-ready workflow.
          </Text>
        </View>

        <View style={styles.featuresSection}>
          {workshopFeatures.map((feature) => (
            <View key={feature.id} style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <IconSymbol
                  name={Platform.OS === 'ios' ? feature.iosIcon : feature.icon}
                  size={24}
                  color={colors.accent}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.waitlistSection}>
          <Text style={styles.sectionTitle}>Join the Waitlist</Text>
          
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="Your email address"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
              setSuccessMessage('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
          
          <Pressable 
            style={styles.primaryButton}
            onPress={handleJoinWaitlist}
          >
            <Text style={styles.primaryButtonText}>Join the Workshops Waitlist</Text>
          </Pressable>
          
          <Pressable 
            style={styles.secondaryButton}
            onPress={handleTextMeTheLink}
          >
            <Text style={styles.secondaryButtonText}>Text me the link instead</Text>
          </Pressable>
          
          {smsError ? <Text style={styles.fallbackText}>{smsError}</Text> : null}
        </View>
      </ScrollView>
    </View>
  );
}
