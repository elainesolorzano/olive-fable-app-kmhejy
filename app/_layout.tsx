
import { colors } from "@/styles/commonStyles";
import { useNetworkState } from "expo-network";
import { SystemBars } from "react-native-edge-to-edge";
import { StatusBar } from "expo-status-bar";
import { Stack, router, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { WidgetProvider } from "@/contexts/WidgetContext";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import "react-native-reanimated";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme, Alert, View, ActivityIndicator, StyleSheet } from "react-native";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SupabaseAuthProvider, useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

function RootLayoutNav() {
  const segments = useSegments();
  const { session, loading } = useSupabaseAuth();
  const networkState = useNetworkState();

  // Handle navigation based on auth state
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!session && !inAuthGroup) {
      // User is not signed in and not on auth screen, redirect to login
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      // User is signed in but on auth screen, redirect to tabs
      router.replace('/(tabs)/');
    }
  }, [session, loading, segments]);

  // Network connectivity check
  useEffect(() => {
    if (networkState.isConnected === false || networkState.isInternetReachable === false) {
      Alert.alert(
        "No Internet Connection",
        "Please check your internet connection and try again.",
        [{ text: "OK" }]
      );
    }
  }, [networkState.isConnected, networkState.isInternetReachable]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const customDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  const customLightTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? customDarkTheme : customLightTheme}>
        <SystemBars style={colorScheme === "dark" ? "light" : "dark"} />
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <SupabaseAuthProvider>
          <AuthProvider>
            <WidgetProvider>
              <RootLayoutNav />
            </WidgetProvider>
          </AuthProvider>
        </SupabaseAuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
