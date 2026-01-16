
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
      { id: 'week-groom', text: 'Schedule grooming if needed (clean face, brushed coat, tidy paws)' },
      { id: 'week-practice', text: 'Practice a few simple cues with treats (sit, stay, look)' },
      { id: 'week-outfit', text: 'Plan your outfits (soft neutrals and earthy tones photograph best)' },
      { id: 'week-toy', text: 'Set aside a favorite toy or comfort item that feels like them' }
    ]
  },
  {
    id: 'day-before',
    title: 'Day Before',
    items: [
      { id: 'day-exercise', text: 'Give your pet a little extra exercise for a relaxed arrival' },
      { id: 'day-pack', text: 'Pack high value treats, water, and a bowl' },
      { id: 'day-brush', text: 'Bring a brush or grooming wipes for quick touch ups' },
      { id: 'day-nails', text: 'If comfortable, trim nails or plan a paw tidy so they look their best' }
    ]
  },
  {
    id: 'session-day',
    title: 'Session Day',
    items: [
      { id: 'session-routine', text: 'Keep the routine normal (meals, naps, and walks as usual)' },
      { id: 'session-potty', text: 'Take a quick potty break right before coming in' },
      { id: 'session-arrive', text: 'Arrive a few minutes early to let them settle in' },
      { id: 'session-relax', text: 'Relax and enjoy it, calm energy helps your pet feel safe and confident' }
    ]
  }
];

const whatToBring = [
  { id: 'bring-treats', text: 'High value treats' },
  { id: 'bring-toy', text: 'A favorite toy or comfort item' },
  { id: 'bring-brush', text: 'Brush or grooming wipes' },
  { id: 'bring-water', text: 'Water (especially for longer sessions)' },
  { id: 'bring-accessory', text: 'Any meaningful accessory you love (collar, bandana, heirloom tag)' }
];

const whatToExpect = [
  { id: 'expect-space', text: 'A calm, welcoming space where your pet can explore first' },
  { id: 'expect-pace', text: 'Gentle direction and breaks when needed, we move at your pet\'s pace' },
  { id: 'expect-focus', text: 'We focus on expression, connection, and the little details that make them who they are' }
];

const includingHumans = [
  { id: 'human-colors', text: 'Choose soft neutrals or earthy tones that complement your pet' },
  { id: 'human-avoid', text: 'Avoid heavy patterns or bright neon colors' },
  { id: 'human-timeless', text: 'Simple, timeless pieces keep the focus on connection' }
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
  gemmaContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
  simpleChecklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
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

        <View style={styles.gemmaContainer}>
          <GemmaMessage 
            message="We're so excited to welcome you and your pet to the studio! Here are a few tips to help you prepare for a relaxed and joyful session."
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preparation Timeline</Text>
          {timeline.map((item) => (
            <React.Fragment key={item.id}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineHeader}>
                  <View style={styles.timelineDot} />
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                </View>
                {item.items.map((checkItem) => (
                  <React.Fragment key={checkItem.id}>
                    <View style={styles.checklistItem}>
                      <IconSymbol 
                        ios_icon_name="checkmark.circle.fill"
                        android_material_icon_name="check-circle"
                        size={20}
                        color={colors.primary}
                        style={styles.checkIcon}
                      />
                      <Text style={styles.checklistText}>{checkItem.text}</Text>
                    </View>
                  </React.Fragment>
                ))}
              </View>
            </React.Fragment>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What to Bring</Text>
          {whatToBring.map((item) => (
            <React.Fragment key={item.id}>
              <View style={styles.simpleChecklistItem}>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={20}
                  color={colors.primary}
                  style={styles.checkIcon}
                />
                <Text style={styles.checklistText}>{item.text}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What to Expect in the Studio</Text>
          {whatToExpect.map((item) => (
            <React.Fragment key={item.id}>
              <View style={styles.simpleChecklistItem}>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={20}
                  color={colors.primary}
                  style={styles.checkIcon}
                />
                <Text style={styles.checklistText}>{item.text}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Including Humans</Text>
          {includingHumans.map((item) => (
            <React.Fragment key={item.id}>
              <View style={styles.simpleChecklistItem}>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={20}
                  color={colors.primary}
                  style={styles.checkIcon}
                />
                <Text style={styles.checklistText}>{item.text}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
