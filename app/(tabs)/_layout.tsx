
import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

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
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
        tabBarStyle: {
          backgroundColor: '#F7F2EA',
          borderTopColor: '#E2DDD5',
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 64,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarShowLabel: true,
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
