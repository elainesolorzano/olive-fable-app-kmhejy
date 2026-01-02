
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/integrations/supabase/client';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import type { Session } from '@supabase/supabase-js';

type UserRole = 'visitor' | 'registered' | 'member' | 'client';

interface MembershipBenefit {
  id: string;
  text: string;
}

const membershipBenefits: MembershipBenefit[] = [
  { id: 'library', text: 'Full Learn library access' },
  { id: 'workshops', text: 'Early workshop access' },
  { id: 'announcements', text: 'Exclusive announcements' },
];

export default function MyStudioScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>('registered');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    console.log('MyStudioScreen: Checking authentication state');
    
    // Check current session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('MyStudioScreen: Error getting session', error);
          setLoading(false);
          router.replace('/(auth)/login');
          return;
        }
        
        console.log('MyStudioScreen: Session retrieved', session ? 'User logged in' : 'No session');
        setSession(session);
        setLoading(false);
        
        // If no session, redirect to login
        if (!session) {
          console.log('MyStudioScreen: No session found, redirecting to login');
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('MyStudioScreen: Unexpected error checking session', error);
        setLoading(false);
        router.replace('/(auth)/login');
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('MyStudioScreen: Auth state changed', _event, session ? 'User logged in' : 'No session');
      setSession(session);
      
      if (!session && _event === 'SIGNED_OUT') {
        console.log('MyStudioScreen: User signed out, redirecting to login');
        router.replace('/(auth)/login');
      }
    });

    return () => {
      console.log('MyStudioScreen: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const handleEditProfile = () => {
    console.log('Edit Profile button pressed');
    // TODO: Navigate to edit profile screen
  };

  const handleBecomeMember = () => {
    console.log('Become a Member button pressed');
    // TODO: Navigate to membership signup
  };

  const handleManageMembership = () => {
    console.log('Manage Membership button pressed');
    // TODO: Navigate to membership management
  };

  const handleSavedContent = () => {
    console.log('Saved Content button pressed');
    // TODO: Navigate to saved content
  };

  const handlePurchases = () => {
    console.log('Purchases button pressed');
    // TODO: Navigate to purchases
  };

  const handleViewSessionDetails = () => {
    console.log('View Session Details button pressed');
    // TODO: Navigate to session details
  };

  const handleAccessGallery = () => {
    console.log('Access Gallery button pressed');
    // TODO: Open gallery
  };

  const handleNotifications = () => {
    console.log('Notifications setting pressed');
    // TODO: Navigate to notifications settings
  };

  const handlePrivacy = () => {
    console.log('Privacy setting pressed');
    // TODO: Navigate to privacy settings
  };

  const handleHelp = () => {
    console.log('Help & Support pressed');
    // TODO: Navigate to help & support
  };

  const handleSignOut = async () => {
    console.log('Sign Out button pressed');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        console.log('User signed out successfully');
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Unexpected error signing out:', error);
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
  if (!session) {
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
                {session.user.user_metadata?.full_name || 'User'}
              </Text>
              <Text style={styles.profileEmail}>
                {session.user.email || 'No email'}
              </Text>
            </View>
            <Pressable 
              style={({ pressed }) => [pressed && styles.pressed]}
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

        {/* Membership Status */}
        <View style={[commonStyles.card, userRole === 'member' ? styles.memberCard : null]}>
          <View style={styles.membershipHeader}>
            <IconSymbol 
              ios_icon_name={userRole === 'member' ? 'crown.fill' : 'crown'}
              android_material_icon_name={userRole === 'member' ? 'workspace-premium' : 'workspace-premium'}
              size={24}
              color={userRole === 'member' ? colors.secondary : colors.textSecondary}
            />
            <Text style={commonStyles.cardTitle}>
              {userRole === 'member' ? 'Active Member' : 'Membership'}
            </Text>
          </View>
          {userRole === 'member' ? (
            <>
              <Text style={commonStyles.cardText}>
                You&apos;re part of The Olive & Fable Club! Enjoy full access to all educational content.
              </Text>
              <View style={styles.membershipBenefits}>
                {membershipBenefits.map((benefit, index) => (
                  <View key={`${benefit.id}-${index}`} style={styles.benefitItem}>
                    <IconSymbol 
                      ios_icon_name="checkmark.circle.fill"
                      android_material_icon_name="check-circle"
                      size={18}
                      color={colors.secondary}
                    />
                    <Text style={styles.benefitText}>{benefit.text}</Text>
                  </View>
                ))}
              </View>
              <Pressable 
                style={({ pressed }) => [
                  buttonStyles.outlineButton,
                  styles.manageMembershipButton,
                  pressed && styles.pressed
                ]}
                onPress={handleManageMembership}
              >
                <Text style={buttonStyles.outlineButtonText}>Manage Membership</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={commonStyles.cardText}>
                Join The Olive & Fable Club for full access to educational content and early workshop access.
              </Text>
              <Pressable 
                style={({ pressed }) => [
                  buttonStyles.primaryButton,
                  pressed && styles.pressed
                ]}
                onPress={handleBecomeMember}
              >
                <Text style={buttonStyles.buttonText}>Become a Member</Text>
              </Pressable>
            </>
          )}
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

        {/* Client Portal (conditional) */}
        {isClient && (
          <View style={[commonStyles.card, styles.clientPortalCard]}>
            <View style={styles.clientPortalHeader}>
              <IconSymbol 
                ios_icon_name="calendar.badge.clock"
                android_material_icon_name="event"
                size={28}
                color={colors.primary}
              />
              <Text style={commonStyles.cardTitle}>Your Session</Text>
            </View>
            <View style={styles.sessionDetails}>
              <View style={styles.sessionDetailRow}>
                <Text style={styles.sessionDetailLabel}>Date:</Text>
                <Text style={styles.sessionDetailValue}>March 15, 2025</Text>
              </View>
              <View style={styles.sessionDetailRow}>
                <Text style={styles.sessionDetailLabel}>Time:</Text>
                <Text style={styles.sessionDetailValue}>2:00 PM</Text>
              </View>
              <View style={styles.sessionDetailRow}>
                <Text style={styles.sessionDetailLabel}>Location:</Text>
                <Text style={styles.sessionDetailValue}>Central Park</Text>
              </View>
            </View>
            <Pressable 
              style={({ pressed }) => [
                buttonStyles.primaryButton,
                pressed && styles.pressed
              ]}
              onPress={handleViewSessionDetails}
            >
              <Text style={buttonStyles.buttonText}>View Session Details</Text>
            </Pressable>
            <Pressable 
              style={({ pressed }) => [
                buttonStyles.outlineButton,
                styles.galleryButton,
                pressed && styles.pressed
              ]}
              onPress={handleAccessGallery}
            >
              <Text style={buttonStyles.outlineButtonText}>Access Gallery</Text>
            </Pressable>
          </View>
        )}

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

        {/* Demo Controls (for testing) */}
        <View style={[commonStyles.card, styles.demoControls]}>
          <Text style={styles.demoTitle}>Demo Controls</Text>
          <Pressable 
            style={({ pressed }) => [
              buttonStyles.outlineButton,
              styles.demoButton,
              pressed && styles.pressed
            ]}
            onPress={() => {
              console.log('Toggling membership status');
              setUserRole(userRole === 'member' ? 'registered' : 'member');
            }}
          >
            <Text style={buttonStyles.outlineButtonText}>
              Toggle Membership ({userRole === 'member' ? 'Active' : 'Inactive'})
            </Text>
          </Pressable>
          <Pressable 
            style={({ pressed }) => [
              buttonStyles.outlineButton,
              styles.demoButton,
              pressed && styles.pressed
            ]}
            onPress={() => {
              console.log('Toggling client portal visibility');
              setIsClient(!isClient);
            }}
          >
            <Text style={buttonStyles.outlineButtonText}>
              Toggle Client Portal ({isClient ? 'Visible' : 'Hidden'})
            </Text>
          </Pressable>
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
  memberCard: {
    backgroundColor: colors.highlight,
  },
  membershipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  membershipBenefits: {
    marginTop: 16,
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text,
    marginLeft: 10,
  },
  manageMembershipButton: {
    marginTop: 8,
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
  clientPortalCard: {
    backgroundColor: colors.accent,
  },
  clientPortalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sessionDetails: {
    marginBottom: 16,
  },
  sessionDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sessionDetailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sessionDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  galleryButton: {
    marginTop: 8,
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
  demoControls: {
    backgroundColor: colors.highlight,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  demoButton: {
    marginTop: 8,
  },
  pressed: {
    opacity: 0.7,
  },
});
