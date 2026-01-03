
import React from 'react';
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ title: 'Client Lounge' }} 
      />
      <Stack.Screen 
        name="getting-to-studio" 
        options={{ title: 'Getting to the Studio' }} 
      />
      <Stack.Screen 
        name="session-prep" 
        options={{ title: 'Session Preparation' }} 
      />
      <Stack.Screen 
        name="reveal-prep" 
        options={{ title: 'Reveal Preparation' }} 
      />
    </Stack>
  );
}
