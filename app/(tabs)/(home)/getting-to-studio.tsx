
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { GemmaMessage } from '@/components/GemmaMessage';

const TAB_BAR_HEIGHT = 60;

export default function GettingToStudioScreen() {
  const insets = useSafeAreaInsets();
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 24;

  const handleOpenMaps = () => {
    // TODO: Backend Integration - Fetch studio address from backend API
    const address = 'Olive & Fable Studio'; // Placeholder
    const url = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <GemmaMessage style={styles.gemmaSection}>
          <Text style={styles.gemmaText}>
            Welcome! I&apos;m so excited you&apos;re coming to visit. Here&apos;s everything you need to know about finding us and what to expect when you arrive.
          </Text>
          <Text style={styles.signature}>— Gemma 🐾</Text>
        </GemmaMessage>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="map.fill" 
              android_material_icon_name="place" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.sectionTitle}>Studio Location</Text>
          </View>
          <Text style={styles.bodyText}>
            Our studio is located in a quiet, pet-friendly area designed to help your furry friend feel comfortable and relaxed.
          </Text>
          <Pressable
            style={({ pressed }) => [
              buttonStyles.primary,
              styles.mapButton,
              pressed && buttonStyles.primaryPressed,
            ]}
            onPress={handleOpenMaps}
          >
            <IconSymbol 
              ios_icon_name="map" 
              android_material_icon_name="map" 
              size={20} 
              color="#FFFFFF" 
            />
            <Text style={[buttonStyles.primaryText, { marginLeft: 8 }]}>
              Open in Maps
            </Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="car.fill" 
              android_material_icon_name="directions-car" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.sectionTitle}>Parking</Text>
          </View>
          <Text style={styles.bodyText}>
            Free parking is available directly in front of the studio. There&apos;s also street parking nearby if needed.
          </Text>
          <View style={styles.tipBox}>
            <Text style={styles.tipText}>
              💡 Arrive 5-10 minutes early to give your pet time to settle in and explore the space.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="door.left.hand.open" 
              android_material_icon_name="meeting-room" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.sectionTitle}>What to Expect</Text>
          </View>
          <Text style={styles.bodyText}>
            When you arrive, you&apos;ll be greeted at the door. The studio is a calm, controlled environment with natural light and comfortable spaces for your pet to relax.
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Climate-controlled studio space
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Water bowls and treats available
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Comfortable seating for pet parents
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Professional lighting and backdrops
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="clock.fill" 
              android_material_icon_name="schedule" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.sectionTitle}>Session Timing</Text>
          </View>
          <Text style={styles.bodyText}>
            Most sessions last 60-90 minutes. We work at your pet&apos;s pace, with plenty of breaks for treats, play, and rest.
          </Text>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Questions?</Text>
          <Text style={styles.contactText}>
            If you have any trouble finding us or need to adjust your arrival time, please don&apos;t hesitate to reach out.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  gemmaSection: {
    marginBottom: 32,
  },
  gemmaText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#111F0F',
  },
  signature: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#111F0F',
    marginTop: 12,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 16,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipBox: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  tipText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  bulletList: {
    gap: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 12,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  contactSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
});
