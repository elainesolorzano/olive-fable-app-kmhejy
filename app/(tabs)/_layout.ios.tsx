
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger key="home" name="(home)">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="learn" name="learn">
        <Icon sf="book.fill" />
        <Label>Learn</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="workshops" name="workshops">
        <Icon sf="lightbulb.fill" />
        <Label>Workshops</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="my-studio" name="my-studio">
        <Icon sf="person.crop.circle.fill" />
        <Label>My Studio</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
