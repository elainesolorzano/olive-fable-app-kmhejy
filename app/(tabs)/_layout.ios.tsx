
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger key="home" name="(home)">
        <Icon 
          sf="house.fill" 
          size={24} 
          color={{ light: '#111F0F', dark: '#FFFFFF' }} 
        />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="learn" name="learn">
        <Icon 
          sf="book.fill" 
          size={24} 
          color={{ light: '#111F0F', dark: '#FFFFFF' }} 
        />
        <Label>Learn</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="workshops" name="workshops">
        <Icon 
          sf="sparkles" 
          size={24} 
          color={{ light: '#111F0F', dark: '#FFFFFF' }} 
        />
        <Label>Workshops</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="my-studio" name="my-studio">
        <Icon 
          sf="person.fill" 
          size={24} 
          color={{ light: '#111F0F', dark: '#FFFFFF' }} 
        />
        <Label>My Studio</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
