
import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#111F0F',
  secondary: '#2B2B2B',
  accent: '#8E8E93',
  background: '#F7F2EA',
  backgroundAlt: '#FFFFFF',
  text: '#111F0F',
  textSecondary: '#2B2B2B',
  textTertiary: '#8E8E93',
  border: '#E2DDD5',
  card: '#FFFFFF',
  surface: '#FFFFFF',
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  primaryPressed: {
    opacity: 0.8,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  secondary: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  secondaryText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
});

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
