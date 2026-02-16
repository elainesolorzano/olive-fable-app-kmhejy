
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { router } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFE69C',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 15,
    color: '#856404',
    lineHeight: 22,
  },
  bodyText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  inputHelper: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 32,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  buttonContainer: {
    gap: 12,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  deleteButtonDisabled: {
    backgroundColor: '#FFB3B0',
    opacity: 0.5,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  // Toast Modal Styles
  toastOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 100,
  },
  toastContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    maxWidth: 400,
    width: '90%',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    alignItems: 'center',
  },
  toastText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  toastError: {
    color: colors.error,
  },
});

export default function DeleteAccountConfirmScreen() {
  const { signOut } = useSupabaseAuth();
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastIsError, setToastIsError] = useState(false);

  const isDeleteEnabled = confirmText === 'DELETE';

  const showToast = (message: string, isError: boolean = false) => {
    setToastMessage(message);
    setToastIsError(isError);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const handleDeleteAccount = async () => {
    if (!isDeleteEnabled || loading) {
      return;
    }

    console.log('User confirmed account deletion');
    setLoading(true);

    try {
      // CRITICAL FIX: Refresh the session to get a fresh, valid access token
      console.log('Refreshing session to get fresh token');
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError) {
        console.error('Error refreshing session:', refreshError);
        showToast('Unable to authenticate. Please log in again.', true);
        setLoading(false);
        return;
      }

      if (!refreshedSession) {
        console.error('No session after refresh');
        showToast('No active session. Please log in again.', true);
        setLoading(false);
        return;
      }

      console.log('Session refreshed successfully, calling delete-account Edge Function');

      // Call the delete-account Edge Function with the fresh token
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) {
        console.error('EXPO_PUBLIC_SUPABASE_URL is not defined');
        showToast('Configuration error. Please contact support.', true);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${supabaseUrl}/functions/v1/delete-account`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${refreshedSession.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }
      );

      console.log('Delete account response status:', response.status);

      let data;
      try {
        data = await response.json();
        console.log('Delete account response data:', data);
      } catch (parseError) {
        console.error('Error parsing response JSON:', parseError);
        showToast('Invalid response from server. Please try again.', true);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorMessage = data?.error || data?.message || 'Failed to delete account. Please try again.';
        console.error('Error deleting account:', errorMessage);
        showToast(errorMessage, true);
        setLoading(false);
        return;
      }

      console.log('Account deleted successfully');
      showToast('Account deleted');

      // Wait a moment for the toast to show
      setTimeout(async () => {
        // Sign out and clear local state
        try {
          await signOut();
        } catch (signOutError) {
          console.error('Error signing out after deletion:', signOutError);
        }
        
        // Navigate to login screen
        router.replace('/(auth)/login');
      }, 1500);

    } catch (error: any) {
      console.error('Unexpected error deleting account:', error);
      const errorMessage = error?.message || 'An unexpected error occurred. Please try again.';
      showToast(errorMessage, true);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('User cancelled account deletion');
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Delete Account</Text>
        </View>

        <View style={styles.warningBox}>
          <IconSymbol
            ios_icon_name="exclamationmark.triangle.fill"
            android_material_icon_name="warning"
            size={24}
            color="#856404"
            style={styles.warningIcon}
          />
          <Text style={styles.warningText}>
            This action cannot be undone. All your data will be permanently deleted.
          </Text>
        </View>

        <Text style={styles.bodyText}>
          Deleting your account permanently removes your profile and associated data. This action cannot be undone.
        </Text>

        <View>
          <Text style={styles.inputLabel}>Confirm Deletion</Text>
          <Text style={styles.inputHelper}>
            Type DELETE to confirm (case-sensitive)
          </Text>
          <TextInput
            style={[styles.input, inputFocused && styles.inputFocused]}
            value={confirmText}
            onChangeText={setConfirmText}
            placeholder="Type DELETE here"
            placeholderTextColor={colors.textTertiary}
            autoCapitalize="characters"
            autoCorrect={false}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            editable={!loading}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.deleteButton,
              (!isDeleteEnabled || loading) && styles.deleteButtonDisabled,
            ]}
            onPress={handleDeleteAccount}
            disabled={!isDeleteEnabled || loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.deleteButtonText}>Delete My Account</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Toast Modal */}
      <Modal
        visible={toastVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setToastVisible(false)}
      >
        <Pressable
          style={styles.toastOverlay}
          onPress={() => setToastVisible(false)}
        >
          <View style={styles.toastContainer}>
            <Text style={[styles.toastText, toastIsError && styles.toastError]}>
              {toastMessage}
            </Text>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
