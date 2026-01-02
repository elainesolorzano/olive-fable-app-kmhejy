
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function WorkshopsScreen() {
  const handleNotifyMe = () => {
    console.log('User requested workshop notifications');
    // TODO: Implement notification signup
  };

  const handleJoinMembership = () => {
    console.log('User wants to join membership for early access');
    // TODO: Navigate to membership signup
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Coming Soon Badge */}
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>COMING SOON</Text>
        </View>

        {/* Main Icon */}
        <View style={styles.iconContainer}>
          <IconSymbol 
            ios_icon_name="lightbulb.fill"
            android_material_icon_name="lightbulb"
            size={80}
            color={colors.primary}
          />
        </View>

        {/* Header */}
        <Text style={[commonStyles.title, styles.title]}>Workshops</Text>
        <Text style={styles.subtitle}>
          Something exciting is coming. Workshops for pet parents who want better photos and deeper connection.
        </Text>

        {/* What to Expect */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>What to Expect</Text>
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="camera.fill"
              android_material_icon_name="camera-alt"
              size={24}
              color={colors.secondary}
            />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Photography Workshops</Text>
              <Text style={commonStyles.cardText}>
                Learn professional techniques for capturing your pet&apos;s personality
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="person.2.fill"
              android_material_icon_name="people"
              size={24}
              color={colors.secondary}
            />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Small Group Sessions</Text>
              <Text style={commonStyles.cardText}>
                Intimate workshops with personalized attention and feedback
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={24}
              color={colors.secondary}
            />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Expert Instruction</Text>
              <Text style={commonStyles.cardText}>
                Learn from professional pet photographers with years of experience
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="heart.fill"
              android_material_icon_name="favorite"
              size={24}
              color={colors.secondary}
            />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Bonding Activities</Text>
              <Text style={commonStyles.cardText}>
                Strengthen your connection while learning new skills together
              </Text>
            </View>
          </View>
        </View>

        {/* Gemma Quote */}
        <View style={[commonStyles.card, styles.quoteCard]}>
          <View style={styles.gemmaAvatar}>
            <IconSymbol 
              ios_icon_name="pawprint.fill"
              android_material_icon_name="pets"
              size={24}
              color={colors.primary}
            />
          </View>
          <Text style={styles.quoteText}>
            I&apos;ve been practicing my poses. You should too. These workshops are going to be pawsome!
          </Text>
          <Text style={styles.quoteAuthor}>— Gemma, CEO</Text>
        </View>

        {/* CTAs */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>Be the First to Know</Text>
          <Text style={commonStyles.cardText}>
            Get notified when workshops launch and secure your spot early.
          </Text>
          <TouchableOpacity 
            style={buttonStyles.primaryButton}
            onPress={handleNotifyMe}
          >
            <Text style={buttonStyles.buttonText}>Notify Me When Workshops Launch</Text>
          </TouchableOpacity>
        </View>

        <View style={[commonStyles.card, styles.membershipCard]}>
          <IconSymbol 
            ios_icon_name="crown.fill"
            android_material_icon_name="workspace-premium"
            size={32}
            color={colors.secondary}
            style={styles.membershipIcon}
          />
          <Text style={commonStyles.cardTitle}>Members Get Early Access</Text>
          <Text style={commonStyles.cardText}>
            Join The Olive & Fable Club for priority registration and exclusive member pricing on all workshops.
          </Text>
          <TouchableOpacity 
            style={buttonStyles.secondaryButton}
            onPress={handleJoinMembership}
          >
            <Text style={buttonStyles.buttonText}>Join Membership for Early Access</Text>
          </TouchableOpacity>
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
    paddingBottom: 120,
    alignItems: 'center',
  },
  comingSoonBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.card,
    letterSpacing: 1.5,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureText: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  quoteCard: {
    backgroundColor: colors.highlight,
    alignItems: 'center',
    paddingVertical: 24,
  },
  gemmaAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  quoteText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  membershipCard: {
    alignItems: 'center',
    backgroundColor: colors.accent,
  },
  membershipIcon: {
    marginBottom: 12,
  },
});
