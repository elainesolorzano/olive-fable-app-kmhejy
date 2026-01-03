
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors } from '@/styles/commonStyles';

interface GemmaMessageProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function GemmaMessage({ children, style }: GemmaMessageProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.avatarCircle}>
        <IconSymbol 
          ios_icon_name="pawprint.fill" 
          android_material_icon_name="pets" 
          size={24} 
          color={colors.brand} 
        />
      </View>
      <View style={styles.bubble}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F1E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    flex: 1,
    backgroundColor: '#F5F1E8',
    borderRadius: 16,
    padding: 16,
  },
});
