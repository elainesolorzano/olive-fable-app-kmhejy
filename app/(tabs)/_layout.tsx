
import React from 'react';
import { Tabs } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { IconSymbol } from '@/components/IconSymbol';

export default function TabLayout() {
  // Define the 5 tabs configuration
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)',
      icon: 'house.fill',
      label: 'Client Lounge',
    },
    {
      name: 'learn',
      route: '/(tabs)/learn',
      icon: 'book.fill',
      label: 'Learn',
    },
    {
      name: 'book',
      route: '/(tabs)/book',
      icon: 'calendar',
      label: 'Book',
    },
    {
      name: 'workshops',
      route: '/(tabs)/workshops',
      icon: 'person.3.fill',
      label: 'Workshops',
    },
    {
      name: 'my-studio',
      route: '/(tabs)/my-studio',
      icon: 'person.fill',
      label: 'My Studio',
    },
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide default tab bar
        }}
      >
        {/* Hide index route - it should not be a tab */}
        <Tabs.Screen 
          name="index" 
          options={{ href: null }} 
        />
        
        {/* Define only the 5 tabs */}
        <Tabs.Screen 
          name="(home)" 
          options={{ 
            title: 'Client Lounge',
            href: '/(tabs)/(home)',
          }} 
        />
        <Tabs.Screen 
          name="learn" 
          options={{ 
            title: 'Learn',
            href: '/(tabs)/learn',
          }} 
        />
        <Tabs.Screen 
          name="book" 
          options={{ 
            title: 'Book',
            href: '/(tabs)/book',
          }} 
        />
        <Tabs.Screen 
          name="workshops" 
          options={{ 
            title: 'Workshops',
            href: '/(tabs)/workshops',
          }} 
        />
        <Tabs.Screen 
          name="my-studio" 
          options={{ 
            title: 'My Studio',
            href: '/(tabs)/my-studio',
          }} 
        />
      </Tabs>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
