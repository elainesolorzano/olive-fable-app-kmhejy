
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export function Logo({ variant = 'dark', size = 'medium', style }: LogoProps) {
  const logoSource = variant === 'light' 
    ? require('@/assets/images/12a1ff25-c564-4ced-9d53-091ac2ef06c4.png')
    : require('@/assets/images/7fb4a5e6-54d4-453d-82d5-89b21766854f.png');

  const sizeStyles = {
    small: { width: 120, height: 40 },
    medium: { width: 200, height: 66 },
    large: { width: 280, height: 93 }
  };

  return (
    <View style={[styles.container, style]}>
      <Image 
        source={logoSource} 
        style={[styles.logo, sizeStyles[size]]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    // Aspect ratio maintained by resizeMode="contain"
  }
});
