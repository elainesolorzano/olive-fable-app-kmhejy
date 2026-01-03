
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_HEIGHT = 60;

interface ContentCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  items: ContentItem[];
}

interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'guide' | 'checklist';
  duration?: string;
}

const categories: ContentCategory[] = [
  {
    id: '1',
    title: 'Posing Your Pet',
    description: 'Master the art of getting your pet camera-ready',
    icon: 'pets',
    items: [
      { id: '1-1', title: 'The Perfect Sit', type: 'video', duration: '3 min' },
      { id: '1-2', title: 'Natural Poses', type: 'guide' },
      { id: '1-3', title: 'Working with Treats', type: 'video', duration: '5 min' },
      { id: '1-4', title: 'Advanced Positioning', type: 'guide' },
    ],
  },
  {
    id: '2',
    title: 'Preparing for Your Session',
    description: 'Everything you need to know before the big day',
    icon: 'checklist',
    items: [
      { id: '2-1', title: 'What to Bring', type: 'checklist' },
      { id: '2-2', title: 'Grooming Tips', type: 'guide' },
      { id: '2-3', title: 'Day-Of Preparation', type: 'video', duration: '4 min' },
    ],
  },
  {
    id: '3',
    title: 'Phone Photography Tips',
    description: 'Capture great photos between sessions',
    icon: 'camera-alt',
    items: [
      { id: '3-1', title: 'Lighting Basics', type: 'video', duration: '6 min' },
      { id: '3-2', title: 'Composition Guide', type: 'guide' },
      { id: '3-3', title: 'Editing Your Photos', type: 'video', duration: '8 min' },
    ],
  },
  {
    id: '4',
    title: 'Locations & Looks',
    description: 'Choose the perfect setting for your portrait',
    icon: 'location-on',
    items: [
      { id: '4-1', title: 'Indoor vs Outdoor', type: 'guide' },
      { id: '4-2', title: 'Seasonal Considerations', type: 'guide' },
      { id: '4-3', title: 'Outfit Coordination', type: 'video', duration: '5 min' },
    ],
  },
  {
    id: '5',
    title: 'What to Expect at Olive & Fable',
    description: 'Your session walkthrough',
    icon: 'info',
    items: [
      { id: '5-1', title: 'Session Overview', type: 'video', duration: '7 min' },
      { id: '5-2', title: 'Meet the Team', type: 'guide' },
      { id: '5-3', title: 'After Your Session', type: 'guide' },
    ],
  },
];

