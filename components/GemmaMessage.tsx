
import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';

interface GemmaMessageProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function GemmaMessage({ children, style }: GemmaMessageProps) {
  return (
    <View style={[styles.container, style]}>
      <Image 
        source={require('../assets/gemma.jpg')} 
        style={styles.avatar}
      />
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
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  bubble: {
    flex: 1,
    backgroundColor: '#F5F1E8', // Beige
    borderRadius: 16,
    padding: 16,
  },
});
