
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router, Stack } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function PurchasesScreen() {
  return (
    <View style={commonStyles.container}>
      <Stack.Screen 
        options={{
          title: 'Purchases',
          headerShown: true,
        }}
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyState}>
          <View style={styles.iconContainer}>
            <IconSymbol 
              ios_icon_name="bag.fill"
              android_material_icon_name="shopping-bag"
              size={80}
              color={colors.textSecondary}
            />
          </View>
          <Text style={styles.emptyTitle}>No Purchases Yet</Text>
          <Text style={styles.emptyText}>
            Workshops are coming soon! When they launch, your workshop purchases will appear here.
          </Text>
          <Pressable 
            style={({ pressed }) => [
              buttonStyles.primaryButton,
              pressed && styles.pressed
            ]}
            onPress={() => router.push('/(tabs)/workshops')}
          >
            <Text style={buttonStyles.buttonText}>Explore Workshops</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    maxWidth: 300,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  pressed: {
    opacity: 0.7,
  },
});
