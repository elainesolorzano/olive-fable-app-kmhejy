
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
  const { session, loading, refreshAuthAndUser } = useSupabaseAuth();
  const segments = useSegments();
  const router = useRouter();

  // Handle deep links - Universal HTTPS links for password reset and email confirmation
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      console.log('=== Deep link received in app ===');
      console.log('URL:', url);

      try {
        const urlObj = new URL(url);
        console.log('Parsed URL - protocol:', urlObj.protocol, 'hostname:', urlObj.hostname, 'pathname:', urlObj.pathname);

        // Handle universal HTTPS link for email confirmation
        // https://oliveandfable.com/appconfirmed
        if (urlObj.hostname === 'oliveandfable.com' && urlObj.pathname === '/appconfirmed') {
          console.log('✅ Email confirmation link detected (appconfirmed)');
          console.log('[Deep Link] Triggering auth refresh for email confirmation');
          
          // Trigger auth refresh to update email verification status
          refreshAuthAndUser();
          return;
        }

        // Handle universal HTTPS link for password reset
        // https://oliveandfable.com/reset-password?token_hash=...&type=recovery
        // OR with hash: https://oliveandfable.com/reset-password#token_hash=...&type=recovery
        if (urlObj.hostname === 'oliveandfable.com' && urlObj.pathname === '/reset-password') {
          console.log('✅ Universal HTTPS link detected for password reset');
          
          // Extract token_hash and type from query params OR hash fragment
          let tokenHash = urlObj.searchParams.get('token_hash');
          let type = urlObj.searchParams.get('type');
          
          // If not in query params, check hash fragment (Supabase often uses hash)
          if (!tokenHash && urlObj.hash) {
            const hashParams = new URLSearchParams(urlObj.hash.substring(1));
            tokenHash = hashParams.get('token_hash');
            type = hashParams.get('type');
            console.log('Extracted from hash - token_hash:', tokenHash ? 'present' : 'missing', 'type:', type);
          }
          
          console.log('Token hash:', tokenHash ? 'present' : 'missing');
          console.log('Type:', type);

          if (tokenHash && type === 'recovery') {
            console.log('Navigating to callback with recovery flow');
            // Navigate to callback handler with the recovery parameters
            router.push(`/(auth)/callback?token_hash=${tokenHash}&type=recovery&flow=recovery`);
          } else if (tokenHash) {
            // Token hash present but type might be missing, still try recovery
            console.log('Token hash present, assuming recovery flow');
            router.push(`/(auth)/callback?token_hash=${tokenHash}&type=recovery&flow=recovery`);
          } else {
            console.log('⚠️ Missing token_hash, redirecting to forgot password');
            router.push('/(auth)/forgot-password');
          }
          return;
        }

        // Check if URL contains auth/v1/verify (Supabase email confirmation)
        if (url.includes('auth/v1/verify')) {
          console.log('✅ Supabase email verification link detected');
          console.log('[Deep Link] Triggering auth refresh for email verification');
          
          // Trigger auth refresh to update email verification status
          refreshAuthAndUser();
          return;
        }

        // Handle custom scheme deep links (oliveandfable://)
        if (urlObj.protocol === 'oliveandfable:') {
          console.log('Custom scheme deep link detected');
          
          // Check if it's the auth callback
          if (urlObj.pathname.includes('auth/callback') || urlObj.pathname.includes('/callback')) {
            console.log('Auth callback deep link, navigating to callback handler');
            router.push('/(auth)/callback');
          }
          
          // Handle oliveandfable://reset-password as fallback
          if (urlObj.pathname.includes('reset-password')) {
            console.log('Reset password deep link detected');
            
            // Extract token_hash from query or hash
            let tokenHash = urlObj.searchParams.get('token_hash');
            let type = urlObj.searchParams.get('type');
            
            if (!tokenHash && urlObj.hash) {
              const hashParams = new URLSearchParams(urlObj.hash.substring(1));
              tokenHash = hashParams.get('token_hash');
              type = hashParams.get('type');
            }
            
            if (tokenHash) {
              console.log('Token hash found, navigating to callback');
              router.push(`/(auth)/callback?token_hash=${tokenHash}&type=recovery&flow=recovery`);
            } else {
              console.log('No token hash, redirecting to forgot password');
              router.push('/(auth)/forgot-password');
            }
          }
        }
      } catch (err) {
        console.log('Error parsing deep link URL:', err);
      }
    };

    // Listen for incoming deep links while app is running
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check if app was opened by a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('=== App opened with initial deep link ===');
        console.log('Initial URL:', url);
        
        try {
          const urlObj = new URL(url);
          
          // Handle universal HTTPS link for email confirmation
          if (urlObj.hostname === 'oliveandfable.com' && urlObj.pathname === '/appconfirmed') {
            console.log('✅ Initial URL is email confirmation link (appconfirmed)');
            console.log('[Deep Link] Triggering auth refresh for email confirmation');
            
            // Small delay to ensure auth context is ready
            setTimeout(() => {
              refreshAuthAndUser();
            }, 100);
            return;
          }

          // Handle universal HTTPS link for password reset
          if (urlObj.hostname === 'oliveandfable.com' && urlObj.pathname === '/reset-password') {
            console.log('✅ Initial URL is universal HTTPS link for password reset');
            
            // Extract token_hash and type from query params OR hash fragment
            let tokenHash = urlObj.searchParams.get('token_hash');
            let type = urlObj.searchParams.get('type');
            
            // If not in query params, check hash fragment
            if (!tokenHash && urlObj.hash) {
              const hashParams = new URLSearchParams(urlObj.hash.substring(1));
              tokenHash = hashParams.get('token_hash');
              type = hashParams.get('type');
              console.log('Extracted from hash - token_hash:', tokenHash ? 'present' : 'missing', 'type:', type);
            }
            
            console.log('Token hash:', tokenHash ? 'present' : 'missing');
            console.log('Type:', type);

            if (tokenHash && type === 'recovery') {
              console.log('Navigating to callback with recovery flow');
              // Small delay to ensure navigation is ready
              setTimeout(() => {
                router.push(`/(auth)/callback?token_hash=${tokenHash}&type=recovery&flow=recovery`);
              }, 100);
            } else if (tokenHash) {
              // Token hash present but type might be missing, still try recovery
              console.log('Token hash present, assuming recovery flow');
              setTimeout(() => {
                router.push(`/(auth)/callback?token_hash=${tokenHash}&type=recovery&flow=recovery`);
              }, 100);
            } else {
              console.log('⚠️ Missing token_hash, redirecting to forgot password');
              setTimeout(() => {
                router.push('/(auth)/forgot-password');
              }, 100);
            }
            return;
          }

          // Check if URL contains auth/v1/verify
          if (url.includes('auth/v1/verify')) {
            console.log('✅ Initial URL contains email verification');
            console.log('[Deep Link] Triggering auth refresh for email verification');
            
            setTimeout(() => {
              refreshAuthAndUser();
            }, 100);
            return;
          }

          // Handle custom scheme auth callback
          if (urlObj.protocol === 'oliveandfable:') {
            if (urlObj.pathname.includes('auth/callback') || urlObj.pathname.includes('/callback')) {
              console.log('Initial URL is auth callback, navigating to callback handler');
              setTimeout(() => {
                router.push('/(auth)/callback');
              }, 100);
            }
            
            // Handle oliveandfable://reset-password
            if (urlObj.pathname.includes('reset-password')) {
              console.log('Initial URL is reset password deep link');
              
              let tokenHash = urlObj.searchParams.get('token_hash');
              let type = urlObj.searchParams.get('type');
              
              if (!tokenHash && urlObj.hash) {
                const hashParams = new URLSearchParams(urlObj.hash.substring(1));
                tokenHash = hashParams.get('token_hash');
                type = hashParams.get('type');
              }
              
              if (tokenHash) {
                console.log('Token hash found, navigating to callback');
                setTimeout(() => {
                  router.push(`/(auth)/callback?token_hash=${tokenHash}&type=recovery&flow=recovery`);
                }, 100);
              } else {
                console.log('No token hash, redirecting to forgot password');
                setTimeout(() => {
                  router.push('/(auth)/forgot-password');
                }, 100);
              }
            }
          }
        } catch (err) {
          console.log('Error parsing initial URL:', err);
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [router, refreshAuthAndUser]);

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
