
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { GemmaMessage } from '@/components/GemmaMessage';
import { View, Text, StyleSheet, ScrollView, Linking, Pressable, Platform, Alert } from 'react-native';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 64;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  gemmaContainer: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  address: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#111F0F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
});

export default function GettingToStudioScreen() {
  const insets = useSafeAreaInsets();

  const handleOpenMaps = async () => {
    console.log('User tapped Locate Here button to open Apple Maps');
    
    // Define the full address
    const fullAddress = 'Olive and Fable Pet Photography, 720 Market Street, Suite J, Kirkland, WA 98034';
    
    // Use Apple Maps URL format (works on iOS and falls back gracefully on other platforms)
    const appleMapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(fullAddress)}`;

    try {
      console.log('Opening Apple Maps with URL:', appleMapsUrl);
      await Linking.openURL(appleMapsUrl);
    } catch (error) {
      console.log('Error opening Apple Maps, attempting fallback:', error);
      // Fallback: try opening the same URL again
      try {
        await Linking.openURL(appleMapsUrl);
      } catch (fallbackError) {
        console.log('Fallback also failed:', fallbackError);
        Alert.alert(
          'Unable to Open Maps',
          'Could not open the maps application. Please try again later.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 16 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Getting to the Studio</Text>
          <Text style={styles.subtitle}>
            Everything you need to know about finding and accessing our studio
          </Text>
        </View>

        {/* Gemma's Message */}
        <View style={styles.gemmaContainer}>
          <GemmaMessage
            message="I'll be waiting for you at the studio! Here's everything you need to know about getting here and what to expect when you arrive."
            showAvatar={true}
          />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Studio Location</Text>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <IconSymbol
                ios_icon_name="map.fill"
                android_material_icon_name="location-on"
                size={24}
                color={colors.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Address</Text>
            </View>
            <Text style={styles.address}>
              Olive and Fable Pet Photography{'\n'}
              720 Market Street{'\n'}
              Suite J{'\n'}
              Kirkland, WA 98034
            </Text>
            <Pressable style={styles.button} onPress={handleOpenMaps}>
              <Text style={styles.buttonText}>Locate Here</Text>
            </Pressable>
          </View>
        </View>

        {/* Parking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parking Information</Text>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <IconSymbol
                ios_icon_name="car.fill"
                android_material_icon_name="local-parking"
                size={24}
                color={colors.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Where to Park</Text>
            </View>
            <View style={styles.infoRow}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={20}
                color={colors.primary}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                Complimentary parking is available directly in front of the building (two marked spaces).
              </Text>
            </View>
            <View style={styles.infoRow}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={20}
                color={colors.primary}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                Free street parking is also available right out front when spots are open.
              </Text>
            </View>
            <View style={styles.infoRow}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={20}
                color={colors.primary}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                If you have any trouble locating us, please call or text (206) 310-8619 and we&apos;ll be happy to help.
              </Text>
            </View>
          </View>
        </View>

        {/* Arrival */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upon Arrival</Text>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <IconSymbol
                ios_icon_name="door.left.hand.open"
                android_material_icon_name="meeting-room"
                size={24}
                color={colors.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>What to Expect</Text>
            </View>
            <View style={styles.infoRow}>
              <IconSymbol
                ios_icon_name="1.circle.fill"
                android_material_icon_name="looks-one"
                size={20}
                color={colors.accent}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                Enter through the main entrance on Market Street.
              </Text>
            </View>
            <View style={styles.infoRow}>
              <IconSymbol
                ios_icon_name="2.circle.fill"
                android_material_icon_name="looks-two"
                size={20}
                color={colors.accent}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                Once inside, follow the hallway.
              </Text>
            </View>
            <View style={styles.infoRow}>
              <IconSymbol
                ios_icon_name="3.circle.fill"
                android_material_icon_name="looks-3"
                size={20}
                color={colors.accent}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                You&apos;ll find Suite J on your right — ring the studio bell and we&apos;ll greet you.
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <IconSymbol
                ios_icon_name="clock.fill"
                android_material_icon_name="schedule"
                size={24}
                color={colors.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Timing</Text>
            </View>
            <Text style={styles.cardDescription}>
              Please arrive 10 minutes before your scheduled session time. This gives your pet a chance to settle in and get comfortable with the space.
            </Text>
          </View>
        </View>

        {/* Accessibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility</Text>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <IconSymbol
                ios_icon_name="figure.roll"
                android_material_icon_name="accessible"
                size={24}
                color={colors.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Accessible Features</Text>
            </View>
            <View style={styles.infoRow}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={20}
                color={colors.primary}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                Wheelchair accessible entrance
              </Text>
            </View>
            <View style={styles.infoRow}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={20}
                color={colors.primary}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                Restroom facilities available
              </Text>
            </View>
            <View style={styles.infoRow}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={20}
                color={colors.primary}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                Ground-level studio space with no steps inside
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
