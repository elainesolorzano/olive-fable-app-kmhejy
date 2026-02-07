
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Image, Modal, TouchableOpacity } from 'react-native';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import WebView from 'react-native-webview';

interface DisplayOption {
  id: string;
  title: string;
  body: string;
  imageUrl: string;
  investmentUrl: string;
}

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 64;

const displayOptions: DisplayOption[] = [
  {
    id: 'prints',
    title: 'Matted Fine Art Prints',
    body: 'A classic, museum-style option. Perfect for framing, gifting, or building a collection over time. Clean, timeless, and designed to elevate your portraits.',
    imageUrl: 'https://images.squarespace-cdn.com/content/v1/67c1f9d2eb4c2e2665801269/ebdfbec8-e0b5-4c6e-83d3-9ba1b104dad2/3XM_image.jpg',
    investmentUrl: 'https://www.oliveandfable.com/prints',
  },
  {
    id: 'wallart',
    title: 'Wall Art',
    body: 'Create a statement piece for your home. Choose a single hero portrait or a collage layout to showcase multiple favorites together in a cohesive, gallery-style display.',
    imageUrl: 'https://images.squarespace-cdn.com/content/v1/67c1f9d2eb4c2e2665801269/a07dea79-e09c-42fd-bae6-44c7bbabaac8/Doramockup.jpg',
    investmentUrl: 'https://www.oliveandfable.com/wallart',
  },
  {
    id: 'boxes',
    title: 'Portrait Boxes',
    body: 'An heirloom way to keep and rotate your portraits. A beautifully crafted box designed to hold fine art prints — elegant, intentional, and made to last.',
    imageUrl: 'https://images.squarespace-cdn.com/content/v1/67c1f9d2eb4c2e2665801269/2aa79b86-de47-4a0c-a380-40899fa02380/Reveal_Box_15.jpg',
    investmentUrl: 'https://www.oliveandfable.com/portraitbox',
  },
];

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
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  intro: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.06)',
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.06)',
      },
      default: {
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.06)',
      },
    }),
  },
  cardImage: {
    width: '100%',
    height: 240,
    backgroundColor: colors.border,
  },
  cardContent: {
    padding: 24,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  cardBody: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
    letterSpacing: 0.1,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonPlaceholder: {
    width: 32,
  },
  webView: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default function LearnScreen() {
  console.log('LearnScreen: Rendering Display Options screen');
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  const handleViewDetails = (option: DisplayOption) => {
    console.log('LearnScreen: User tapped View Details for:', option.title);
    setCurrentUrl(option.investmentUrl);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    console.log('LearnScreen: User closed WebView modal');
    setModalVisible(false);
    setCurrentUrl('');
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
          <Text style={styles.title}>Artwork</Text>
          <Text style={styles.subtitle}>Display Options</Text>
          <Text style={styles.intro}>
            Your portraits are created to live beautifully in your home. Explore our most-loved ways to display your artwork — from timeless matted prints to statement wall art and heirloom portrait boxes.
          </Text>
        </View>

        {/* Display Option Cards */}
        {displayOptions.map((option) => (
          <View key={option.id} style={styles.card}>
            <Image
              source={{ uri: option.imageUrl }}
              style={styles.cardImage}
              resizeMode="cover"
              onError={(error) => {
                console.log('LearnScreen: Image failed to load for', option.title, error.nativeEvent.error);
              }}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardBody}>{option.body}</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && { opacity: 0.8 }
                ]}
                onPress={() => handleViewDetails(option)}
              >
                <Text style={styles.buttonText}>View Details</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* WebView Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <View style={styles.closeButtonPlaceholder} />
            <Text style={styles.modalTitle}>Investment</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <IconSymbol
                ios_icon_name="xmark"
                android_material_icon_name="close"
                size={18}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
          <WebView
            source={{ uri: currentUrl }}
            style={styles.webView}
            startInLoadingState={true}
            javaScriptEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            allowsFullscreenVideo={true}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.log('LearnScreen: WebView error:', nativeEvent);
            }}
            onLoadStart={() => {
              console.log('LearnScreen: WebView started loading:', currentUrl);
            }}
            onLoadEnd={() => {
              console.log('LearnScreen: WebView finished loading:', currentUrl);
            }}
          />
        </View>
      </Modal>
    </View>
  );
}
