
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { GemmaMessage } from '@/components/GemmaMessage';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 64;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  gemmaContainer: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 12,
    marginTop: 7,
  },
  bulletText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
});

export default function RevealPrepScreen() {
  const insets = useSafeAreaInsets();

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
          <Text style={styles.title}>Reveal Preparation</Text>
          <Text style={styles.subtitle}>
            Get ready for your portrait reveal and selection appointment
          </Text>
        </View>

        {/* Gemma's Message */}
        <View style={styles.gemmaContainer}>
          <GemmaMessage
            message="The reveal is one of my favorite moments! You'll see all the beautiful images we created together and choose your favorites."
            showAvatar={true}
          />
        </View>

        {/* What to Expect */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What to Expect</Text>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <IconSymbol
                ios_icon_name="photo.fill"
                android_material_icon_name="photo"
                size={24}
                color={colors.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>The Reveal Experience</Text>
            </View>
            <Text style={styles.cardDescription}>
              Your reveal appointment is a special moment where you'll see all the images from your session for the first time. We'll guide you through the selection process.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <IconSymbol
                ios_icon_name="clock.fill"
                android_material_icon_name="schedule"
                size={24}
                color={colors.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Duration</Text>
            </View>
            <Text style={styles.cardDescription}>
              Plan for 60-90 minutes. This gives you time to view all images, discuss options, and make thoughtful selections.
            </Text>
          </View>
        </View>

        {/* Selection Process */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selection Process</Text>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <IconSymbol
                ios_icon_name="star.fill"
                android_material_icon_name="star"
                size={24}
                color={colors.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>How It Works</Text>
            </View>
            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                View all professionally edited images from your session
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                Mark your favorites and narrow down your selections
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                Choose products and sizes that fit your space
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                Finalize your order and discuss delivery timeline
              </Text>
            </View>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips for Your Reveal</Text>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <IconSymbol
                ios_icon_name="lightbulb.fill"
                android_material_icon_name="lightbulb"
                size={24}
                color={colors.accent}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Make the Most of It</Text>
            </View>
            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                Bring measurements of wall spaces where you'd like to display portraits
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                Consider bringing a partner or family member for a second opinion
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                Think about which rooms you'd like to feature your pet's portraits
              </Text>
            </View>
            <View style={styles.bulletPoint}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                Trust your instincts - choose the images that make your heart happy
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
