
import React from 'react';
import { Tabs } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#111F0F',
        tabBarInactiveTintColor: '#2B2B2B',
        tabBarLabelStyle: { 
          fontSize: 12, 
          fontWeight: '600', 
          opacity: 1 
        },
        tabBarIconStyle: { 
          opacity: 1 
        },
        tabBarStyle: { 
          backgroundColor: '#FFFFFF', 
          opacity: 1 
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol 
              ios_icon_name="house.fill" 
              android_material_icon_name="home" 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          tabBarLabel: 'Learn',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol 
              ios_icon_name="book.fill" 
              android_material_icon_name="menu-book" 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="workshops"
        options={{
          tabBarLabel: 'Workshops',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol 
              ios_icon_name="rectangle.grid.2x2.fill" 
              android_material_icon_name="grid-view" 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my-studio"
        options={{
          tabBarLabel: 'My Studio',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol 
              ios_icon_name="person.fill" 
              android_material_icon_name="person" 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
