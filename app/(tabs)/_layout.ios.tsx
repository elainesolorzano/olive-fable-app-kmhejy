
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  // Define the tabs configuration - 5 tabs with Ionicons
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
      icon: 'book', // Will use book for active, book-outline for inactive
      label: 'Learn',
    },
    {
      name: 'workshops',
      route: '/(tabs)/workshops',
      icon: 'calendar', // Will use calendar for active, calendar-outline for inactive
      label: 'Workshops',
    },
    {
      name: 'notifications',
      route: '/(tabs)/notifications',
      icon: 'notifications', // Will use notifications for active, notifications-outline for inactive
      label: 'Notifications',
      showNotificationBadge: true, // Show unread badge on this tab
    },
    {
      name: 'my-studio',
      route: '/(tabs)/my-studio',
      icon: 'person', // Will use person for active, person-outline for inactive
      label: 'My Studio',
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
        <Stack.Screen key="notifications" name="notifications" />
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
