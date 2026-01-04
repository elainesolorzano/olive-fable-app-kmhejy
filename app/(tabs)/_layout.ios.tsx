
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(home)">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="learn">
        <Icon sf="book.fill" />
        <Label>Learn</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="workshops">
        <Icon sf="rectangle.grid.2x2.fill" />
        <Label>Workshops</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="my-studio">
        <Icon sf="person.fill" />
        <Label>My Studio</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="index" options={{ href: null }} />
    </NativeTabs>
  );
}
