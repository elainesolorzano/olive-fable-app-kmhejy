
import React from 'react';
import { Tabs } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 20,
          paddingTop: 8,
          height: 88,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      {/* Hide index route */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      
      {/* Client Lounge (Home) Tab */}
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Client Lounge',
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

      {/* Learn Tab */}
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
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

      {/* Workshops Tab */}
      <Tabs.Screen
        name="workshops"
        options={{
          title: 'Workshops',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol
              ios_icon_name="calendar"
              android_material_icon_name="event"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* My Studio Tab */}
      <Tabs.Screen
        name="my-studio"
        options={{
          title: 'My Studio',
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

      {/* Hide Book tab - removed from navigation */}
      <Tabs.Screen
        name="book"
        options={{
          href: null,
        }}
      />

      {/* Hide Profile tab */}
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
