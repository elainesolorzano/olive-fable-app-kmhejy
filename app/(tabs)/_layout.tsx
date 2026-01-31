
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { useNotificationBadge } from '@/contexts/NotificationBadgeContext';

export default function TabLayout() {
  const { unreadCount } = useNotificationBadge();

  // Define the tabs configuration - exactly 4 tabs with Ionicons
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'home',
      label: 'Home',
    },
    {
      name: 'learn',
      route: '/(tabs)/learn',
      icon: 'book',
      label: 'Learn',
    },
    {
      name: 'workshops',
      route: '/(tabs)/workshops',
      icon: 'calendar',
      label: 'Workshops',
    },
    {
      name: 'my-studio',
      route: '/(tabs)/my-studio',
      icon: 'person',
      label: 'My Studio',
      badgeCount: unreadCount,
    },
  ];

  // For Android and Web, use Stack navigation with custom floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none', // Remove fade animation to prevent black screen flash
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="learn" name="learn" />
        <Stack.Screen key="workshops" name="workshops" />
        <Stack.Screen key="my-studio" name="my-studio" />
        {/* Hide index, book, and profile routes from tab bar */}
        <Stack.Screen name="index" options={{ href: null }} />
        <Stack.Screen name="book" options={{ href: null }} />
        <Stack.Screen name="profile" options={{ href: null }} />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
