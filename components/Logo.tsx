
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export function Logo({ size = 'medium', style }: LogoProps) {
  const logoSize = size === 'large' ? 80 : size === 'medium' ? 60 : 40;
  const fontSize = size === 'large' ? 24 : size === 'medium' ? 18 : 14;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.logoCircle, { width: logoSize, height: logoSize }]}>
        <Text style={[styles.logoText, { fontSize }]}>O&F</Text>
      </View>
      <Text style={[styles.brandName, { fontSize: fontSize * 0.8 }]}>Olive & Fable Studio</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoCircle: {
    backgroundColor: '#111F0F',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  brandName: {
    color: '#111F0F',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
