
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Href } from 'expo-router';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface TabBarItem {
  name: string;
  route: Href;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F5F1E8', // Solid background that extends to bottom
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F1E8',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  iconWrapper: {
    opacity: 1, // Explicitly set opacity to 1 to ensure icons are visible
  },
});

// Icon mapping: active (filled) and inactive (outline) variants
const iconMap: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  home: { active: 'home', inactive: 'home-outline' },
  book: { active: 'book', inactive: 'book-outline' },
  calendar: { active: 'calendar', inactive: 'calendar-outline' },
  person: { active: 'person', inactive: 'person-outline' },
};

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width,
  borderRadius = 0,
  bottomMargin = 0,
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const handleTabPress = (route: Href) => {
    console.log('Tab pressed:', route);
    router.push(route);
  };

  const isActive = (tabName: string) => {
    if (tabName === '(home)') {
      return pathname.startsWith('/(tabs)/(home)') || pathname === '/(tabs)/';
    }
    return pathname.includes(`/(tabs)/${tabName}`);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBarContainer}>
        {tabs.map((tab) => {
          const active = isActive(tab.name);
          // Active color: #111F0F, Inactive color: #8A8A8A
          const color = active ? '#111F0F' : '#8A8A8A';
          
          // Get the correct icon variant (filled for active, outline for inactive)
          const iconVariants = iconMap[tab.icon as string];
          const iconName = iconVariants 
            ? (active ? iconVariants.active : iconVariants.inactive)
            : tab.icon;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabButton}
              onPress={() => handleTabPress(tab.route)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <Ionicons
                  name={iconName}
                  size={24}
                  color={color}
                  style={{ opacity: 1 }}
                />
              </View>
              <Text style={[styles.tabLabel, { color }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
