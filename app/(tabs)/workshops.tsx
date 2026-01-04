
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator, TextInput, Platform } from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { IconSymbol } from '@/components/IconSymbol';

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
    id: 'feature-1',
    icon: 'camera',
    iosIcon: 'camera.fill',
    title: 'Better Photos',
    description: 'Learn professional techniques for capturing your pet'
  },
  {
    id: 'feature-2',
    icon: 'favorite',
    iosIcon: 'heart.fill',
    title: 'Deeper Connection',
    description: 'Build trust and understanding with your companion'
  },
  {
    id: 'feature-3',
    icon: 'groups',
    iosIcon: 'person.3.fill',
    title: 'Community',
    description: 'Connect with other passionate pet parents'
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  comingSoonBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  comingSoonText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  featuresSection: {
    marginBottom: 32,
  },
  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureIcon: {
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  ctaSection: {
    marginBottom: TAB_BAR_HEIGHT + 40,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
});

export default function WorkshopsScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleJoinWaitlist = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success!', 'You\'ve been added to the waitlist. We\'ll notify you when workshops launch.');
      setEmail('');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
          <Text style={styles.title}>Workshops</Text>
          <Text style={styles.subtitle}>
            Something exciting is coming. Workshops for pet parents who want better photos and deeper connection.
          </Text>
        </View>

        <View style={styles.featuresSection}>
          {workshopFeatures.map((feature) => (
            <View key={feature.id} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <IconSymbol
                  ios_icon_name={Platform.OS === 'ios' ? feature.iosIcon : undefined}
                  android_material_icon_name={feature.icon}
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

        <View style={styles.ctaSection}>
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
          
          <Pressable
            style={[buttonStyles.primary, loading && { opacity: 0.6 }]}
            onPress={handleJoinWaitlist}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={buttonStyles.primaryText}>Notify Me When Workshops Launch</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
