
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
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

interface WorkshopFeature {
  id: string;
  icon: string;
  iosIcon: string;
  title: string;
  description: string;
}

const TAB_BAR_HEIGHT = 80;

const workshopFeatures: WorkshopFeature[] = [
  {
    id: '1',
    icon: 'camera',
    iosIcon: 'camera.fill',
    title: 'For Pet Parents: Better Photos',
    description: 'Easy tips for posing, lighting, and getting your pet's attention—using your phone or camera.',
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
    icon: 'group',
    iosIcon: 'person.3.fill',
    title: 'Community + Critiques',
    description: 'Connect with others, get feedback, and learn what sells in fine-art pet portraiture.',
  },
];

export default function WorkshopsScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [smsError, setSmsError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleJoinWaitlist = async () => {
    // Reset all messages
    setEmailError(null);
    setSuccessMessage(null);
    setSmsError(null);

    // Validate email
    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return;
    }

    if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Construct mailto URL
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
      console.log('Error opening mail app:', error);
      setEmailError(`Couldn't open your mail app. Copy this email: ${to}`);
    }
  };

  const handleTextMeTheLink = async () => {
    // Reset messages
    setEmailError(null);
    setSuccessMessage(null);
    setSmsError(null);

    const message = 'Send me the Olive & Fable Workshops waitlist link';
    const smsUrl = Platform.OS === 'ios' ? `sms:&body=${encodeURIComponent(message)}` : `sms:?body=${encodeURIComponent(message)}`;

    try {
      const canOpen = await Linking.canOpenURL(smsUrl);
      if (canOpen) {
        await Linking.openURL(smsUrl);
      } else {
        setSmsError('Couldn\'t open SMS. Please email hello@oliveandfable.com instead.');
      }
    } catch (error) {
      console.log('Error opening SMS app:', error);
      setSmsError('Couldn\'t open SMS. Please email hello@oliveandfable.com instead.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top + 20, paddingBottom: TAB_BAR_HEIGHT + 40 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Coming Soon Badge */}
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>COMING SOON</Text>
        </View>

        {/* Header */}
        <Text style={styles.title}>Workshops</Text>
        <Text style={styles.subtitle}>
          Workshops are launching soon. Join the waitlist to get early access + launch perks.
        </Text>

        {/* Intro Text */}
        <Text style={styles.introText}>
          Workshops are coming soon for pet parents who want better everyday photos and photographers who want to level up styling, lighting, editing, and client-ready workflow.
        </Text>

        {/* Feature Cards */}
        <View style={styles.featuresContainer}>
          {workshopFeatures.map((feature) => (
            <View key={feature.id} style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <IconSymbol
                  ios_icon_name={feature.iosIcon}
                  android_material_icon_name={feature.icon}
                  size={24}
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

        {/* Waitlist Signup */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupLabel}>Join the Waitlist</Text>
          <TextInput
            style={styles.emailInput}
            placeholder="your@email.com"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(null);
              setSuccessMessage(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          {emailError && (
            <Text style={styles.errorText}>{emailError}</Text>
          )}
          
          {successMessage && (
            <Text style={styles.successText}>{successMessage}</Text>
          )}

          <Pressable
            style={({ pressed }) => [
              buttonStyles.primary,
              styles.joinButton,
              pressed && buttonStyles.primaryPressed
            ]}
            onPress={handleJoinWaitlist}
          >
            <Text style={buttonStyles.primaryText}>Join the Workshops Waitlist</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.textButton,
              pressed && styles.textButtonPressed
            ]}
            onPress={handleTextMeTheLink}
          >
            <Text style={styles.textButtonText}>Text me the link instead</Text>
          </Pressable>

          {smsError && (
            <Text style={styles.errorText}>{smsError}</Text>
          )}
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
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
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  introText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}15`,
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
  signupContainer: {
    marginBottom: 32,
  },
  signupLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  emailInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  joinButton: {
    marginBottom: 16,
  },
  textButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  textButtonPressed: {
    opacity: 0.6,
  },
  textButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    marginTop: -8,
    marginBottom: 12,
  },
  successText: {
    fontSize: 14,
    color: '#059669',
    marginTop: -8,
    marginBottom: 12,
  },
});
