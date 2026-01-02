
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface WorkshopFeature {
  id: string;
  icon: string;
  iosIcon: string;
  title: string;
  description: string;
}

const workshopFeatures: WorkshopFeature[] = [
  {
    id: 'photography',
    icon: 'camera-alt',
    iosIcon: 'camera.fill',
    title: 'Photography Workshops',
    description: 'Learn professional techniques for capturing your pet\'s personality',
  },
  {
    id: 'group-sessions',
    icon: 'people',
    iosIcon: 'person.2.fill',
    title: 'Small Group Sessions',
    description: 'Intimate workshops with personalized attention and feedback',
  },
  {
    id: 'expert-instruction',
    icon: 'star',
    iosIcon: 'star.fill',
    title: 'Expert Instruction',
    description: 'Learn from professional pet photographers with years of experience',
  },
  {
    id: 'bonding',
    icon: 'favorite',
    iosIcon: 'heart.fill',
    title: 'Bonding Activities',
    description: 'Strengthen your connection while learning new skills together',
  },
];

export default function WorkshopsScreen() {
  const handleNotifyMe = () => {
    console.log('Notify Me When Workshops Launch button pressed');
    // TODO: Implement notification signup
  };

  const handleJoinMembership = () => {
    console.log('Join Membership for Early Access button pressed');
    // TODO: Navigate to membership signup
  };

  return (
    <View style={commonStyles.container} pointerEvents="auto">
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
          {workshopFeatures.map((feature, featureIndex) => (
            <React.Fragment key={`feature-${feature.id}-${featureIndex}`}>
              <View style={styles.featureItem}>
                <IconSymbol 
                  ios_icon_name={feature.iosIcon as any}
                  android_material_icon_name={feature.icon as any}
                  size={24}
                  color={colors.secondary}
                />
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={commonStyles.cardText}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            </React.Fragment>
          ))}
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
          <Pressable 
            style={({ pressed }) => [
              buttonStyles.primaryButton,
              pressed && styles.pressed
            ]}
            onPress={handleNotifyMe}
          >
            <Text style={buttonStyles.buttonText}>Notify Me When Workshops Launch</Text>
          </Pressable>
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
          <Pressable 
            style={({ pressed }) => [
              buttonStyles.secondaryButton,
              pressed && styles.pressed
            ]}
            onPress={handleJoinMembership}
          >
            <Text style={buttonStyles.buttonText}>Join Membership for Early Access</Text>
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
  pressed: {
    opacity: 0.7,
  },
});
