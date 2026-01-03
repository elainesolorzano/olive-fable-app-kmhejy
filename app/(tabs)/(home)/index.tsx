
import React from "react";
import { FlatList, StyleSheet, View, Platform } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { modalDemos } from "@/components/homeData";
import { DemoCard } from "@/components/DemoCard";

const TAB_BAR_HEIGHT = 60;

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // Calculate bottom padding: tab bar height + safe area bottom + extra spacing
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 32;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={modalDemos}
        renderItem={({ item }) => <DemoCard item={item} />}
        keyExtractor={(item) => item.route}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: bottomPadding }
        ]}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingTop: 48,
    paddingHorizontal: 16,
    // paddingBottom handled dynamically
  },
});
