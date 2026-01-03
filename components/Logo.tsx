
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Logo() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🐾 Olive & Fable</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  text: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C2C2E',
  },
});
