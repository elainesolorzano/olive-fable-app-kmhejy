
import React from 'react';
import { Tabs } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default function TabLayout() {
  const { session, loading } = useSupabaseAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // If no session, the root layout will redirect to login
  if (!session) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
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
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol name="house.fill" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color }) => <IconSymbol name="book.fill" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: 'Book',
          tabBarIcon: ({ color }) => <IconSymbol name="calendar" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="workshops"
        options={{
          title: 'Workshops',
          tabBarIcon: ({ color }) => <IconSymbol name="star.fill" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="my-studio"
        options={{
          title: 'My Studio',
          tabBarIcon: ({ color }) => <IconSymbol name="person.fill" color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
