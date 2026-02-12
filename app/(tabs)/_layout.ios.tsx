
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  // Define the tabs configuration - 4 tabs (Notifications removed as standalone, accessed via My Studio)
  // Using active/inactive icon variants as specified
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'home', // Will use home for active, home-outline for inactive
      label: 'Home',
    },
    {
      name: 'learn',
      route: '/(tabs)/learn',
      icon: 'image', // Will use image for active, image-outline for inactive
      label: 'Artwork',
    },
    {
      name: 'workshops',
      route: '/(tabs)/workshops',
      icon: 'calendar', // Will use calendar for active, calendar-outline for inactive
      label: 'Workshops',
    },
    {
      name: 'my-studio',
      route: '/(tabs)/my-studio',
      icon: 'person', // Will use person for active, person-outline for inactive
      label: 'My Studio',
      showNotificationBadge: true, // Show unread badge on My Studio tab
    },
  ];

  // Use Stack navigation with custom floating tab bar (same as Android/Web)
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
