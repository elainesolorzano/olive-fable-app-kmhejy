
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function SupportScreen() {
  console.log('Help & Support screen loaded');

  const handleContactStudio = () => {
    console.log('User tapped Contact the Studio button');
    Linking.openURL('mailto:info@oliveandfable.com');
  };

  const handleViewFAQs = () => {
    console.log('User tapped View FAQs button');
    // TODO: Add FAQ URL when available
    Linking.openURL('https://www.oliveandfable.com');
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <IconSymbol 
            ios_icon_name="questionmark.circle.fill"
            android_material_icon_name="help"
            size={80}
            color={colors.primary}
          />
        </View>
        
        <Text style={commonStyles.title}>Help & Support</Text>
        
        <View style={commonStyles.card}>
          <Text style={styles.descriptionText}>
            At Olive & Fable, we believe the experience should feel just as intentional and beautiful as the artwork itself.
          </Text>
        </View>

        <Pressable 
          style={({ pressed }) => [
            buttonStyles.primaryButton,
            pressed && styles.pressed
          ]}
          onPress={handleContactStudio}
        >
          <Text style={buttonStyles.buttonText}>Contact the Studio</Text>
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            buttonStyles.secondaryButton,
            pressed && styles.pressed,
            styles.buttonSpacing
          ]}
          onPress={handleViewFAQs}
        >
          <Text style={buttonStyles.secondaryButtonText}>View FAQs</Text>
        </Pressable>

        <View style={[commonStyles.card, styles.footerCard]}>
          <Text style={styles.footerText}>
            We typically respond within one business day.
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
  descriptionText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonSpacing: {
    marginTop: 12,
  },
  footerCard: {
    backgroundColor: colors.highlight,
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.7,
  },
});
