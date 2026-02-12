
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  // Define the tabs configuration - 5 tabs (Notifications restored as standalone)
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
      name: 'notifications',
      route: '/(tabs)/notifications',
      icon: 'notifications',
      label: 'Notifications',
      showNotificationBadge: true, // Show unread badge on Notifications tab
    },
    {
      name: 'my-studio',
      route: '/(tabs)/my-studio',
      icon: 'person',
      label: 'My Studio',
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
        <Stack.Screen key="notifications" name="notifications" />
        <Stack.Screen key="my-studio" name="my-studio" />
        {/* Hide index route from tab bar */}
        <Stack.Screen name="index" options={{ href: null }} />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
