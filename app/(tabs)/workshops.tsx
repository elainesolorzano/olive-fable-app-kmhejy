
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator, TextInput, Platform } from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { IconSymbol } from '@/components/IconSymbol';

interface WorkshopFeature {
  id: string;
  icon: string;
  iosIcon: string;
  title: string;
  description: string;
}

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 0 : 80;

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
    description: 'Build trust and understanding through photography'
  },
  {
    id: 'feature-3',
    icon: 'school',
    iosIcon: 'book.fill',
    title: 'Expert Guidance',
    description: 'Step-by-step instruction from Olive & Fable'
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: TAB_BAR_HEIGHT + 32,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    color: colors.textSecondary,
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
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  ctaSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export default function WorkshopsScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useSupabaseAuth();
  const insets = useSafeAreaInsets();

  const handleJoinWaitlist = async () => {
    const emailToUse = user?.email || email.trim();
    
    if (!emailToUse) {
      Alert.alert('Email Required', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('workshop_waitlist')
        .insert([{ email: emailToUse }]);

      if (error) throw error;

      Alert.alert(
        'Success!',
        'You\'re on the list. We\'ll notify you when workshops launch.',
        [{ text: 'OK' }]
      );
      setEmail('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to join waitlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
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
                  name={feature.icon}
                  ios_icon_name={feature.iosIcon}
                  size={28}
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

        <View style={styles.ctaSection}>
          {!user && (
            <View style={styles.inputContainer}>
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
            </View>
          )}

          <Pressable
            style={[buttonStyles.primary, loading && buttonStyles.disabled]}
            onPress={handleJoinWaitlist}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.buttonText} />
            ) : (
              <Text style={buttonStyles.primaryText}>
                Notify Me When Workshops Launch
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
