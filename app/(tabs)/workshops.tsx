
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
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, buttonStyles } from '@/styles/commonStyles';

interface WorkshopFeature {
  id: string;
  title: string;
  description: string;
}

const TAB_BAR_HEIGHT = 80;

const workshopFeatures: WorkshopFeature[] = [
  {
    id: '1',
    title: 'Better Photos',
    description: 'Easy tips for posing, lighting, and getting your pet attention',
  },
  {
    id: '2',
    title: 'Deeper Connection',
    description: 'Learn to see your pet through a new lens—literally and emotionally',
  },
  {
    id: '3',
    title: 'Early Access',
    description: 'Members get first access when workshops launch',
  },
];

export default function WorkshopsScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleJoinWaitlist = async () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');

    const subject = encodeURIComponent('Workshop Waitlist');
    const body = encodeURIComponent(`I would like to join the workshop waitlist.\n\nEmail: ${email}`);
    const mailtoUrl = `mailto:info@oliveandfable.com?subject=${subject}&body=${body}`;

    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
        Alert.alert('Success', 'Opening your email app...');
      } else {
        Alert.alert(
          'Cannot Open Mail',
          'Please email info@oliveandfable.com directly to join the waitlist.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Please email info@oliveandfable.com directly to join the waitlist.',
        [{ text: 'OK' }]
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
        <View style={styles.badge}>
          <Text style={styles.badgeText}>COMING SOON</Text>
        </View>

        <Text style={styles.title}>Workshops</Text>

        <Text style={styles.intro}>
          Something exciting is coming. Workshops for pet parents who want better photos and deeper connection.
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
            placeholder="Enter your email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        <Pressable
          style={[
            buttonStyles.primary,
            styles.button,
            !validateEmail(email) && styles.buttonDisabled,
          ]}
          onPress={handleJoinWaitlist}
          disabled={!validateEmail(email)}
        >
          <Text style={buttonStyles.primaryText}>Notify Me When Workshops Launch</Text>
        </Pressable>

        <Pressable style={[buttonStyles.secondary, styles.button]}>
          <Text style={buttonStyles.secondaryText}>Join Membership for Early Access</Text>
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
    padding: 24,
  },
  contentContainerWithTabBar: {
    paddingBottom: TAB_BAR_HEIGHT + 24,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 24,
  },
  badgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  intro: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 32,
  },
  featureCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
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
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: colors.text,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 8,
  },
  button: {
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
