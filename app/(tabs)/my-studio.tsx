
import React from 'react';
import { Logo } from '@/components/Logo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Platform } from 'react-native';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 64;

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
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
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
  // Dashboard Styles
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
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
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  chevron: {
    marginLeft: 8,
  },
  signOutButton: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
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

  const handleSavedContent = () => {
    console.log('User navigating to Saved Content');
    router.push('/my-studio/saved');
  };

  const handlePurchases = () => {
    console.log('User navigating to Purchases');
    router.push('/my-studio/purchases');
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
          <View style={styles.logoContainer}>
            <Logo width={80} height={80} />
          </View>
          <Text style={styles.title}>My Studio</Text>
          <Text style={styles.subtitle}>
            {session.user?.email || 'Welcome back!'}
          </Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
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
              <Text style={styles.menuDescription}>Update your information</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
              style={styles.chevron}
            />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleSavedContent}>
            <IconSymbol
              ios_icon_name="bookmark.fill"
              android_material_icon_name="bookmark"
              size={24}
              color={colors.primary}
              style={styles.menuIcon}
            />
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Saved Content</Text>
              <Text style={styles.menuDescription}>Your bookmarked guides</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
              style={styles.chevron}
            />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handlePurchases}>
            <IconSymbol
              ios_icon_name="cart.fill"
              android_material_icon_name="shopping-cart"
              size={24}
              color={colors.primary}
              style={styles.menuIcon}
            />
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Purchases</Text>
              <Text style={styles.menuDescription}>View your orders</Text>
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

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
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
              <Text style={styles.menuDescription}>Manage your alerts</Text>
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
              <Text style={styles.menuDescription}>Manage your data</Text>
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
              <Text style={styles.menuDescription}>Get assistance</Text>
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
