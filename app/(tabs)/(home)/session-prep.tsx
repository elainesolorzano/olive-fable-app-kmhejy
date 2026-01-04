
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
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineDot: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 8,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  timelineDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 8,
  },
  checkIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  checklistText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
});

export default function SessionPrepScreen() {
  const insets = useSafeAreaInsets();

  const timeline = [
    {
      id: 'seven-days',
      title: '7 Days Before',
      description: 'Start preparing your pet for the session',
      checklist: [
        { id: 'seven-days-1', text: 'Schedule grooming appointment' },
        { id: 'seven-days-2', text: 'Practice sitting and staying commands' },
        { id: 'seven-days-3', text: 'Choose your favorite collar or accessories' },
        { id: 'seven-days-4', text: 'Review location and parking information' },
      ],
    },
    {
      id: 'forty-eight-hours',
      title: '48 Hours Before',
      description: 'Final preparations',
      checklist: [
        { id: 'forty-eight-hours-1', text: 'Confirm your appointment time' },
        { id: 'forty-eight-hours-2', text: 'Prepare treats and favorite toys' },
        { id: 'forty-eight-hours-3', text: 'Plan your outfit (if joining photos)' },
        { id: 'forty-eight-hours-4', text: 'Get a good night\'s sleep' },
      ],
    },
    {
      id: 'day-of',
      title: 'Day Of',
      description: 'Session day checklist',
      checklist: [
        { id: 'day-of-1', text: 'Feed your pet 2-3 hours before' },
        { id: 'day-of-2', text: 'Take a walk to burn energy' },
        { id: 'day-of-3', text: 'Bring water and treats' },
        { id: 'day-of-4', text: 'Arrive 10 minutes early' },
        { id: 'day-of-5', text: 'Relax and have fun!' },
      ],
    },
  ];

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
          <Text style={styles.title}>Session Preparation</Text>
          <Text style={styles.subtitle}>
            Follow this timeline to ensure your pet is ready for their portrait session
          </Text>
        </View>

        {/* Gemma's Message */}
        <View style={styles.gemmaContainer}>
          <GemmaMessage
            message="A well-prepared pet makes for a relaxed session and beautiful portraits. Follow these steps and we'll create magic together!"
            showAvatar={true}
          />
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preparation Timeline</Text>
          {timeline.map((item, index) => (
            <React.Fragment key={item.id}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot}>
                  <View style={styles.dot} />
                  {index < timeline.length - 1 && <View style={styles.line} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  <Text style={styles.timelineDescription}>{item.description}</Text>
                  {item.checklist.map((checkItem) => (
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
              </View>
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
