
import React from 'react';
import { Image, useColorScheme, StyleSheet, ViewStyle } from 'react-native';

type LogoSize = 'small' | 'medium' | 'large';

interface LogoProps {
  size?: LogoSize;
  style?: ViewStyle;
}

const sizeMap = {
  small: 140,
  medium: 220,
  large: 300,
};

export function Logo({ size = 'medium', style }: LogoProps) {
  const colorScheme = useColorScheme();
  const width = sizeMap[size];

  // Use white logo for dark backgrounds, dark logo for light backgrounds
  const logoSource = colorScheme === 'dark'
    ? require('@/assets/images/612076a1-7db2-409d-a462-e7c22774be7e.png') // White logo
    : require('@/assets/images/e28b056d-84c8-43ad-879f-7ff23ee74140.png'); // Dark logo

  return (
    <Image
      source={logoSource}
      style={[styles.logo, { width }, style]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    height: undefined,
    aspectRatio: 4.5, // Approximate ratio based on the logo dimensions
  },
});
