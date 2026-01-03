
import React from 'react';
import { Image, StyleSheet, useColorScheme, ImageStyle, StyleProp } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: StyleProp<ImageStyle>;
}

export const Logo: React.FC<LogoProps> = ({ size = 'medium', style }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Use the dark logo for dark mode, light logo for light mode
  const logoSource = isDark
    ? require('../assets/images/3ddfe683-98c2-4e84-814e-ace81e30b295.png')
    : require('../assets/images/e6233161-f521-4dc0-877d-65f3c1340176.png');

  const sizeMap = {
    small: { width: 120, height: 40 },
    medium: { width: 200, height: 67 },
    large: { width: 280, height: 93 },
  };

  const dimensions = sizeMap[size];

  return (
    <Image
      source={logoSource}
      style={[styles.logo, dimensions, style]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
  },
});
