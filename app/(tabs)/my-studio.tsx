
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function MyStudioScreen() {
  const { user, session, profile, loading, signOut } = useAuth();

  useEffect(() => {
    console.log('MyStudioScreen: Checking authentication state');
    
    // If not loading and no session, redirect to login
    if (!loading && !session) {
      console.log('MyStudioScreen: No session found, redirecting to login');
      router.replace('/(auth)/login');
    }
  }, [loading, session]);

  const handleEditProfile = () => {
    console.log('Edit Profile button pressed');
    router.push('/my-studio/edit-profile');
  };

  const handleSavedContent = () => {
    console.log('Saved Content button pressed');
    router.push('/my-studio/saved');
  };

  const handlePurchases = () => {
    console.log('Purchases button pressed');
    router.push('/my-studio/purchases');
  };

  const handleNotifications = () => {
    console.log('Notifications setting pressed');
    router.push('/my-studio/notifications');
  };

  const handlePrivacy = () => {
    console.log('Privacy setting pressed');
    router.push('/my-studio/privacy');
  };

  const handleHelp = () => {
    console.log('Help & Support pressed');
    router.push('/my-studio/support');
  };

  const handleSignOut = async () => {
    console.log('Sign Out button pressed');
    try {
      await signOut();
      console.log('User signed out successfully, redirecting to Home');
      router.replace('/(tabs)/index');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <View style={[commonStyles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // If no session after loading, return null (redirect will happen)
  if (!session || !user) {
    return null;
  }

  // User is authenticated, show My Studio content
  return (
    <View style={commonStyles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={commonStyles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              <IconSymbol 
                ios_icon_name="person.fill"
                android_material_icon_name="person"
                size={40}
                color={colors.primary}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user.user_metadata?.full_name || 'User'}
              </Text>
              <Text style={styles.profileEmail}>
                {user.email || 'No email'}
              </Text>
            </View>
            <Pressable 
              style={({ pressed }) => [
                styles.editButton,
                pressed && styles.pressed
              ]}
              onPress={handleEditProfile}
            >
              <IconSymbol 
                ios_icon_name="pencil"
                android_material_icon_name="edit"
                size={20}
                color={colors.primary}
              />
            </Pressable>
          </View>
        </View>

        {/* Welcome Card - Replaces Membership Card */}
        <View style={[commonStyles.card, styles.welcomeCard]}>
          <View style={styles.welcomeHeader}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={28}
              color={colors.secondary}
            />
            <Text style={commonStyles.cardTitle}>You&apos;re Signed In!</Text>
          </View>
          <Text style={commonStyles.cardText}>
            Enjoy free learning resources and explore all our educational content. Workshops are coming soon!
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable 
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.pressed
            ]}
            onPress={handleSavedContent}
          >
            <IconSymbol 
              ios_icon_name="bookmark.fill"
              android_material_icon_name="bookmark"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.actionButtonText}>Saved Content</Text>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.pressed
            ]}
            onPress={handlePurchases}
          >
            <IconSymbol 
              ios_icon_name="bag.fill"
              android_material_icon_name="shopping-bag"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.actionButtonText}>Purchases</Text>
          </Pressable>
        </View>

        {/* Settings */}
        <View style={commonStyles.card}>
          <Pressable 
            style={({ pressed }) => [
              styles.settingItem,
              pressed && styles.pressed
            ]}
            onPress={handleNotifications}
          >
            <View style={styles.settingItemLeft}>
              <IconSymbol 
                ios_icon_name="bell.fill"
                android_material_icon_name="notifications"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={styles.settingItemText}>Notifications</Text>
            </View>
            <IconSymbol 
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>

          <View style={commonStyles.divider} />

          <Pressable 
            style={({ pressed }) => [
              styles.settingItem,
              pressed && styles.pressed
            ]}
            onPress={handlePrivacy}
          >
            <View style={styles.settingItemLeft}>
              <IconSymbol 
                ios_icon_name="lock.fill"
                android_material_icon_name="lock"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={styles.settingItemText}>Privacy</Text>
            </View>
            <IconSymbol 
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>

          <View style={commonStyles.divider} />

          <Pressable 
            style={({ pressed }) => [
              styles.settingItem,
              pressed && styles.pressed
            ]}
            onPress={handleHelp}
          >
            <View style={styles.settingItemLeft}>
              <IconSymbol 
                ios_icon_name="questionmark.circle.fill"
                android_material_icon_name="help"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={styles.settingItemText}>Help & Support</Text>
            </View>
            <IconSymbol 
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>

        {/* Sign Out */}
        <Pressable 
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && styles.pressed
          ]}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  editButton: {
    padding: 8,
  },
  welcomeCard: {
    backgroundColor: colors.highlight,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 12,
  },
  signOutButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC3545',
  },
  pressed: {
    opacity: 0.7,
  },
});
