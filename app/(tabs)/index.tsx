
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleLearnMore = () => {
    console.log('Learn More button pressed - navigating to Learn screen');
    router.push('/learn');
  };

  const handleExploreGuides = () => {
    console.log('Explore Guides card pressed - navigating to Learn screen');
    router.push('/learn');
  };

  const handleBookSession = () => {
    console.log('Book Session card pressed - navigating to Book screen');
    router.push('/book');
  };

  const handleBookWithOliveAndFable = () => {
    console.log('Book with Olive & Fable button pressed - navigating to Book screen');
    router.push('/book');
  };

  return (
    <View style={commonStyles.container} pointerEvents="auto">
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
          <Pressable 
            style={({ pressed }) => [
              buttonStyles.outlineButton,
              styles.tipButton,
              pressed && styles.pressed
            ]}
            onPress={handleLearnMore}
          >
            <Text style={buttonStyles.outlineButtonText}>Learn More</Text>
          </Pressable>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Pressable 
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.pressed
            ]}
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
          </Pressable>

          <Pressable 
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.pressed
            ]}
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
          </Pressable>
        </View>

        {/* Free Learning CTA */}
        <View style={[commonStyles.card, styles.freeCard]}>
          <IconSymbol 
            ios_icon_name="checkmark.seal.fill"
            android_material_icon_name="verified"
            size={32}
            color={colors.secondary}
            style={styles.freeIcon}
          />
          <Text style={commonStyles.cardTitle}>Free Learning Resources</Text>
          <Text style={commonStyles.cardText}>
            Sign up for free access to all our educational content. Learn posing techniques, preparation tips, and more!
          </Text>
          <Pressable 
            style={({ pressed }) => [
              buttonStyles.primaryButton,
              pressed && styles.pressed
            ]}
            onPress={handleExploreGuides}
          >
            <Text style={buttonStyles.buttonText}>Start Learning</Text>
          </Pressable>
        </View>

        {/* Booking CTA */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>Ready for Your Portrait?</Text>
          <Text style={commonStyles.cardText}>
            I don&apos;t take bookings myself (paws, no thumbs), but my humans do.
          </Text>
          <Pressable 
            style={({ pressed }) => [
              buttonStyles.secondaryButton,
              pressed && styles.pressed
            ]}
            onPress={handleBookWithOliveAndFable}
          >
            <Text style={buttonStyles.secondaryButtonText}>Book with Olive & Fable</Text>
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
  freeCard: {
    backgroundColor: colors.highlight,
    marginBottom: 16,
    alignItems: 'center',
  },
  freeIcon: {
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.7,
  },
});
