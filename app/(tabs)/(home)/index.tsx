
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleLearnMore = () => {
    console.log('Navigating to Learn screen');
    router.push('/(tabs)/learn');
  };

  const handleExploreGuides = () => {
    console.log('Navigating to Learn screen from Explore Guides card');
    router.push('/(tabs)/learn');
  };

  const handleBookSession = () => {
    console.log('Opening booking URL');
    // Placeholder URL - replace with actual HoneyBook URL when available
    Linking.openURL('https://www.honeybook.com/');
  };

  const handleBecomeMember = () => {
    console.log('User wants to become a member');
    // TODO: Navigate to membership signup
  };

  const handleBookWithOliveAndFable = () => {
    console.log('Navigating to Book screen');
    router.push('/(tabs)/book');
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.gemmaContainer}>
            <View style={styles.gemmaAvatar}>
              <IconSymbol 
                ios_icon_name="pawprint.fill"
                android_material_icon_name="pets"
                size={40}
                color={colors.primary}
              />
            </View>
            <Text style={styles.gemmaName}>Gemma, CEO</Text>
          </View>
          <Text style={commonStyles.title}>Welcome to Olive & Fable Studio</Text>
          <Text style={styles.welcomeText}>
            Hi, I&apos;m Gemma — CEO, treat tester, and quality control. This is where pet parents learn how to pose, prep, and create beautiful portraits.
          </Text>
        </View>

        {/* Featured Posing Tip */}
        <View style={commonStyles.card}>
          <View style={styles.cardHeader}>
            <IconSymbol 
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={24}
              color={colors.secondary}
            />
            <Text style={styles.cardHeaderText}>Featured Posing Tip</Text>
          </View>
          <Text style={commonStyles.cardTitle}>The Perfect Sit</Text>
          <Text style={commonStyles.cardText}>
            Start with treats at eye level. Keep sessions short and fun. The best portraits happen when your pet is relaxed and happy.
          </Text>
          <TouchableOpacity 
            style={[buttonStyles.outlineButton, styles.tipButton]}
            onPress={handleLearnMore}
          >
            <Text style={buttonStyles.outlineButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handleExploreGuides}
          >
            <IconSymbol 
              ios_icon_name="book.fill"
              android_material_icon_name="book"
              size={32}
              color={colors.primary}
            />
            <Text style={styles.actionTitle}>Explore Guides</Text>
            <Text style={styles.actionText}>Learn posing techniques</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handleBookSession}
          >
            <IconSymbol 
              ios_icon_name="calendar"
              android_material_icon_name="calendar-today"
              size={32}
              color={colors.primary}
            />
            <Text style={styles.actionTitle}>Book Session</Text>
            <Text style={styles.actionText}>Schedule your portrait</Text>
          </TouchableOpacity>
        </View>

        {/* Membership CTA */}
        <View style={[commonStyles.card, styles.membershipCard]}>
          <Text style={commonStyles.cardTitle}>Join The Olive & Fable Club</Text>
          <Text style={commonStyles.cardText}>
            Think of this as the VIP lounge. More tips. More access. Fewer &apos;why won&apos;t my dog sit still&apos; moments.
          </Text>
          <TouchableOpacity 
            style={buttonStyles.primaryButton}
            onPress={handleBecomeMember}
          >
            <Text style={buttonStyles.buttonText}>Become a Member</Text>
          </TouchableOpacity>
        </View>

        {/* Booking CTA */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>Ready for Your Portrait?</Text>
          <Text style={commonStyles.cardText}>
            I don&apos;t take bookings myself (paws, no thumbs), but my humans do.
          </Text>
          <TouchableOpacity 
            style={buttonStyles.secondaryButton}
            onPress={handleBookWithOliveAndFable}
          >
            <Text style={buttonStyles.buttonText}>Book with Olive & Fable</Text>
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
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  gemmaContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  gemmaAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gemmaName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 8,
  },
  tipButton: {
    marginTop: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  membershipCard: {
    backgroundColor: colors.highlight,
    marginBottom: 16,
  },
});
