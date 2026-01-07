
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
    description: 'Build a stronger bond with your pet through photography'
  },
  {
    id: '3',
    icon: 'school',
    iosIcon: 'book.fill',
    title: 'Expert Guidance',
    description: 'Get tips and tricks from professional pet photographers'
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
  },
  subtitle: {
    fontSize: 17,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  featureCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  featureDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  waitlistSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  waitlistCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 24,
  },
  waitlistTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  waitlistText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
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
      Alert.alert('Success!', 'You\'ve been added to the workshop waitlist');
      setEmail('');
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
            <React.Fragment key={feature.id}>
              <View style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <IconSymbol
                    ios_icon_name={feature.iosIcon}
                    android_material_icon_name={feature.icon}
                    size={24}
                    color={colors.primary}
                    style={styles.featureIcon}
                  />
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                </View>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        <View style={styles.waitlistSection}>
          <View style={styles.waitlistCard}>
            <Text style={styles.waitlistTitle}>Join the Waitlist</Text>
            <Text style={styles.waitlistText}>
              Be the first to know when workshops launch and get early access as a member.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.buttonContainer}>
              <Pressable
                style={[buttonStyles.primary, isLoading && buttonStyles.disabled]}
                onPress={handleJoinWaitlist}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.buttonText} />
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
