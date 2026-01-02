
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';

export default function MyStudioLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen 
        name="edit-profile" 
        options={{ 
          title: 'Edit Profile',
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="membership" 
        options={{ 
          title: 'Membership',
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="saved" 
        options={{ 
          title: 'Saved Content',
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="purchases" 
        options={{ 
          title: 'Purchases',
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="notifications" 
        options={{ 
          title: 'Notifications',
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="privacy" 
        options={{ 
          title: 'Privacy',
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="support" 
        options={{ 
          title: 'Help & Support',
          presentation: 'card',
        }} 
      />
    </Stack>
  );
}
