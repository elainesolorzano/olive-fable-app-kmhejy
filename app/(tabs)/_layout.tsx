
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={22} style={{ marginBottom: -2, opacity: 1 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // IMPORTANT: force a fully-opaque tab bar so icons/labels never look translucent
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          opacity: 1,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: "#111F0F",
        tabBarInactiveTintColor: "#2B2B2B",
        tabBarLabelStyle: {
          fontSize: 11,
          opacity: 1,
        },
        tabBarIconStyle: {
          opacity: 1,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      {/* Home MUST be the folder group name "(home)" because Home lives at app/(tabs)/(home)/index.tsx */}
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />

      <Tabs.Screen
        name="workshops"
        options={{
          title: "Workshops",
          tabBarIcon: ({ color }) => <TabBarIcon name="grid" color={color} />,
        }}
      />

      <Tabs.Screen
        name="my-studio"
        options={{
          title: "My Studio",
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
        }}
      />

      {/* Hide internal Home stack screens so they NEVER appear as tabs */}
      <Tabs.Screen name="(home)/index" options={{ href: null }} />
      <Tabs.Screen name="(home)/getting-to-studio" options={{ href: null }} />
      <Tabs.Screen name="(home)/reveal-prep" options={{ href: null }} />
      <Tabs.Screen name="(home)/session-prep" options={{ href: null }} />
    </Tabs>
  );
}
