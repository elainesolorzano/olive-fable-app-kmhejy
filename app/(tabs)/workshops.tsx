
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

const TAB_BAR_HEIGHT = 80;

const workshopFeatures: WorkshopFeature[] = [
  {
    id: '1',
    icon: 'camera',
    iosIcon: 'camera.fill',
    title: 'Better Photos',
    description: 'Learn professional techniques for capturing your pet'
  },
  {
    id: '2',
    icon: 'favorite',
    iosIcon: 'heart.fill',
    title: 'Deeper Connection',
    description: 'Build trust and understanding through the lens'
  },
  {
    id: '3',
    icon: 'school',
    iosIcon: 'book.fill',
    title: 'Expert Guidance',
    description: 'Step-by-step instruction from Olive & Fable'
  }
];

export default function WorkshopsScreen() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSupabaseAuth();
  const insets = useSafeAreaInsets();

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
        'You\'re on the list!',
        'We\'ll notify you when workshops launch. Members get early access.',
        [{ text: 'Perfect', style: 'default' }]
      );
      
      setEmail('');
    } catch (error: any) {
      if (error.code === '23505') {
        Alert.alert('Already Registered', 'This email is already on the waitlist.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 20 }
      ]}
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
            key={feature.id}
            style={styles.featureCard}
          >
            <View style={styles.featureIcon}>
              <IconSymbol
                name={Platform.OS === 'ios' ? feature.iosIcon : feature.icon}
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
          style={({ pressed }) => [
            buttonStyles.primary,
            pressed && buttonStyles.primaryPressed,
            isSubmitting && buttonStyles.primaryDisabled
          ]}
          onPress={handleJoinWaitlist}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={buttonStyles.primaryText}>
              Notify Me When Workshops Launch
            </Text>
          )}
        </Pressable>

        {!user && (
          <Pressable
            style={({ pressed }) => [
              buttonStyles.secondary,
              pressed && buttonStyles.secondaryPressed
            ]}
            onPress={() => Alert.alert('Membership', 'Join to get early access to workshops')}
          >
            <Text style={buttonStyles.secondaryText}>
              Join Membership for Early Access
            </Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  messageCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
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
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
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
  ctaSection: {
    gap: 12,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
