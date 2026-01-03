
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="getting-to-studio" 
        options={{ 
          title: 'Getting to the Studio',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="session-prep" 
        options={{ 
          title: 'Session Preparation',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="reveal-prep" 
        options={{ 
          title: 'Reveal Preparation',
          headerShown: true,
        }} 
      />
    </Stack>
  );
}
