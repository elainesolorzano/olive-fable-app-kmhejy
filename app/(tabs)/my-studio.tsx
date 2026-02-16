
import React, { useState, useEffect, useCallback } from 'react';
import { Logo } from '@/components/Logo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { router, useFocusEffect } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/styles/commonStyles';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import { useNotificationBadge } from '@/contexts/NotificationBadgeContext';
import * as WebBrowser from 'expo-web-browser';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 64;

// Map order_status enum values to display labels
const ORDER_STATUS_STEPS = [
  { status: 'inquiry_received', label: 'Inquiry Received' },
  { status: 'consultation_scheduled', label: 'Consultation Scheduled' },
  { status: 'session_confirmed', label: 'Session Confirmed' },
  { status: 'session_complete', label: 'Session Complete' },
  { status: 'gallery_ready', label: 'Gallery Ready' },
  { status: 'reveal_scheduled', label: 'Reveal Scheduled' },
  { status: 'order_in_production', label: 'Order In Production' },
  { status: 'delivered', label: 'Delivered' },
];

// Appointment options with MaterialIcons names
const APPOINTMENT_OPTIONS = [
  {
    id: 'studio-session',
    title: 'Schedule your Studio Session',
    description: 'For in-studio portrait sessions and custom photography appointments.',
    url: 'https://clients.oliveandfable.com/schedule/687eb2d8a6ab79001f981471',
    iconName: 'camera-alt' as const,
  },
  {
    id: 'zoom-reveal',
    title: 'Schedule your Zoom Gallery Reveal',
    description: 'For virtual gallery reveals and ordering appointments via Zoom.',
    url: 'https://clients.oliveandfable.com/schedule/68af8842d7f926003559d94e',
    iconName: 'laptop' as const,
  },
  {
    id: 'in-person-reveal',
    title: 'Schedule your In-Person Gallery Reveal',
    description: 'For in-studio gallery reveal and artwork ordering appointments.',
    url: 'https://clients.oliveandfable.com/schedule/68af88f5fbccb80036d1da81',
    iconName: 'store' as const,
  },
  {
    id: 'seasonal-outdoor',
    title: 'Seasonal Outdoor Sessions',
    description: 'Limited-time outdoor sessions available during select seasons.',
    url: 'https://www.oliveandfable.com/seasons',
    iconName: 'park' as const,
  },
];

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
  // Appointments Card Styles
  appointmentsCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
  },
  appointmentsCardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  appointmentsCardHelper: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  appointmentItemLast: {
    marginBottom: 0,
  },
  appointmentIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  appointmentDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  appointmentChevron: {
    marginLeft: 12,
    marginTop: 2,
  },
  // Progress Card Styles
  progressCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
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
  notificationBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
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
  const { session, user, signOut, loading: authLoading } = useSupabaseAuth();
  const insets = useSafeAreaInsets();
  const { unreadCount, refreshUnreadCount } = useNotificationBadge();
  
  const [profile, setProfile] = useState<{ order_status: string | null; email: string | null } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Fetch user profile from Supabase
  const fetchProfile = useCallback(async () => {
    if (!user) {
      console.log('No user logged in, skipping profile fetch');
      setLoadingProfile(false);
      return;
    }

    console.log('Fetching profile for user:', user.id);
    setRefreshing(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('order_status, email')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error.message);
        // If profile doesn't exist, treat as inquiry_received
        setProfile({ order_status: null, email: user.email || null });
      } else {
        console.log('Profile fetched successfully:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      setProfile({ order_status: null, email: user.email || null });
    } finally {
      setRefreshing(false);
      setLoadingProfile(false);
    }
  }, [user]);

  // When My Studio screen is focused, refresh the unread count
  // This ensures the badge is updated when returning from the notifications screen
  useFocusEffect(
    useCallback(() => {
      console.log('My Studio screen focused - refreshing unread count');
      refreshUnreadCount();
    }, [refreshUnreadCount])
  );

  // Fetch profile on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoadingProfile(false);
    }
  }, [user, fetchProfile]);

  // Subscribe to realtime changes on profiles table
  useEffect(() => {
    if (!user) return;

    console.log('Setting up realtime subscription for user profile (user:', user.id, ')');

    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Profile changed in realtime:', payload.eventType, 'for user:', user.id);
          if (payload.new && typeof payload.new === 'object' && 'order_status' in payload.new) {
            const newProfile = payload.new as { order_status: string | null; email: string | null };
            console.log('Profile order_status updated to:', newProfile.order_status);
            setProfile(newProfile);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription for user profile (user:', user.id, ')');
      supabase.removeChannel(channel);
    };
  }, [user]);

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

  const handleDeleteAccount = () => {
    console.log('User navigating to Delete Account');
    router.push('/my-studio/delete-account-confirm');
  };

  const handleSignOut = async () => {
    console.log('User tapped Sign Out button');
    await signOut();
  };

  const handleSignIn = () => {
    console.log('User tapped Sign In button from My Studio');
    router.push('/(auth)/login');
  };

  const handleOpenAppointment = async (url: string, title: string) => {
    console.log('User opening appointment:', title);
    try {
      await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
        controlsColor: colors.primary,
      });
    } catch (error) {
      console.error('Error opening appointment link:', error);
    }
  };

  // Determine current step index based on order_status
  const currentStepIndex = profile?.order_status
    ? ORDER_STATUS_STEPS.findIndex(step => step.status === profile.order_status)
    : 0; // Default to first step if no status

  // If status not found in list, default to 0
  const safeCurrentStepIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  const renderProgressStep = (step: { status: string; label: string }, index: number) => {
    const isComplete = index < safeCurrentStepIndex;
    const isActive = index === safeCurrentStepIndex;
    const isLast = index === ORDER_STATUS_STEPS.length - 1;

    return (
      <View key={step.status} style={[styles.progressStep, isLast && styles.progressStepLast]}>
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
          {step.label}
        </Text>
      </View>
    );
  };

  // Show loading spinner while checking auth state or loading profile
  if (authLoading || loadingProfile) {
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchProfile}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Studio</Text>
          <Text style={styles.subtitle}>
            Your Olive & Fable experience, in one place.
          </Text>
        </View>

        {/* Appointments Card */}
        <View style={styles.appointmentsCard}>
          <Text style={styles.appointmentsCardTitle}>Appointments</Text>
          <Text style={styles.appointmentsCardHelper}>
            Schedule your next step with Olive & Fable.
          </Text>
          {APPOINTMENT_OPTIONS.map((option, index) => (
            <Pressable
              key={option.id}
              style={[
                styles.appointmentItem,
                index === APPOINTMENT_OPTIONS.length - 1 && styles.appointmentItemLast,
              ]}
              onPress={() => handleOpenAppointment(option.url, option.title)}
            >
              <MaterialIcons
                name={option.iconName}
                size={22}
                color={colors.text}
                style={styles.appointmentIcon}
              />
              <View style={styles.appointmentContent}>
                <Text style={styles.appointmentTitle}>{option.title}</Text>
                <Text style={styles.appointmentDescription}>{option.description}</Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={colors.textSecondary}
                style={styles.appointmentChevron}
              />
            </Pressable>
          ))}
        </View>

        {/* My Experience Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressCardTitle}>My Experience</Text>
          <Text style={styles.progressCardHelper}>
            We&apos;ll guide you through each step of the process.
          </Text>
          <View style={styles.progressStepsContainer}>
            {ORDER_STATUS_STEPS.map((step, index) => renderProgressStep(step, index))}
          </View>
        </View>

        {/* Account & Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Settings</Text>
          
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
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
              </View>
            )}
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
              style={styles.chevron}
            />
          </Pressable>

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

          <Pressable style={styles.menuItem} onPress={handleDeleteAccount}>
            <IconSymbol
              ios_icon_name="trash.fill"
              android_material_icon_name="delete"
              size={24}
              color="#FF3B30"
              style={styles.menuIcon}
            />
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: '#FF3B30' }]}>Delete Account</Text>
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
