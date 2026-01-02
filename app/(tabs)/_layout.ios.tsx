
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  return (
    <NativeTabs
      tintColor={colors.primary}
      iconColor={colors.textSecondary}
      backgroundColor={colors.card}
    >
      <NativeTabs.Trigger name="(home)">
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="learn">
        <Icon sf={{ default: 'book', selected: 'book.fill' }} />
        <Label>Learn</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="book">
        <Icon sf={{ default: 'calendar', selected: 'calendar.badge.clock' }} />
        <Label>Book</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="workshops">
        <Icon sf={{ default: 'lightbulb', selected: 'lightbulb.fill' }} />
        <Label>Workshops</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="my-studio">
        <Icon sf={{ default: 'person', selected: 'person.fill' }} />
        <Label>My Studio</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
