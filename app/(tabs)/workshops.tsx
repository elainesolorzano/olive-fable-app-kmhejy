
import React, { useState } from 'react';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator, TextInput, Platform } from 'react-native';

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
    title: 'Better Photos',
    description: 'Learn professional techniques for capturing stunning pet portraits'
  },
  {
    id: '2',
    icon: 'favorite',
    iosIcon: 'heart.fill',
    title: 'Deeper Connection',
    description: 'Build a stronger bond through mindful photography sessions'
  },
  {
    id: '3',
    icon: 'school',
    iosIcon: 'book.fill',
    title: 'Expert Guidance',
    description: 'Get personalized tips from professional pet photographers'
  }
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
    paddingTop: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  featureDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  ctaSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  ctaCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonContainer: {
    gap: 12,
  },
});

export default function WorkshopsScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinWaitlist = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success!',
        'You\'ve been added to the waitlist. We\'ll notify you when workshops launch.',
        [{ text: 'OK', onPress: () => setEmail('') }]
      );
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ paddingTop: insets.top }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Workshops</Text>
          <Text style={styles.subtitle}>
            Something exciting is coming. Workshops for pet parents who want better photos and deeper connection.
          </Text>
        </View>

        <View style={styles.featuresSection}>
          {workshopFeatures.map((feature) => (
            <View key={feature.id} style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <IconSymbol
                  ios_icon_name={feature.iosIcon}
                  android_material_icon_name={feature.icon}
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.featureTitle}>{feature.title}</Text>
              </View>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.ctaSection}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Be the First to Know</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Pressable
                style={[buttonStyles.primary, isLoading && { opacity: 0.6 }]}
                onPress={handleJoinWaitlist}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={buttonStyles.primaryText}>Notify Me When Workshops Launch</Text>
                )}
              </Pressable>

              <Pressable style={buttonStyles.secondary}>
                <Text style={buttonStyles.secondaryText}>Join Membership for Early Access</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
