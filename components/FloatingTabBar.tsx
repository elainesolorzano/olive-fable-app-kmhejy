
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Href } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useTheme } from '@react-navigation/native';
import { useRouter, usePathname } from 'expo-router';

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
    zIndex: 1000,
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F1E8',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
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
});

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width,
  borderRadius = 0,
  bottomMargin = 0,
}: FloatingTabBarProps) {
  const router = useRouter();
  const theme = useTheme();
  const pathname = usePathname();

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
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <View style={styles.tabBarContainer}>
        {tabs.map((tab) => {
          const active = isActive(tab.name);
          // Active color: #111F0F, Inactive color: #8A8A8A
          const color = active ? '#111F0F' : '#8A8A8A';

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabButton}
              onPress={() => handleTabPress(tab.route)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.icon}
                size={24}
                color={color}
              />
              <Text style={[styles.tabLabel, { color }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
