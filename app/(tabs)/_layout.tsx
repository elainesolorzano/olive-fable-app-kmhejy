
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  // Define the tabs configuration - 4 tabs (Notifications removed as standalone, accessed via My Studio)
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
      icon: 'image',
      label: 'Artwork',
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
      showNotificationBadge: true, // Show unread badge on My Studio tab
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
        {/* Hide index and notifications routes from tab bar */}
        <Stack.Screen name="index" options={{ href: null }} />
        <Stack.Screen name="notifications" options={{ href: null }} />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
