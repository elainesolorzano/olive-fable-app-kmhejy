
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      {/* Main tab screens - these 4 tabs will be visible */}
      <NativeTabs.Trigger name="(home)">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="learn">
        <Icon sf="book.fill" />
        <Label>Learn</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="workshops">
        <Icon sf="calendar" />
        <Label>Workshops</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="my-studio">
        <Icon sf="person.fill" />
        <Label>My Studio</Label>
      </NativeTabs.Trigger>
      
      {/* Hidden screen - this will not appear in the tab bar */}
      <NativeTabs.Screen name="index" options={{ href: null }} />
    </NativeTabs>
  );
}
