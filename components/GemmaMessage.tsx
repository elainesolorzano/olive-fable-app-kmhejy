
import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface GemmaMessageProps {
  message?: string;
  showAvatar?: boolean;
  style?: ViewStyle;
}

const DEFAULT_MESSAGE = "Welcome to your Client Lounge! I've gathered everything you need to prepare for your session. — Gemma 🐾";

export function GemmaMessage({ message, showAvatar = true, style }: GemmaMessageProps) {
  const displayMessage = message || DEFAULT_MESSAGE;

  return (
    <View style={[styles.container, style]}>
      {showAvatar && (
        <View style={styles.avatarContainer}>
          <Image
            source={require('@/assets/images/bb700b49-eac8-433e-a8be-ad5057bdb80c.jpeg')}
            style={styles.avatar}
          />
        </View>
      )}
      <View style={styles.bubble}>
        <Text style={styles.messageText}>{displayMessage}</Text>
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
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E8E3DC',
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bubble: {
    flex: 1,
    backgroundColor: '#F5F1E8',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E3DC',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1A1A1A',
    fontWeight: '400',
  },
});
