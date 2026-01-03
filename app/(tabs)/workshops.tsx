
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator, TextInput, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { IconSymbol } from '@/components/IconSymbol';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

interface WorkshopFeature {
  id: string;
  icon: string;
  iosIcon: string;
  title: string;
  description: string;
}

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 83 : 60;

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
    description: 'Build trust and understanding with your pet through photography'
  },
  {
    id: '3',
    icon: 'school',
    iosIcon: 'book.fill',
    title: 'Expert Guidance',
    description: 'Step-by-step instruction from professional pet photographers'
  }
];

export default function WorkshopsScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSupabaseAuth();

  const handleJoinWaitlist = async () => {
    const emailToUse = user?.email || email.trim();
    
    if (!emailToUse) {
      Alert.alert('Email Required', 'Please enter your email address to join the waitlist.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('workshop_waitlist')
        .insert([{ email: emailToUse }]);

      if (error) throw error;

      Alert.alert(
        'Success!',
        'You\'ve been added to the workshop waitlist. We\'ll notify you when workshops launch.',
        [{ text: 'OK' }]
      );
      setEmail('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={[styles.content, { paddingBottom: TAB_BAR_HEIGHT + 20 }]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Workshops</Text>
        <Text style={styles.subtitle}>Coming Soon</Text>
      </View>

      <View style={styles.messageCard}>
        <Text style={styles.messageText}>
          Something exciting is coming. Workshops for pet parents who want better photos and deeper connection.
        </Text>
      </View>

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>What to Expect</Text>
        {workshopFeatures.map((feature) => (
          <View 
            key={feature.id ?? feature.title ?? `${feature.title}-${feature.icon}-${feature.description}`} 
            style={styles.featureCard}
          >
            <View style={styles.featureHeader}>
              <IconSymbol 
                name={Platform.OS === 'ios' ? feature.iosIcon : feature.icon}
                size={24}
                color={colors.brandDark}
              />
              <Text style={styles.featureTitle}>{feature.title}</Text>
            </View>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.ctaSection}>
        {!user && (
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
        )}
        
        <Pressable
          style={[buttonStyles.primary, isSubmitting && buttonStyles.disabled]}
          onPress={handleJoinWaitlist}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={buttonStyles.primaryText}>
              {user ? 'Notify Me When Workshops Launch' : 'Join Waitlist'}
            </Text>
          )}
        </Pressable>

        <Pressable style={[buttonStyles.secondary, { marginTop: 12 }]}>
          <Text style={buttonStyles.secondaryText}>
            Join Membership for Early Access
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  messageCard: {
    backgroundColor: colors.cardBackground,
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  featureCard: {
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginLeft: 36,
  },
  ctaSection: {
    marginTop: 8,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
});
