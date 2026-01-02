
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

type UserRole = 'visitor' | 'registered' | 'member' | 'client';

export default function MyStudioScreen() {
  // For demo purposes, simulating different user states
  const [userRole, setUserRole] = useState<UserRole>('visitor');
  const [isClient, setIsClient] = useState(false);

  const renderVisitorView = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <IconSymbol 
          ios_icon_name="person.circle"
          android_material_icon_name="account-circle"
          size={80}
          color={colors.textSecondary}
        />
      </View>
      <Text style={commonStyles.title}>Welcome to My Studio</Text>
      <Text style={styles.emptyStateText}>
        Sign in or create an account to access your personalized studio hub.
      </Text>
      <TouchableOpacity style={buttonStyles.primaryButton}>
        <Text style={buttonStyles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={buttonStyles.outlineButton}>
        <Text style={buttonStyles.outlineButtonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );

  const renderUserView = () => (
    <>
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
            <Text style={styles.profileName}>Sarah Johnson</Text>
            <Text style={styles.profileEmail}>sarah@example.com</Text>
          </View>
          <TouchableOpacity>
            <IconSymbol 
              ios_icon_name="pencil"
              android_material_icon_name="edit"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
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
              <View style={styles.benefitItem}>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={18}
                  color={colors.secondary}
                />
                <Text style={styles.benefitText}>Full Learn library access</Text>
              </View>
              <View style={styles.benefitItem}>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={18}
                  color={colors.secondary}
                />
                <Text style={styles.benefitText}>Early workshop access</Text>
              </View>
              <View style={styles.benefitItem}>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={18}
                  color={colors.secondary}
                />
                <Text style={styles.benefitText}>Exclusive announcements</Text>
              </View>
            </View>
            <TouchableOpacity style={[buttonStyles.outlineButton, styles.manageMembershipButton]}>
              <Text style={buttonStyles.outlineButtonText}>Manage Membership</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={commonStyles.cardText}>
              Join The Olive & Fable Club for full access to educational content and early workshop access.
            </Text>
            <TouchableOpacity style={buttonStyles.primaryButton}>
              <Text style={buttonStyles.buttonText}>Become a Member</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol 
            ios_icon_name="bookmark.fill"
            android_material_icon_name="bookmark"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.actionButtonText}>Saved Content</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol 
            ios_icon_name="bag.fill"
            android_material_icon_name="shopping-bag"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.actionButtonText}>Purchases</Text>
        </TouchableOpacity>
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
          <TouchableOpacity style={buttonStyles.primaryButton}>
            <Text style={buttonStyles.buttonText}>View Session Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[buttonStyles.outlineButton, styles.galleryButton]}>
            <Text style={buttonStyles.outlineButtonText}>Access Gallery</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Settings */}
      <View style={commonStyles.card}>
        <TouchableOpacity style={styles.settingItem}>
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
        </TouchableOpacity>

        <View style={commonStyles.divider} />

        <TouchableOpacity style={styles.settingItem}>
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
        </TouchableOpacity>

        <View style={commonStyles.divider} />

        <TouchableOpacity style={styles.settingItem}>
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
        </TouchableOpacity>
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Demo Controls (for testing) */}
      <View style={[commonStyles.card, styles.demoControls]}>
        <Text style={styles.demoTitle}>Demo Controls</Text>
        <TouchableOpacity 
          style={[buttonStyles.outlineButton, styles.demoButton]}
          onPress={() => setUserRole(userRole === 'member' ? 'registered' : 'member')}
        >
          <Text style={buttonStyles.outlineButtonText}>
            Toggle Membership ({userRole === 'member' ? 'Active' : 'Inactive'})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[buttonStyles.outlineButton, styles.demoButton]}
          onPress={() => setIsClient(!isClient)}
        >
          <Text style={buttonStyles.outlineButtonText}>
            Toggle Client Portal ({isClient ? 'Visible' : 'Hidden'})
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={commonStyles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {userRole === 'visitor' ? renderVisitorView() : renderUserView()}
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
    paddingBottom: 120,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyStateIcon: {
    marginBottom: 24,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
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
});
