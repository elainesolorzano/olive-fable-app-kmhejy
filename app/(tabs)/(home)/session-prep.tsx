
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { GemmaMessage } from '@/components/GemmaMessage';
import React from 'react';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 90 : 70;

const timeline = [
  {
    id: 'week-before',
    title: '1 Week Before',
    items: [
      { id: 'week-groom', text: 'Schedule grooming if needed' },
      { id: 'week-outfit', text: 'Plan your outfit (neutrals work best)' },
      { id: 'week-practice', text: 'Practice basic commands with treats' }
    ]
  },
  {
    id: 'day-before',
    title: 'Day Before',
    items: [
      { id: 'day-exercise', text: 'Give your pet extra exercise' },
      { id: 'day-pack', text: 'Pack treats, favorite toy, water' },
      { id: 'day-nails', text: 'Trim nails if comfortable doing so' }
    ]
  },
  {
    id: 'session-day',
    title: 'Session Day',
    items: [
      { id: 'session-meal', text: 'Light meal 2-3 hours before' },
      { id: 'session-potty', text: 'Potty break right before leaving' },
      { id: 'session-arrive', text: 'Arrive 10 minutes early to settle in' }
    ]
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: TAB_BAR_HEIGHT + 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  timelineItem: {
    marginBottom: 24,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 18,
    marginBottom: 8,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: colors.border,
  },
  checkIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  checklistText: {
    flex: 1,
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});

export default function SessionPrepScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.title}>Session Prep</Text>
          <Text style={styles.subtitle}>
            A timeline to help you and your pet arrive relaxed and ready
          </Text>
        </View>

        <GemmaMessage 
          message="The secret to great photos? A calm, happy pet. Follow this timeline and we'll handle the rest."
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preparation Timeline</Text>
          {timeline.map((item) => (
            <View key={item.id} style={styles.timelineItem}>
              <View style={styles.timelineHeader}>
                <View style={styles.timelineDot} />
                <Text style={styles.timelineTitle}>{item.title}</Text>
              </View>
              {item.items.map((checkItem) => (
                <View key={checkItem.id} style={styles.checklistItem}>
                  <IconSymbol 
                    ios_icon_name="checkmark.circle.fill"
                    android_material_icon_name="check-circle"
                    size={20}
                    color={colors.primary}
                    style={styles.checkIcon}
                  />
                  <Text style={styles.checklistText}>{checkItem.text}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
