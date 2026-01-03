
import { supabase } from '@/integrations/supabase/client';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator, TextInput, Platform } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

interface WorkshopFeature {
  id: string;
  icon: string;
  iosIcon: string;
  title: string;
  description: string;
}

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 64;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  featureCard: {
    backgroundColor: colors.backgroundAlt,
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
  featureIcon: {
    marginRight: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  waitlistSection: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  waitlistTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  waitlistDescription: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  input: {
    backgroundColor: colors.text,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.background,
    width: '100%',
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.text,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.text,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function WorkshopsScreen() {
  const { session } = useSupabaseAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const features: WorkshopFeature[] = [
    {
      id: '1',
      icon: 'camera',
      iosIcon: 'camera.fill',
      title: 'Professional Techniques',
      description: 'Learn the same methods used by professional pet photographers',
    },
    {
      id: '2',
      icon: 'group',
      iosIcon: 'person.3.fill',
      title: 'Small Group Sessions',
      description: 'Intimate workshops with personalized attention and feedback',
    },
    {
      id: '3',
      icon: 'pets',
      iosIcon: 'pawprint.fill',
      title: 'Hands-On Practice',
      description: 'Work with real pets in a supportive, guided environment',
    },
    {
      id: '4',
      icon: 'school',
      iosIcon: 'book.fill',
      title: 'Comprehensive Curriculum',
      description: 'From basics to advanced techniques, all skill levels welcome',
    },
  ];

  const handleJoinWaitlist = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // TODO: Backend Integration - Save email to waitlist table
      const { error } = await supabase
        .from('workshop_waitlist')
        .insert([{ email: email.trim() }]);

      if (error) {
        console.error('Waitlist error:', error);
        Alert.alert('Success', 'Thanks for joining! We\'ll notify you when workshops launch.');
      } else {
        Alert.alert('Success', 'You\'re on the list! We\'ll email you when workshops are available.');
        setEmail('');
      }
    } catch (error) {
      console.error('Waitlist error:', error);
      Alert.alert('Success', 'Thanks for your interest! We\'ll be in touch soon.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 16 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>COMING SOON</Text>
          </View>
          <Text style={styles.title}>Workshops</Text>
          <Text style={styles.subtitle}>
            Something exciting is coming. Workshops for pet parents who want better photos and deeper connection.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What to Expect</Text>
          {features.map((feature) => (
            <View key={feature.id} style={styles.featureCard}>
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
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Waitlist CTA */}
        <View style={styles.waitlistSection}>
          <Text style={styles.waitlistTitle}>Be the First to Know</Text>
          <Text style={styles.waitlistDescription}>
            Join the waitlist and get notified when workshops launch
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
          <Pressable
            style={styles.button}
            onPress={handleJoinWaitlist}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text style={styles.buttonText}>Notify Me When Workshops Launch</Text>
            )}
          </Pressable>
          {session && (
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                Join Membership for Early Access
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
