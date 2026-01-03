
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

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
  categoryCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  expandIcon: {
    marginLeft: 12,
  },
  itemsList: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemIcon: {
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  lockedBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  lockedText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text,
  },
  ctaCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    marginTop: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: colors.text,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function LearnScreen() {
  const { session } = useSupabaseAuth();
  const insets = useSafeAreaInsets();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const categories: ContentCategory[] = [
    {
      id: 'posing',
      title: 'Posing Your Pet',
      description: 'Master the art of pet posing',
      icon: 'camera',
      items: [
        { id: '1', title: 'Basic Sitting Poses', type: 'video', duration: '5 min' },
        { id: '2', title: 'Action Shots', type: 'video', duration: '7 min' },
        { id: '3', title: 'Group Pet Portraits', type: 'guide' },
      ],
    },
    {
      id: 'prep',
      title: 'Session Preparation',
      description: 'Get ready for your shoot',
      icon: 'checklist',
      items: [
        { id: '4', title: 'What to Bring Checklist', type: 'checklist' },
        { id: '5', title: 'Grooming Tips', type: 'guide' },
        { id: '6', title: 'Calming Techniques', type: 'video', duration: '4 min' },
      ],
    },
    {
      id: 'phone',
      title: 'Phone Photography',
      description: 'Take better photos at home',
      icon: 'phone-android',
      items: [
        { id: '7', title: 'Lighting Basics', type: 'video', duration: '6 min' },
        { id: '8', title: 'Composition Guide', type: 'guide' },
        { id: '9', title: 'Editing Tips', type: 'video', duration: '8 min' },
      ],
    },
    {
      id: 'locations',
      title: 'Locations & Looks',
      description: 'Choose the perfect setting',
      icon: 'location-on',
      items: [
        { id: '10', title: 'Indoor vs Outdoor', type: 'guide' },
        { id: '11', title: 'Seasonal Backdrops', type: 'video', duration: '5 min' },
        { id: '12', title: 'Props & Accessories', type: 'guide' },
      ],
    },
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleContentItemPress = (item: ContentItem, itemTitle: string) => {
    if (!session) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to access this content.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: handleSignIn },
        ]
      );
      return;
    }

    // TODO: Navigate to content detail screen
    Alert.alert('Coming Soon', `"${itemTitle}" will be available soon!`);
  };

  const handleSignIn = () => {
    router.push('/(auth)/login');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return 'play-circle';
      case 'guide':
        return 'description';
      case 'checklist':
        return 'checklist';
      default:
        return 'article';
    }
  };

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
          <Text style={styles.title}>Learn</Text>
          <Text style={styles.subtitle}>
            Master pet photography and session preparation with our expert guides
          </Text>
        </View>

        {/* Categories */}
        {categories.map((category) => {
          const isExpanded = expandedCategories.includes(category.id);
          
          return (
            <Pressable
              key={category.id}
              style={styles.categoryCard}
              onPress={() => toggleCategory(category.id)}
            >
              <View style={styles.categoryHeader}>
                <View style={styles.categoryLeft}>
                  <IconSymbol
                    ios_icon_name={category.icon}
                    android_material_icon_name={category.icon}
                    size={24}
                    color={colors.primary}
                    style={styles.categoryIcon}
                  />
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryTitle}>{category.title}</Text>
                    <Text style={styles.categoryDescription}>
                      {category.description}
                    </Text>
                  </View>
                </View>
                <IconSymbol
                  ios_icon_name={isExpanded ? 'chevron.up' : 'chevron.down'}
                  android_material_icon_name={isExpanded ? 'expand-less' : 'expand-more'}
                  size={24}
                  color={colors.textSecondary}
                  style={styles.expandIcon}
                />
              </View>

              {isExpanded && (
                <View style={styles.itemsList}>
                  {category.items.map((item) => (
                    <Pressable
                      key={item.id}
                      style={styles.contentItem}
                      onPress={() => handleContentItemPress(item, item.title)}
                    >
                      <IconSymbol
                        ios_icon_name={getTypeIcon(item.type)}
                        android_material_icon_name={getTypeIcon(item.type)}
                        size={20}
                        color={colors.accent}
                        style={styles.itemIcon}
                      />
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemMeta}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                          {item.duration && ` • ${item.duration}`}
                        </Text>
                      </View>
                      {!session && (
                        <View style={styles.lockedBadge}>
                          <Text style={styles.lockedText}>LOCKED</Text>
                        </View>
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </Pressable>
          );
        })}

        {/* CTA for non-members */}
        {!session && (
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Unlock All Content</Text>
            <Text style={styles.ctaDescription}>
              Sign in to access the full library of guides, videos, and checklists
            </Text>
            <Pressable style={styles.ctaButton} onPress={handleSignIn}>
              <Text style={styles.ctaButtonText}>Sign In</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
