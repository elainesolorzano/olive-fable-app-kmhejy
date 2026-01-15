
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function PrivacyScreen() {
  console.log('Privacy & Security screen loaded');

  const handlePrivacyPolicy = () => {
    console.log('User tapped Privacy Policy button');
    Linking.openURL('https://www.oliveandfable.com/privacypolicy');
  };

  const handleTermsOfService = () => {
    console.log('User tapped Terms of Service button');
    Linking.openURL('https://www.oliveandfable.com/termsofservice');
  };

  const handleContactStudio = () => {
    console.log('User tapped Contact the Studio button for data request');
    Linking.openURL('mailto:info@oliveandfable.com?subject=Account%20%26%20Data%20Request');
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
            ios_icon_name="lock.fill"
            android_material_icon_name="lock"
            size={80}
            color={colors.primary}
          />
        </View>
        
        <Text style={commonStyles.title}>Privacy & Security</Text>
        
        <View style={commonStyles.card}>
          <Text style={styles.descriptionText}>
            Your trust matters. We are committed to protecting your personal information and respecting your privacy at every step.
          </Text>
        </View>

        <Pressable 
          style={({ pressed }) => [
            buttonStyles.primaryButton,
            pressed && styles.pressed
          ]}
          onPress={handlePrivacyPolicy}
        >
          <Text style={buttonStyles.buttonText}>Privacy Policy</Text>
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            buttonStyles.primaryButton,
            pressed && styles.pressed,
            styles.buttonSpacing
          ]}
          onPress={handleTermsOfService}
        >
          <Text style={buttonStyles.buttonText}>Terms of Service</Text>
        </Pressable>

        <View style={[commonStyles.card, styles.infoCard]}>
          <Text style={styles.infoTitle}>Your Data</Text>
          <Text style={styles.descriptionText}>
            If you&apos;d like to request access to your data, make updates, or ask for deletion, our team is happy to help.
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
  infoCard: {
    backgroundColor: colors.highlight,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonSpacing: {
    marginTop: 12,
  },
  pressed: {
    opacity: 0.7,
  },
});
