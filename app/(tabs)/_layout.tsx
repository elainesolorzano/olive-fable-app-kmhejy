
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
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
      name: 'book',
      route: '/(tabs)/book',
      icon: 'calendar-today',
      label: 'Book',
    },
    {
      name: 'workshops',
      route: '/(tabs)/workshops',
      icon: 'lightbulb',
      label: 'Workshops',
    },
    {
      name: 'my-studio',
      route: '/(tabs)/my-studio',
      icon: 'person',
      label: 'My Studio',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="learn" name="learn" />
        <Stack.Screen key="book" name="book" />
        <Stack.Screen key="workshops" name="workshops" />
        <Stack.Screen key="my-studio" name="my-studio" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
