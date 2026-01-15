
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
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
          <Text style={styles.bodyText}>
            We believe communication should feel thoughtful and intentional, never overwhelming. Notification controls will be available in a future update.
          </Text>
        </View>

        <View style={[commonStyles.card, styles.infoCard]}>
          <Text style={styles.infoHeaderText}>
            You may receive occasional updates related to:
          </Text>
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
            <Text style={styles.infoText}>Order and artwork progress updates</Text>
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
            <Text style={styles.infoText}>Important studio updates</Text>
          </View>
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.supportingText}>
            Until notification preferences are available, we&apos;ll only reach out when it truly matters.
          </Text>
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
  iconContainer: {
    marginBottom: 24,
  },
  bodyText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: colors.highlight,
  },
  infoHeaderText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text,
    marginBottom: 12,
    paddingLeft: 8,
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
  supportingText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
