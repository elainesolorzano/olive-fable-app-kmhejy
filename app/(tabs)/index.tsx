
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { Logo } from '@/components/Logo';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  const handleLearnMore = () => {
    router.push('/(tabs)/learn');
  };

  const handleExploreGuides = () => {
    router.push('/(tabs)/learn');
  };

  const handleBookSession = () => {
    router.push('/(tabs)/book');
  };

  const handleBookWithOliveAndFable = () => {
    Linking.openURL('https://oliveandfable.honeybook.com');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Logo size="medium" style={styles.logo} />
      </View>

      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to Olive & Fable Studio</Text>
          <Text style={styles.welcomeText}>
            Hi, I&apos;m Gemma — CEO, treat tester, and quality control. This is where pet parents learn how to pose, prep, and create beautiful portraits.
          </Text>
        </View>

        <View style={styles.featuredTip}>
          <View style={styles.tipHeader}>
            <IconSymbol ios_icon_name="lightbulb" android_material_icon_name="lightbulb" size={24} color={colors.primary} />
            <Text style={styles.tipTitle}>Featured Posing Tip</Text>
          </View>
          <Text style={styles.tipText}>
            Start with treats at eye level to capture your pet&apos;s natural attention and expression.
          </Text>
          <Pressable style={buttonStyles.secondary} onPress={handleLearnMore}>
            <Text style={buttonStyles.secondaryText}>Learn More</Text>
          </Pressable>
        </View>

        <View style={styles.ctaSection}>
          <Pressable style={buttonStyles.primary} onPress={handleExploreGuides}>
            <Text style={buttonStyles.primaryText}>Explore Guides</Text>
          </Pressable>
          
          <Pressable style={buttonStyles.secondary} onPress={handleBookSession}>
            <Text style={buttonStyles.secondaryText}>Book a Session</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    marginBottom: 0,
  },
  content: {
    padding: 24,
    gap: 32,
  },
  welcomeSection: {
    gap: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
  },
  welcomeText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  featuredTip: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  tipText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  ctaSection: {
    gap: 12,
  },
});