export default function LearnScreen() {
  const { session } = useSupabaseAuth();
  const insets = useSafeAreaInsets();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const isAuthenticated = !!session;

  // Calculate bottom padding: tab bar height + safe area bottom + extra spacing
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 24;

  const toggleCategory = (categoryId: string) => {
    console.log(`Category ${categoryId} toggled`);
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleContentItemPress = (item: ContentItem, itemTitle: string) => {
    console.log(`Content item pressed: ${itemTitle} (${item.id})`);
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to access full learning content.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/(auth)/login') }
        ]
      );
      return;
    }

    // TODO: Navigate to content detail or play video
    Alert.alert('Coming Soon', `${itemTitle} will be available soon!`);
  };

  const handleSignIn = () => {
    console.log('Sign In button pressed');
    router.push('/(auth)/login');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return 'play-circle-filled';
      case 'guide':
        return 'description';
      case 'checklist':
        return 'checklist';
      default:
        return 'article';
    }
  };

  return (
    <View style={commonStyles.container} pointerEvents="auto">
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: bottomPadding }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Learn</Text>
          <Text style={styles.subtitle}>
            Educational content to help you create beautiful portraits
          </Text>
        </View>

        {/* Sign In CTA - Only show if not authenticated */}
        {!isAuthenticated && (
          <View style={[commonStyles.card, styles.signInCard]}>
            <IconSymbol 
              ios_icon_name="person.circle.fill"
              android_material_icon_name="account-circle"
              size={32}
              color={colors.primary}
              style={styles.signInIcon}
            />
            <Text style={commonStyles.cardTitle}>Sign In for Full Access</Text>
            <Text style={commonStyles.cardText}>
              Create a free account to access all learning resources and educational content.
            </Text>
            <Pressable 
              style={({ pressed }) => [
                buttonStyles.primaryButton,
                pressed && styles.pressed
              ]}
              onPress={handleSignIn}
            >
              <Text style={buttonStyles.buttonText}>Sign In / Create Account</Text>
            </Pressable>
          </View>
        )}

        {/* Categories */}
        {categories.map((category, categoryIndex) => (
          <React.Fragment key={`category-${category.id}-${categoryIndex}`}>
            <View style={commonStyles.card}>
              <Pressable 
                style={({ pressed }) => [
                  styles.categoryHeader,
                  pressed && styles.pressed
                ]}
                onPress={() => toggleCategory(category.id)}
              >
                <View style={styles.categoryHeaderLeft}>
                  <IconSymbol 
                    ios_icon_name="book.fill"
                    android_material_icon_name={category.icon as any}
                    size={24}
                    color={colors.primary}
                  />
                  <View style={styles.categoryHeaderText}>
                    <Text style={commonStyles.cardTitle}>{category.title}</Text>
                    <Text style={commonStyles.cardText}>{category.description}</Text>
                  </View>
                </View>
                <IconSymbol 
                  ios_icon_name={expandedCategory === category.id ? 'chevron.up' : 'chevron.down'}
                  android_material_icon_name={expandedCategory === category.id ? 'expand-less' : 'expand-more'}
                  size={24}
                  color={colors.textSecondary}
                />
              </Pressable>

              {expandedCategory === category.id && (
                <View style={styles.categoryContent}>
                  {category.items.map((item, itemIndex) => (
                    <React.Fragment key={`category-${category.id}-item-${item.id}-${itemIndex}`}>
                      <Pressable 
                        style={({ pressed }) => [
                          styles.contentItem,
                          pressed && styles.pressed
                        ]}
                        onPress={() => handleContentItemPress(item, item.title)}
                      >
                        <View style={styles.contentItemLeft}>
                          <IconSymbol 
                            ios_icon_name="play.circle.fill"
                            android_material_icon_name={getTypeIcon(item.type) as any}
                            size={20}
                            color={colors.primary}
                          />
                          <View style={styles.contentItemText}>
                            <Text style={styles.contentItemTitle}>
                              {item.title}
                            </Text>
                            {item.duration && (
                              <Text style={styles.contentItemDuration}>{item.duration}</Text>
                            )}
                          </View>
                        </View>
                      </Pressable>
                    </React.Fragment>
                  ))}
                </View>
              )}
            </View>
          </React.Fragment>
        ))}

        {/* Free Access Message for Authenticated Users */}
        {isAuthenticated && (
          <View style={[commonStyles.card, styles.freeAccessCard]}>
            <IconSymbol 
              ios_icon_name="checkmark.seal.fill"
              android_material_icon_name="verified"
              size={32}
              color={colors.secondary}
              style={styles.freeAccessIcon}
            />
            <Text style={commonStyles.cardTitle}>All Content is Free!</Text>
            <Text style={commonStyles.cardText}>
              Enjoy unlimited access to all our educational resources. Workshops coming soon!
            </Text>
          </View>
        )}
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
    // paddingBottom handled dynamically
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 24,
    marginTop: 8,
  },
  signInCard: {
    alignItems: 'center',
    backgroundColor: colors.highlight,
  },
  signInIcon: {
    marginBottom: 12,
  },
  freeAccessCard: {
    alignItems: 'center',
    backgroundColor: colors.highlight,
  },
  freeAccessIcon: {
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  categoryHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  categoryContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.accent,
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  contentItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contentItemText: {
    marginLeft: 12,
    flex: 1,
  },
  contentItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  contentItemDuration: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
});
