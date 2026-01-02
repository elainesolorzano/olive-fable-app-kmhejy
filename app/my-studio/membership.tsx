
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function MembershipScreen() {
  return (
    <View style={commonStyles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <IconSymbol 
            ios_icon_name="crown.fill"
            android_material_icon_name="workspace-premium"
            size={80}
            color={colors.secondary}
          />
        </View>
        
        <Text style={commonStyles.title}>The Olive & Fable Club</Text>
        
        <View style={commonStyles.card}>
          <Text style={styles.comingSoonText}>
            Membership features are coming soon!
          </Text>
          <Text style={styles.descriptionText}>
            Join The Olive & Fable Club for exclusive access to educational content, early workshop access, and member-only announcements.
          </Text>
        </View>

        <View style={[commonStyles.card, styles.benefitsCard]}>
          <Text style={styles.benefitsTitle}>What&apos;s Included:</Text>
          <View style={styles.benefitItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={20}
              color={colors.secondary}
            />
            <Text style={styles.benefitText}>Full Learn library access</Text>
          </View>
          <View style={styles.benefitItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={20}
              color={colors.secondary}
            />
            <Text style={styles.benefitText}>Early workshop access</Text>
          </View>
          <View style={styles.benefitItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={20}
              color={colors.secondary}
            />
            <Text style={styles.benefitText}>Exclusive announcements</Text>
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
  benefitsCard: {
    backgroundColor: colors.highlight,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text,
    marginLeft: 12,
  },
  pressed: {
    opacity: 0.7,
  },
});
