
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Logo } from '@/components/Logo';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export default function MyStudioScreen() {
  const { user, loading, signOut } = useSupabaseAuth();

  const handleEditProfile = () => {
    router.push('/my-studio/edit-profile');
  };

  const handleSavedContent = () => {
    router.push('/my-studio/saved');
  };

  const handlePurchases = () => {
    router.push('/my-studio/purchases');
  };

  const handleNotifications = () => {
    router.push('/my-studio/notifications');
  };

  const handlePrivacy = () => {
    router.push('/my-studio/privacy');
  };

  const handleHelp = () => {
    router.push('/my-studio/support');
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Logo size="small" style={styles.logo} />
        
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <IconSymbol ios_icon_name="person.circle" android_material_icon_name="account-circle" size={40} color={colors.primary} />
          </View>
          <Text style={styles.userName}>{user?.email}</Text>
          <Pressable style={buttonStyles.secondary} onPress={handleEditProfile}>
            <Text style={buttonStyles.secondaryText}>Edit Profile</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Content</Text>
          
          <Pressable style={styles.menuItem} onPress={handleSavedContent}>
            <IconSymbol ios_icon_name="bookmark" android_material_icon_name="bookmark" size={24} color={colors.text} />
            <Text style={styles.menuItemText}>Saved Content</Text>
            <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handlePurchases}>
            <IconSymbol ios_icon_name="bag" android_material_icon_name="shopping-bag" size={24} color={colors.text} />
            <Text style={styles.menuItemText}>Purchases</Text>
            <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <Pressable style={styles.menuItem} onPress={handleNotifications}>
            <IconSymbol ios_icon_name="bell" android_material_icon_name="notifications" size={24} color={colors.text} />
            <Text style={styles.menuItemText}>Notifications</Text>
            <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handlePrivacy}>
            <IconSymbol ios_icon_name="lock.shield" android_material_icon_name="lock" size={24} color={colors.text} />
            <Text style={styles.menuItemText}>Privacy & Security</Text>
            <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleHelp}>
            <IconSymbol ios_icon_name="questionmark.circle" android_material_icon_name="help" size={24} color={colors.text} />
            <Text style={styles.menuItemText}>Help & Support</Text>
            <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <Pressable style={[buttonStyles.secondary, styles.signOutButton]} onPress={handleSignOut}>
          <Text style={buttonStyles.secondaryText}>Sign Out</Text>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  logo: {
    marginBottom: 24,
  },
  profileSection: {
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    padding: 24,
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  signOutButton: {
    marginTop: 16,
  },
});
