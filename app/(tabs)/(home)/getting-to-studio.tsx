
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
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.text,
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
    const address = 'Olive and Fable Pet Photography, 720 Market Street, Suite J, Kirkland, WA 98034';
    const encodedAddress = encodeURIComponent(address);
    
    let url: string;
    
    if (Platform.OS === 'ios') {
      // Use Apple Maps on iOS with proper format
      url = `http://maps.apple.com/?q=${encodedAddress}`;
    } else if (Platform.OS === 'android') {
      // Try geo: scheme first, with Google Maps HTTPS as fallback
      const geoUrl = `geo:0,0?q=${encodedAddress}`;
      const canOpenGeo = await Linking.canOpenURL(geoUrl);
      
      if (canOpenGeo) {
        url = geoUrl;
      } else {
        // Fallback to Google Maps HTTPS URL
        url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      }
    } else {
      // Web and other platforms use Google Maps HTTPS
      url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log('Cannot open maps URL:', url);
        Alert.alert('Error', 'Unable to open maps application');
      }
    } catch (error) {
      console.log('Error opening maps:', error);
      Alert.alert('Error', 'Unable to open maps application');
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
              <Text style={styles.buttonText}>Open in Maps</Text>
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
                Free parking available in the lot behind the building
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
                Street parking available on Main Street (2-hour limit)
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
                Accessible parking spots available near the entrance
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
                Enter through the main entrance on Main Street
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
                Take the elevator or stairs to the second floor
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
                Studio 205 is on your right - ring the bell and we'll greet you!
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
                Wheelchair accessible entrance and elevator
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
                Accessible restroom facilities on the second floor
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
