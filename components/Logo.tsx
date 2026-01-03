
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

export function Logo({ size = 'medium' }: LogoProps) {
  const fontSize = size === 'small' ? 20 : size === 'large' ? 36 : 28;
  
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { fontSize }]}>🐾 Olive & Fable</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  text: {
    fontWeight: '700',
    color: colors.text,
  },
});
