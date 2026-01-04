
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
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Href } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useTheme } from '@react-navigation/native';
import { useRouter, usePathname } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';

export interface TabBarItem {
  name: string;
  route: Href;
  icon: string;
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
          // Active color: #0F2A1A (dark green), Inactive color: #2B2B2B
          const color = active ? '#0F2A1A' : '#2B2B2B';

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabButton}
              onPress={() => handleTabPress(tab.route)}
              activeOpacity={0.7}
            >
              <IconSymbol
                android_material_icon_name={tab.icon}
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
