
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface ContentCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  items: ContentItem[];
  isFree: boolean;
}

interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'guide' | 'checklist';
  duration?: string;
  isFree: boolean;
}

const categories: ContentCategory[] = [
  {
    id: '1',
    title: 'Posing Your Pet',
    description: 'Master the art of getting your pet camera-ready',
    icon: 'pets',
    isFree: true,
    items: [
      { id: '1-1', title: 'The Perfect Sit', type: 'video', duration: '3 min', isFree: true },
      { id: '1-2', title: 'Natural Poses', type: 'guide', isFree: true },
      { id: '1-3', title: 'Working with Treats', type: 'video', duration: '5 min', isFree: false },
      { id: '1-4', title: 'Advanced Positioning', type: 'guide', isFree: false },
    ],
  },
  {
    id: '2',
    title: 'Preparing for Your Session',
    description: 'Everything you need to know before the big day',
    icon: 'checklist',
    isFree: true,
    items: [
      { id: '2-1', title: 'What to Bring', type: 'checklist', isFree: true },
      { id: '2-2', title: 'Grooming Tips', type: 'guide', isFree: false },
      { id: '2-3', title: 'Day-Of Preparation', type: 'video', duration: '4 min', isFree: false },
    ],
  },
  {
    id: '3',
    title: 'Phone Photography Tips',
    description: 'Capture great photos between sessions',
    icon: 'camera-alt',
    isFree: false,
    items: [
      { id: '3-1', title: 'Lighting Basics', type: 'video', duration: '6 min', isFree: false },
      { id: '3-2', title: 'Composition Guide', type: 'guide', isFree: false },
      { id: '3-3', title: 'Editing Your Photos', type: 'video', duration: '8 min', isFree: false },
    ],
  },
  {
    id: '4',
    title: 'Locations & Looks',
    description: 'Choose the perfect setting for your portrait',
    icon: 'location-on',
    isFree: false,
    items: [
      { id: '4-1', title: 'Indoor vs Outdoor', type: 'guide', isFree: false },
      { id: '4-2', title: 'Seasonal Considerations', type: 'guide', isFree: false },
      { id: '4-3', title: 'Outfit Coordination', type: 'video', duration: '5 min', isFree: false },
    ],
  },
  {
    id: '5',
    title: 'What to Expect at Olive & Fable',
    description: 'Your session walkthrough',
    icon: 'info',
    isFree: true,
    items: [
      { id: '5-1', title: 'Session Overview', type: 'video', duration: '7 min', isFree: true },
      { id: '5-2', title: 'Meet the Team', type: 'guide', isFree: true },
      { id: '5-3', title: 'After Your Session', type: 'guide', isFree: false },
    ],
  },
];

export default function LearnScreen() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    console.log(`Category ${categoryId} toggled`);
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleContentItemPress = (itemId: string, itemTitle: string) => {
    console.log(`Content item pressed: ${itemTitle} (${itemId})`);
    // TODO: Navigate to content detail or play video
  };

  const handleJoinMembership = () => {
    console.log('Join Membership button pressed');
    // TODO: Navigate to membership signup
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
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Learn</Text>
          <Text style={styles.subtitle}>
            Educational content to help you create beautiful portraits
          </Text>
        </View>

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
                        onPress={() => handleContentItemPress(item.id, item.title)}
                      >
                        <View style={styles.contentItemLeft}>
                          <IconSymbol 
                            ios_icon_name="play.circle.fill"
                            android_material_icon_name={getTypeIcon(item.type) as any}
                            size={20}
                            color={item.isFree ? colors.primary : colors.textSecondary}
                          />
                          <View style={styles.contentItemText}>
                            <Text style={styles.contentItemTitle}>{item.title}</Text>
                            {item.duration && (
                              <Text style={styles.contentItemDuration}>{item.duration}</Text>
                            )}
                          </View>
                        </View>
                        {!item.isFree && (
                          <View style={styles.lockBadge}>
                            <IconSymbol 
                              ios_icon_name="lock.fill"
                              android_material_icon_name="lock"
                              size={16}
                              color={colors.textSecondary}
                            />
                          </View>
                        )}
                      </Pressable>
                    </React.Fragment>
                  ))}
                </View>
              )}
            </View>
          </React.Fragment>
        ))}

        {/* Membership CTA */}
        <View style={[commonStyles.card, styles.ctaCard]}>
          <IconSymbol 
            ios_icon_name="star.fill"
            android_material_icon_name="star"
            size={32}
            color={colors.secondary}
            style={styles.ctaIcon}
          />
          <Text style={commonStyles.cardTitle}>Unlock All Guides</Text>
          <Text style={commonStyles.cardText}>
            Get full access to our complete library of educational content with membership.
          </Text>
          <Pressable 
            style={({ pressed }) => [
              buttonStyles.primaryButton,
              pressed && styles.pressed
            ]}
            onPress={handleJoinMembership}
          >
            <Text style={buttonStyles.buttonText}>Join Membership</Text>
          </Pressable>
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
  lockBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaCard: {
    alignItems: 'center',
    backgroundColor: colors.highlight,
  },
  ctaIcon: {
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.7,
  },
});
