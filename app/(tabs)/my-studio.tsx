
import React from 'react';
import { Logo } from '@/components/Logo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Platform } from 'react-native';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 64;

// Progress steps for the client journey
const PROGRESS_STEPS = [
  'Inquiry Received',
  'Consultation Scheduled',
  'Session Confirmed',
  'Session Complete',
  'Gallery Ready',
  'Reveal Scheduled',
  'Order In Production',
  'Delivered',
];

const CURRENT_STEP = 'Session Confirmed'; // Hardcoded for now

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  // Login Screen Styles
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loginContent: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  loginLogo: {
    marginBottom: 32,
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  loginDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  signInButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  // Progress Card Styles
  progressCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressCardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  progressCardHelper: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  progressStepsContainer: {
    marginTop: 8,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressStepLast: {
    marginBottom: 0,
  },
  progressStepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  progressStepIndicatorActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  progressStepIndicatorComplete: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  progressStepLine: {
    position: 'absolute',
    left: 15,
    top: 32,
    width: 2,
    height: 20,
    backgroundColor: colors.border,
  },
  progressStepLineComplete: {
    backgroundColor: colors.primary,
  },
  progressStepText: {
    fontSize: 16,
    color: colors.textSecondary,
    flex: 1,
  },
  progressStepTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  progressStepTextComplete: {
    color: colors.text,
  },
  checkIcon: {
    color: '#FFFFFF',
  },
  // Account & Settings Section
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  chevron: {
    marginLeft: 8,
  },
  signOutButton: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
});

export default function MyStudioScreen() {
  const { session, signOut, loading } = useSupabaseAuth();
  const insets = useSafeAreaInsets();

  const handleEditProfile = () => {
    console.log('User navigating to Edit Profile');
    router.push('/my-studio/edit-profile');
  };

  const handleNotifications = () => {
    console.log('User navigating to Notifications');
    router.push('/my-studio/notifications');
  };

  const handlePrivacy = () => {
    console.log('User navigating to Privacy & Security');
    router.push('/my-studio/privacy');
  };

  const handleHelp = () => {
    console.log('User navigating to Help & Support');
    router.push('/my-studio/support');
  };

  const handleSignOut = async () => {
    console.log('User tapped Sign Out button');
    await signOut();
  };

  const handleSignIn = () => {
    console.log('User tapped Sign In button from My Studio');
    router.push('/(auth)/login');
  };

  // Determine which steps are complete and which is current
  const currentStepIndex = PROGRESS_STEPS.indexOf(CURRENT_STEP);

  const renderProgressStep = (step: string, index: number) => {
    const isComplete = index < currentStepIndex;
    const isActive = index === currentStepIndex;
    const isLast = index === PROGRESS_STEPS.length - 1;

    return (
      <View key={step} style={[styles.progressStep, isLast && styles.progressStepLast]}>
        <View>
          <View
            style={[
              styles.progressStepIndicator,
              isActive && styles.progressStepIndicatorActive,
              isComplete && styles.progressStepIndicatorComplete,
            ]}
          >
            {isComplete ? (
              <IconSymbol
                ios_icon_name="checkmark"
                android_material_icon_name="check"
                size={18}
                color="#FFFFFF"
              />
            ) : isActive ? (
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#FFFFFF',
                }}
              />
            ) : null}
          </View>
          {!isLast && (
            <View
              style={[
                styles.progressStepLine,
                isComplete && styles.progressStepLineComplete,
              ]}
            />
          )}
        </View>
        <Text
          style={[
            styles.progressStepText,
            isActive && styles.progressStepTextActive,
            isComplete && styles.progressStepTextComplete,
          ]}
        >
          {step}
        </Text>
      </View>
    );
  };

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Show login screen if not authenticated
  if (!session) {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <View style={styles.loginContent}>
            <View style={styles.loginLogo}>
              <Logo width={100} height={100} />
            </View>
            <Text style={styles.loginTitle}>Sign in to My Studio</Text>
            <Text style={styles.loginDescription}>
              Access your client portal, session details, purchased images, and exclusive content.
            </Text>
            <Pressable style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // Show dashboard if authenticated
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
          <Text style={styles.title}>My Studio</Text>
          <Text style={styles.subtitle}>
            Your Olive & Fable experience, in one place.
          </Text>
        </View>

        {/* My Experience Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressCardTitle}>My Experience</Text>
          <Text style={styles.progressCardHelper}>
            We&apos;ll guide you through each step of the process.
          </Text>
          <View style={styles.progressStepsContainer}>
            {PROGRESS_STEPS.map((step, index) => renderProgressStep(step, index))}
          </View>
        </View>

        {/* Account & Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Settings</Text>
          
          <Pressable style={styles.menuItem} onPress={handleEditProfile}>
            <IconSymbol
              ios_icon_name="person.circle.fill"
              android_material_icon_name="account-circle"
              size={24}
              color={colors.primary}
              style={styles.menuIcon}
            />
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Edit Profile</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
              style={styles.chevron}
            />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleNotifications}>
            <IconSymbol
              ios_icon_name="bell.fill"
              android_material_icon_name="notifications"
              size={24}
              color={colors.primary}
              style={styles.menuIcon}
            />
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Notifications</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
              style={styles.chevron}
            />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handlePrivacy}>
            <IconSymbol
              ios_icon_name="lock.fill"
              android_material_icon_name="lock"
              size={24}
              color={colors.primary}
              style={styles.menuIcon}
            />
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Privacy & Security</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
              style={styles.chevron}
            />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleHelp}>
            <IconSymbol
              ios_icon_name="questionmark.circle.fill"
              android_material_icon_name="help"
              size={24}
              color={colors.primary}
              style={styles.menuIcon}
            />
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Help & Support</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
              style={styles.chevron}
            />
          </Pressable>
        </View>

        {/* Sign Out Button */}
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
