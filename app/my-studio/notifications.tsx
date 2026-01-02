
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function NotificationsScreen() {
  return (
    <View style={commonStyles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <IconSymbol 
            ios_icon_name="bell.fill"
            android_material_icon_name="notifications"
            size={80}
            color={colors.primary}
          />
        </View>
        
        <Text style={commonStyles.title}>Notifications</Text>
        
        <View style={commonStyles.card}>
          <Text style={styles.comingSoonText}>
            Notification settings are coming soon!
          </Text>
          <Text style={styles.descriptionText}>
            Manage your notification preferences for new content, workshop announcements, session reminders, and more.
          </Text>
        </View>

        <View style={[commonStyles.card, styles.infoCard]}>
          <Text style={styles.infoTitle}>You&apos;ll be able to control:</Text>
          <View style={styles.infoItem}>
            <IconSymbol 
              ios_icon_name="circle.fill"
              android_material_icon_name="circle"
              size={8}
              color={colors.textSecondary}
            />
            <Text style={styles.infoText}>New content notifications</Text>
          </View>
          <View style={styles.infoItem}>
            <IconSymbol 
              ios_icon_name="circle.fill"
              android_material_icon_name="circle"
              size={8}
              color={colors.textSecondary}
            />
            <Text style={styles.infoText}>Workshop announcements</Text>
          </View>
          <View style={styles.infoItem}>
            <IconSymbol 
              ios_icon_name="circle.fill"
              android_material_icon_name="circle"
              size={8}
              color={colors.textSecondary}
            />
            <Text style={styles.infoText}>Session reminders</Text>
          </View>
          <View style={styles.infoItem}>
            <IconSymbol 
              ios_icon_name="circle.fill"
              android_material_icon_name="circle"
              size={8}
              color={colors.textSecondary}
            />
            <Text style={styles.infoText}>Gallery updates</Text>
          </View>
        </View>

        <Pressable 
          style={({ pressed }) => [
            buttonStyles.primaryButton,
            pressed && styles.pressed
          ]}
          onPress={() => router.back()}
        >
          <Text style={buttonStyles.buttonText}>Go Back</Text>
        </Pressable>
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
  iconContainer: {
    marginBottom: 24,
  },
  comingSoonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: colors.highlight,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text,
    marginLeft: 12,
  },
  pressed: {
    opacity: 0.7,
  },
});
