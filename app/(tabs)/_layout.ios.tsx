
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs
      tabBarActiveTintColor="#111F0F"
      tabBarInactiveTintColor="#8A8A8A"
    >
      {/* Hide index route from tab bar */}
      <NativeTabs.Screen name="index" options={{ href: null }} />
      
      {/* Define the 4 visible tabs */}
      <NativeTabs.Trigger key="home" name="(home)">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger key="learn" name="learn">
        <Icon sf="book.fill" />
        <Label>Learn</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger key="workshops" name="workshops">
        <Icon sf="calendar" />
        <Label>Workshops</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger key="my-studio" name="my-studio">
        <Icon sf="person.fill" />
        <Label>My Studio</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
