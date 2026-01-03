
import React from 'react';
import { Tabs } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#111F0F',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#F7F2EA',
          borderTopColor: '#E2DDD5',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
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
          title: 'Learn',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol
              ios_icon_name="book.fill"
              android_material_icon_name="menu_book"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="workshops"
        options={{
          title: 'Workshops',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol
              ios_icon_name="sparkles"
              android_material_icon_name="auto_awesome"
              size={size}
              color={color}
            />
          ),
        }}
      />
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
    </Tabs>
  );
}
