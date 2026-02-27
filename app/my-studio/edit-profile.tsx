
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function EditProfileScreen() {
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactMethod, setContactMethod] = useState<'Email' | 'Text Message'>('Email');
  const [successMessage, setSuccessMessage] = useState('');
  const { isLoading: authLoading } = useAuthGuard();

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching profile for user ID:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone_number, contact_method')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // Profile might not exist yet, that's okay
        setLoading(false);
        return;
      }

      if (data) {
        console.log('Profile data loaded:', data);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setPhoneNumber(data.phone_number || '');
        setContactMethod(data.contact_method || 'Email');
      }
      setLoading(false);
    } catch (err) {
      console.error('Exception fetching profile:', err);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    console.log('Edit Profile screen loaded for user:', user?.email);
    fetchProfile();
  }, [user, fetchProfile]);

  const handleSaveChanges = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    console.log('User tapped Save Changes button');
    console.log('Saving profile data:', { firstName, lastName, phoneNumber, contactMethod });

    setSaving(true);
    setSuccessMessage('');

    try {
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let error;

      if (existingProfile) {
        // Update existing profile
        console.log('Updating existing profile');
        const result = await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            contact_method: contactMethod,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
        error = result.error;
      } else {
        // Insert new profile
        console.log('Creating new profile');
        const result = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            contact_method: contactMethod,
          });
        error = result.error;
      }

      if (error) {
        console.error('Error saving profile:', error);
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      } else {
        console.log('Profile saved successfully');
        setSuccessMessage('Your profile has been updated.');
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Exception saving profile:', err);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  // Show loading state while auth is being checked
  if (authLoading || loading) {
    return (
      <View style={[commonStyles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <IconSymbol 
            ios_icon_name="person.crop.circle.badge.checkmark"
            android_material_icon_name="account-circle"
            size={80}
            color={colors.primary}
          />
        </View>
        
        <Text style={commonStyles.title}>Edit Profile</Text>
        
        {/* Email (Read-only) */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={[styles.input, styles.readOnlyInput]}>
            <Text style={styles.readOnlyText}>{user?.email || 'Not available'}</Text>
          </View>
          <Text style={styles.helperText}>
            This is the email associated with your account and cannot be changed.
          </Text>
        </View>

        {/* First Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="words"
          />
        </View>

        {/* Last Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your last name"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="words"
          />
        </View>

        {/* Phone Number */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Phone Number (Optional)</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter your phone number"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
          />
          <Text style={styles.helperText}>
            Used only for important updates or reminders, if you choose.
          </Text>
        </View>

        {/* Preferred Contact Method */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Preferred Contact Method</Text>
          <View style={styles.contactMethodContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.contactMethodButton,
                contactMethod === 'Email' && styles.contactMethodButtonActive,
                pressed && styles.pressed,
              ]}
              onPress={() => {
                console.log('User selected Email as contact method');
                setContactMethod('Email');
              }}
            >
              <IconSymbol
                ios_icon_name="envelope.fill"
                android_material_icon_name="email"
                size={20}
                color={contactMethod === 'Email' ? colors.background : colors.text}
              />
              <Text
                style={[
                  styles.contactMethodText,
                  contactMethod === 'Email' && styles.contactMethodTextActive,
                ]}
              >
                Email
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.contactMethodButton,
                contactMethod === 'Text Message' && styles.contactMethodButtonActive,
                pressed && styles.pressed,
              ]}
              onPress={() => {
                console.log('User selected Text Message as contact method');
                setContactMethod('Text Message');
              }}
            >
              <IconSymbol
                ios_icon_name="message.fill"
                android_material_icon_name="message"
                size={20}
                color={contactMethod === 'Text Message' ? colors.background : colors.text}
              />
              <Text
                style={[
                  styles.contactMethodText,
                  contactMethod === 'Text Message' && styles.contactMethodTextActive,
                ]}
              >
                Text Message
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Success Message */}
        {successMessage ? (
          <View style={styles.successContainer}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        {/* Save Button */}
        <Pressable 
          style={({ pressed }) => [
            buttonStyles.primaryButton,
            pressed && styles.pressed,
            saving && styles.disabledButton,
          ]}
          onPress={handleSaveChanges}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={colors.background} />
          ) : (
            <Text style={buttonStyles.buttonText}>Save Changes</Text>
          )}
        </Pressable>

        {/* Back Button */}
        <Pressable 
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
          onPress={() => {
            console.log('User tapped Go Back button');
            router.back();
          }}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
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
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  readOnlyInput: {
    backgroundColor: colors.cardBackground,
  },
  readOnlyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  helperText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 18,
  },
  contactMethodContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  contactMethodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  contactMethodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  contactMethodText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  contactMethodTextActive: {
    color: colors.background,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginBottom: 16,
  },
  successText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.primary,
  },
  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
