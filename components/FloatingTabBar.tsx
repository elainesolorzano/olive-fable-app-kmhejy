
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { IconSymbol } from '@/components/IconSymbol';
import { BlurView } from 'expo-blur';
import { Href } from 'expo-router';
import React from 'react';
import { colors } from '@/styles/commonStyles';
import { useRouter, usePathname } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TabBarItem {
  route: Href;
  label: string;
  ios_icon_name: string;
  android_material_icon_name: string;
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.card,
  },
  tab: {
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
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width * 0.9,
  borderRadius = 24,
  bottomMargin = 16,
}: FloatingTabBarProps) {
  const activeIndex = useSharedValue(0);
  const router = useRouter();
  const pathname = usePathname();

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const tabWidth = containerWidth / tabs.length;
    return {
      width: tabWidth * 0.6,
      transform: [
        {
          translateX: withSpring(activeIndex.value * tabWidth + tabWidth * 0.2, {
            damping: 20,
            stiffness: 200,
          }),
        },
      ],
    };
  });

  const handleTabPress = (route: Href, index: number) => {
    activeIndex.value = index;
    router.push(route);
  };

  React.useEffect(() => {
    const currentIndex = tabs.findIndex((tab) => {
      const tabRoute = typeof tab.route === 'string' ? tab.route : tab.route.pathname;
      return pathname === tabRoute || pathname.startsWith(tabRoute as string);
    });
    if (currentIndex !== -1) {
      activeIndex.value = currentIndex;
    }
  }, [pathname, tabs]);

  const TabBarContent = () => (
    <View style={[styles.tabBar, { width: containerWidth, borderRadius }]}>
      <Animated.View style={[styles.activeIndicator, animatedIndicatorStyle]} />
      {tabs.map((tab, index) => {
        const tabRoute = typeof tab.route === 'string' ? tab.route : tab.route.pathname;
        const isActive = pathname === tabRoute || pathname.startsWith(tabRoute as string);

        return (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => handleTabPress(tab.route, index)}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name={tab.ios_icon_name}
              android_material_icon_name={tab.android_material_icon_name}
              size={24}
              color={isActive ? colors.primary : colors.grey}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? colors.primary : colors.grey },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView edges={['bottom']} style={[styles.container, { marginBottom: bottomMargin }]}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={80} tint="light" style={{ borderRadius, overflow: 'hidden' }}>
          <TabBarContent />
        </BlurView>
      ) : (
        <TabBarContent />
      )}
    </SafeAreaView>
  );
}
