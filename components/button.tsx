
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { colors, buttonStyles } from '@/styles/commonStyles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'link';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return buttonStyles.instructionsButton;
      case 'secondary':
        return buttonStyles.secondaryButton;
      case 'outline':
        return buttonStyles.backButton;
      case 'link':
        return buttonStyles.linkButton;
      default:
        return buttonStyles.instructionsButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return buttonStyles.instructionsButtonText;
      case 'secondary':
        return buttonStyles.secondaryButtonText;
      case 'outline':
        return buttonStyles.backButtonText;
      case 'link':
        return buttonStyles.linkButtonText;
      default:
        return buttonStyles.instructionsButtonText;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        getButtonStyle(),
        style,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : colors.text} />
      ) : (
        <Text style={[getTextStyle(), textStyle, (disabled || loading) && styles.disabledText]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  pressed: {
    opacity: 0.8,
  },
});
