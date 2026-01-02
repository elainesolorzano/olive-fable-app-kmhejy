
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function MembershipScreen() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const isMember = profile?.membership_status === 'active';

  const handleJoinMembership = async () => {
    console.log('Join Membership button pressed');
    setLoading(true);

    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        Alert.alert('Error', 'You must be logged in to purchase a membership');
        setLoading(false);
        return;
      }

      // Call Edge Function to create Stripe Checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          successUrl: 'https://natively.dev/membership-success',
          cancelUrl: 'https://natively.dev/membership-cancelled',
        },
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        Alert.alert('Error', 'Failed to start checkout process. Please try again.');
        setLoading(false);
        return;
      }

      console.log('Checkout session created:', data);

      // Open Stripe Checkout in browser
      const result = await WebBrowser.openBrowserAsync(data.url);
      console.log('Browser result:', result);

      // Refresh profile after browser closes to check if payment was successful
      if (result.type === 'cancel' || result.type === 'dismiss') {
        console.log('User closed browser, refreshing profile...');
        await refreshProfile();
        
        // Check if membership was activated
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession) {
          const { data: updatedProfile } = await supabase
            .from('profiles')
            .select('membership_status')
            .eq('user_id', currentSession.user.id)
            .single();

          if (updatedProfile?.membership_status === 'active') {
            Alert.alert(
              'Success!',
              'Welcome to The Olive & Fable Club! Your membership is now active.',
              [{ text: 'OK', onPress: () => router.back() }]
            );
          }
        }
      }
    } catch (error) {
      console.error('Error in membership flow:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManageMembership = () => {
    console.log('Manage Membership button pressed');
    Alert.alert(
      'Manage Membership',
      'To manage your membership, please contact support at hello@oliveandfable.com',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <IconSymbol 
            ios_icon_name="crown.fill"
            android_material_icon_name="workspace-premium"
            size={80}
            color={colors.secondary}
          />
        </View>
        
        <Text style={commonStyles.title}>The Olive & Fable Club</Text>
        
        {isMember ? (
          <View style={[commonStyles.card, styles.activeCard]}>
            <Text style={styles.activeText}>
              Your membership is active!
            </Text>
            <Text style={styles.descriptionText}>
              You have full access to all educational content, early workshop access, and exclusive member announcements.
            </Text>
          </View>
        ) : (
          <View style={commonStyles.card}>
            <Text style={styles.descriptionText}>
              Join The Olive & Fable Club for exclusive access to educational content, early workshop access, and member-only announcements.
            </Text>
          </View>
        )}

        <View style={[commonStyles.card, styles.benefitsCard]}>
          <Text style={styles.benefitsTitle}>What&apos;s Included:</Text>
          <View style={styles.benefitItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={20}
              color={colors.secondary}
            />
            <Text style={styles.benefitText}>Full Learn library access</Text>
          </View>
          <View style={styles.benefitItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={20}
              color={colors.secondary}
            />
            <Text style={styles.benefitText}>Early workshop access</Text>
          </View>
          <View style={styles.benefitItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={20}
              color={colors.secondary}
            />
            <Text style={styles.benefitText}>Exclusive announcements</Text>
          </View>
          <View style={styles.benefitItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={20}
              color={colors.secondary}
            />
            <Text style={styles.benefitText}>Member-only content</Text>
          </View>
        </View>

        {isMember ? (
          <Pressable 
            style={({ pressed }) => [
              buttonStyles.outlineButton,
              pressed && styles.pressed
            ]}
            onPress={handleManageMembership}
          >
            <Text style={buttonStyles.outlineButtonText}>Manage Membership</Text>
          </Pressable>
        ) : (
          <Pressable 
            style={({ pressed }) => [
              buttonStyles.primaryButton,
              loading && styles.disabledButton,
              pressed && styles.pressed
            ]}
            onPress={handleJoinMembership}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.card} />
            ) : (
              <Text style={buttonStyles.buttonText}>Join Now - $9.99/month</Text>
            )}
          </Pressable>
        )}

        <Pressable 
          style={({ pressed }) => [
            buttonStyles.outlineButton,
            styles.backButton,
            pressed && styles.pressed
          ]}
          onPress={() => router.back()}
        >
          <Text style={buttonStyles.outlineButtonText}>Go Back</Text>
        </Pressable>
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
    paddingBottom: 40,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  activeCard: {
    backgroundColor: colors.highlight,
  },
  activeText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  benefitsCard: {
    backgroundColor: colors.highlight,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text,
    marginLeft: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  backButton: {
    marginTop: 8,
  },
  pressed: {
    opacity: 0.7,
  },
});
