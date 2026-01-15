
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Linking, Image, Modal, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import WebView from 'react-native-webview';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 64;

// Data structures with stable unique IDs to prevent React key warnings
const selectionProcessSteps = [
  { id: 'step-1', text: "You'll see a carefully curated gallery for the first time" },
  { id: 'step-2', text: "We'll walk through each portrait together" },
  { id: 'step-3', text: "You'll narrow down favorites and choose artwork/products that feel most like you" },
  { id: 'step-4', text: 'Select your preferred sizes and any heirloom products' },
  { id: 'step-5', text: 'Finalize your order and review delivery timing' },
];

const revealTips = [
  { id: 'tip-1', text: 'Bring measurements or photos of your wall space' },
  { id: 'tip-2', text: 'Consider bringing a partner for a second opinion' },
  { id: 'tip-3', text: 'Think about which rooms you want to feature your portraits' },
  { id: 'tip-4', text: 'Trust your instincts — choose what feels like you' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subheader: {
    fontSize: 17,
    color: colors.textSecondary,
    lineHeight: 26,
    marginBottom: 16,
  },
  gemmaCard: {
    backgroundColor: '#F5F1E8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8E3DC',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  gemmaAvatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E8E3DC',
    backgroundColor: '#FFFFFF',
  },
  gemmaAvatar: {
    width: '100%',
    height: '100%',
  },
  gemmaTextContainer: {
    flex: 1,
  },
  gemmaText: {
    fontSize: 15,
    color: '#1A1A1A',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 24,
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
    letterSpacing: -0.2,
    flex: 1,
  },
  cardBody: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  bulletList: {
    marginTop: 4,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    flex: 1,
  },
  ctaContainer: {
    marginTop: 8,
    marginBottom: 24,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  secondaryLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryLinkText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webviewContainer: {
    flex: 1,
  },
});

export default function RevealPrepScreen() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

  const handleViewProductGuide = () => {
    console.log('User tapped View Product Guide button');
    setModalVisible(true);
  };

  const handleContactUs = async () => {
    console.log('User tapped Contact Us link');
    const mailtoUrl = 'mailto:info@oliveandfable.com?subject=Question%20About%20Reveal%20Appointment';
    try {
      await Linking.openURL(mailtoUrl);
    } catch (error) {
      console.error('Error opening email client:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 32 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Hero */}
        <View style={styles.header}>
          <Text style={styles.title}>Reveal Preparation</Text>
          <Text style={styles.subheader}>
            Everything you need to feel relaxed, confident, and excited for your portrait reveal.
          </Text>
        </View>

        {/* Gemma Intro Card - Using same avatar as Home Welcome bubble */}
        <View style={styles.gemmaCard}>
          <View style={styles.gemmaAvatarContainer}>
            <Image
              source={require('@/assets/images/bb700b49-eac8-433e-a8be-ad5057bdb80c.jpeg')}
              style={styles.gemmaAvatar}
              resizeMode="cover"
            />
          </View>
          <View style={styles.gemmaTextContainer}>
            <Text style={styles.gemmaText}>
              The reveal is one of my favorite moments. You&apos;ll see your carefully curated gallery for the first time, and together we&apos;ll choose the artwork and products that feel most like you.
            </Text>
          </View>
        </View>

        {/* Section 1: What to Expect */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What to Expect</Text>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <IconSymbol
                ios_icon_name="star.fill"
                android_material_icon_name="star"
                size={24}
                color={colors.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>The Gallery Reveal</Text>
            </View>
            <Text style={styles.cardBody}>
              One to two weeks after your session, we&apos;ll meet on Zoom for your gallery reveal. This is where the magic comes together. You&apos;ll see your curated set of images for the first time, and we&apos;ll walk through each portrait so you can choose your favorite artwork pieces, digital files, and any heirloom products you&apos;d love to bring home.
            </Text>
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
              <Text style={styles.cardTitle}>Duration</Text>
            </View>
            <Text style={styles.cardBody}>
              Plan for 60–90 minutes. This gives you time to view images, explore artwork options, and make thoughtful selections.
            </Text>
          </View>
        </View>

        {/* Section 2: Selection Process - Updated copy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selection Process</Text>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={24}
                color={colors.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>How It Works</Text>
            </View>
            <View style={styles.bulletList}>
              {selectionProcessSteps.map((step) => (
                <View key={step.id} style={styles.bulletItem}>
                  <Text style={styles.bulletText}>• {step.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Section 3: Tips for Your Reveal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips for Your Reveal</Text>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <IconSymbol
                ios_icon_name="lightbulb.fill"
                android_material_icon_name="lightbulb"
                size={24}
                color={colors.accent}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Make the Most of It</Text>
            </View>
            <View style={styles.bulletList}>
              {revealTips.map((tip) => (
                <View key={tip.id} style={styles.bulletItem}>
                  <Text style={styles.bulletText}>• {tip.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Product Guide Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Guide</Text>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <IconSymbol
                ios_icon_name="book.fill"
                android_material_icon_name="menu-book"
                size={24}
                color={colors.primary}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Explore Our Products</Text>
            </View>
            <Text style={styles.cardBody}>
              Browse our complete collection of fine art prints, canvas wraps, albums, and heirloom products. Get inspired before your reveal appointment.
            </Text>
          </View>
        </View>

        {/* CTA Area */}
        <View style={styles.ctaContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && { opacity: 0.85 }
            ]}
            onPress={handleViewProductGuide}
          >
            <Text style={styles.primaryButtonText}>View Product Guide</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryLink}
            onPress={handleContactUs}
          >
            <Text style={styles.secondaryLinkText}>Questions? Contact Us</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Product Guide Modal with WebView */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Product Guide</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                console.log('User closed Product Guide modal');
                setModalVisible(false);
              }}
            >
              <IconSymbol
                ios_icon_name="xmark"
                android_material_icon_name="close"
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.webviewContainer}>
            <WebView
              source={{ uri: 'https://www.canva.com/design/DAG323RfGaw/5aNumYnQm3EAALtGKWcM0Q/view?embed' }}
              startInLoadingState={true}
              scalesPageToFit={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
