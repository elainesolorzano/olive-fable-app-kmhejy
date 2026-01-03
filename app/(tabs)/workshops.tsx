
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator, TextInput } from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_HEIGHT = 60;

interface WorkshopFeature {
  id: string;
  icon: string;
  iosIcon: string;
  title: string;
  description: string;
}

const workshopFeatures: WorkshopFeature[] = [
  {
    id: 'photography',
    icon: 'camera-alt',
    iosIcon: 'camera.fill',
    title: 'Photography Workshops',
    description: 'Learn professional techniques for capturing your pet\'s personality',
  },
  {
    id: 'group-sessions',
    icon: 'people',
    iosIcon: 'person.2.fill',
    title: 'Small Group Sessions',
    description: 'Intimate workshops with personalized attention and feedback',
  },
  {
    id: 'expert-instruction',
    icon: 'star',
    iosIcon: 'star.fill',
    title: 'Expert Instruction',
    description: 'Learn from professional pet photographers with years of experience',
  },
  {
    id: 'bonding',
    icon: 'favorite',
    iosIcon: 'heart.fill',
    title: 'Bonding Activities',
    description: 'Strengthen your connection while learning new skills together',
  },
];

export default function WorkshopsScreen() {
  const { user } = useSupabaseAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  // Calculate bottom padding: tab bar height + safe area bottom + extra spacing
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 24;

  const handleJoinWaitlist = async () => {
    console.log('Join Workshop Waitlist button pressed');
    
    if (!email || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('workshop_waitlist')
        .insert({
          email: email.trim().toLowerCase(),
          user_id: user?.id || null,
        });

      if (error) {
        // Check if email already exists
        if (error.code === '23505') {
          Alert.alert(
            'Already on Waitlist',
            'This email is already registered for workshop updates!',
            [{ text: 'OK' }]
          );
        } else {
          console.error('Error joining waitlist:', error);
          Alert.alert('Error', 'Failed to join waitlist. Please try again.');
        }
      } else {
        Alert.alert(
          'Success!',
          'You\'re on the waitlist! We\'ll notify you as soon as workshops are available.',
          [{ text: 'OK' }]
        );
        setEmail('');
      }
    } catch (error) {
      console.error('Unexpected error joining waitlist:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={commonStyles.container} pointerEvents="auto">
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: bottomPadding }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Coming Soon Badge */}
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>COMING SOON</Text>
        </View>

        {/* Main Icon */}
        <View style={styles.iconContainer}>
          <IconSymbol 
            ios_icon_name="lightbulb.fill"
            android_material_icon_name="lightbulb"
            size={80}
            color={colors.primary}
          />
        </View>

        {/* Header */}
        <Text style={[commonStyles.title, styles.title]}>Workshops</Text>
        <Text style={styles.subtitle}>
          Something exciting is coming. Workshops for pet parents who want better photos and deeper connection.
        </Text>

        {/* What to Expect */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>What to Expect</Text>
          {workshopFeatures.map((feature, featureIndex) => (
            <React.Fragment key={`feature-${feature.id}-${featureIndex}`}>
              <View style={styles.featureItem}>
                <IconSymbol 
                  ios_icon_name={feature.iosIcon as any}
                  android_material_icon_name={feature.icon as any}
                  size={24}
                  color={colors.secondary}
                />
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={commonStyles.cardText}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Gemma Quote */}
        <View style={[commonStyles.card, styles.quoteCard]}>
          <View style={styles.gemmaAvatar}>
            <IconSymbol 
              ios_icon_name="pawprint.fill"
              android_material_icon_name="pets"
              size={24}
              color={colors.primary}
            />
          </View>
          <Text style={styles.quoteText}>
            I&apos;ve been practicing my poses. You should too. These workshops are going to be pawsome!
          </Text>
          <Text style={styles.quoteAuthor}>— Gemma, CEO</Text>
        </View>

        {/* Waitlist CTA */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>Join the Workshop Waitlist</Text>
          <Text style={commonStyles.cardText}>
            Be the first to know when workshops launch and secure your spot early.
          </Text>
          
          <TextInput
            style={styles.emailInput}
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
            style={({ pressed }) => [
              buttonStyles.primaryButton,
              loading && styles.disabledButton,
              pressed && styles.pressed
            ]}
            onPress={handleJoinWaitlist}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.card} />
            ) : (
              <Text style={buttonStyles.buttonText}>Join Workshop Waitlist</Text>
            )}
          </Pressable>
        </View>

        {/* Info Card */}
        <View style={[commonStyles.card, styles.infoCard]}>
          <IconSymbol 
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={32}
            color={colors.primary}
            style={styles.infoIcon}
          />
          <Text style={commonStyles.cardTitle}>Workshops Are Free to Explore</Text>
          <Text style={commonStyles.cardText}>
            When workshops launch, you&apos;ll be able to browse and book them directly. Pricing will be announced closer to launch.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    // paddingBottom handled dynamically
  },
  comingSoonBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.card,
    letterSpacing: 1.5,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureText: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  quoteCard: {
    backgroundColor: colors.highlight,
    alignItems: 'center',
    paddingVertical: 24,
  },
  gemmaAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  quoteText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emailInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
    marginTop: 16,
    marginBottom: 16,
  },
  infoCard: {
    alignItems: 'center',
    backgroundColor: colors.highlight,
  },
  infoIcon: {
    marginBottom: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.7,
  },
});
