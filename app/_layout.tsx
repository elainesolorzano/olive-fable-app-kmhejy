
import "react-native-reanimated";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Linking from "expo-linking";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { SupabaseAuthProvider, useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { NotificationBadgeProvider } from "@/contexts/NotificationBadgeContext";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

function RootLayoutNav() {
  const { session, loading } = useSupabaseAuth();
  const segments = useSegments();
  const router = useRouter();

  // Handle deep links - UNIFIED CALLBACK ENTRY POINT
  // All Supabase email links (password reset, email verification) redirect to:
  // oliveandfable://auth/callback
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      console.log('Deep link received in app:', url);

      // Check if this is the unified auth callback
      if (url.startsWith('oliveandfable://auth/callback')) {
        console.log('Auth callback deep link detected, navigating to callback handler');
        // The callback screen will parse flow/type params and route accordingly
        router.push('/(auth)/callback');
      }
    };

    // Listen for incoming deep links while app is running
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check if app was opened by a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('App opened with initial deep link:', url);
        if (url.startsWith('oliveandfable://auth/callback')) {
          console.log('Initial deep link is auth callback, navigating to callback handler');
          // Small delay to ensure navigation is ready
          setTimeout(() => {
            router.push('/(auth)/callback');
          }, 100);
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [router]);

  useEffect(() => {
    if (loading) {
      console.log('Auth loading, waiting...');
      return;
    }

    console.log('Auth loaded. Session:', session ? 'Authenticated' : 'Not authenticated');
    console.log('Current segments:', segments);

    const inAuthGroup = segments[0] === "(auth)";

    // If user is authenticated and on auth screens, redirect to tabs
    if (session && inAuthGroup) {
      console.log('User authenticated, redirecting from auth screens to tabs');
      router.replace("/(tabs)");
    }

    // Note: We do NOT redirect unauthenticated users away from tabs
    // They can browse Home, Learn, and Workshops freely
    // My Studio will show its own login screen when accessed
  }, [session, loading, segments, router]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="my-studio" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          title: "Standard Modal",
        }}
      />
      <Stack.Screen
        name="formsheet"
        options={{
          presentation: "formSheet",
          title: "Form Sheet Modal",
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.5, 0.8, 1.0],
          sheetCornerRadius: 20,
        }}
      />
      <Stack.Screen
        name="transparent-modal"
        options={{
          presentation: "transparentModal",
          headerShown: false,
        }}
      />
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
      console.log('Fonts loaded, hiding splash screen');
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Olive & Fable Light Theme
  const OliveFableTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "#111F0F",
      background: "#F7F2EA",
      card: "#FFFFFF",
      text: "#111F0F",
      border: "#E2DDD5",
      notification: "#FF3B30",
    },
  };

  // Olive & Fable Dark Theme
  const OliveFableDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "#F7F2EA",
      background: "#1A1A1A",
      card: "#2B2B2B",
      text: "#F7F2EA",
      border: "#3A3A3A",
      notification: "#FF6B6B",
    },
  };

  return (
    <>
      <StatusBar style="auto" animated />
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? OliveFableDarkTheme : OliveFableTheme}
        >
          <SupabaseAuthProvider>
            <NotificationBadgeProvider>
              <WidgetProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <RootLayoutNav />
                  <SystemBars style={"auto"} />
                </GestureHandlerRootView>
              </WidgetProvider>
            </NotificationBadgeProvider>
          </SupabaseAuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </>
  );
}
