
import React from 'react';
import { Logo } from '@/components/Logo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
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
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  gemmaContainer: {
    marginBottom: 24,
  },
});

export default function ClientLoungeScreen() {
  const insets = useSafeAreaInsets();

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
          <View style={styles.logoContainer}>
            <Logo width={150} height={150} />
          </View>
          <Text style={styles.welcomeText}>
            Welcome to Olive & Fable
          </Text>
          <Text style={styles.subtitle}>
            Luxury pet portraits, guided by Gemma 🐾
          </Text>
        </View>

        {/* Gemma's Welcome Message */}
        <View style={styles.gemmaContainer}>
          <GemmaMessage
            message="Hi, I'm Gemma — CEO, treat tester, and quality control. This is where pet parents learn how to pose, prep, and create beautiful portraits."
            showAvatar={true}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          {/* Session Prep Card */}
          <Pressable 
            style={styles.card}
            onPress={() => {
              console.log('User tapped Session Preparation card');
              router.push('/(tabs)/(home)/session-prep');
            }}
          >
            <View style={styles.cardHeader}>
              <IconSymbol
                ios_icon_name="camera.fill"
                android_material_icon_name="camera"
                size={24}
                color={colors.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Session Preparation</Text>
            </View>
            <Text style={styles.cardDescription}>
              Get your pet ready for their portrait session with our step-by-step guide.
            </Text>
            <View style={styles.cardButton}>
              <Text style={styles.cardButtonText}>View Guide</Text>
            </View>
          </Pressable>

          {/* Getting to Studio Card */}
          <Pressable 
            style={styles.card}
            onPress={() => {
              console.log('User tapped Getting to the Studio card');
              router.push('/(tabs)/(home)/getting-to-studio');
            }}
          >
            <View style={styles.cardHeader}>
              <IconSymbol
                ios_icon_name="map.fill"
                android_material_icon_name="map"
                size={24}
                color={colors.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Getting to the Studio</Text>
            </View>
            <Text style={styles.cardDescription}>
              Find directions, parking information, and what to expect when you arrive.
            </Text>
            <View style={styles.cardButton}>
              <Text style={styles.cardButtonText}>View Details</Text>
            </View>
          </Pressable>

          {/* Reveal Prep Card */}
          <Pressable 
            style={styles.card}
            onPress={() => {
              console.log('User tapped Reveal Preparation card');
              router.push('/(tabs)/(home)/reveal-prep');
            }}
          >
            <View style={styles.cardHeader}>
              <IconSymbol
                ios_icon_name="star.fill"
                android_material_icon_name="star"
                size={24}
                color={colors.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Reveal Preparation</Text>
            </View>
            <Text style={styles.cardDescription}>
              Prepare for your portrait reveal and learn about our selection process.
            </Text>
            <View style={styles.cardButton}>
              <Text style={styles.cardButtonText}>Learn More</Text>
            </View>
          </Pressable>
        </View>

        {/* Featured Tip */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Posing Tip</Text>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <IconSymbol
                ios_icon_name="lightbulb.fill"
                android_material_icon_name="lightbulb"
                size={24}
                color={colors.accent}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Natural Light is Your Friend</Text>
            </View>
            <Text style={styles.cardDescription}>
              Position your pet near a window for soft, flattering light. Avoid harsh overhead lighting and direct sunlight for the best results.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
