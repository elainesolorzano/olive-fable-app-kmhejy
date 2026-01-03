
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { GemmaMessage } from '@/components/GemmaMessage';

const TAB_BAR_HEIGHT = 60;

export default function RevealPrepScreen() {
  const insets = useSafeAreaInsets();
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 24;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <GemmaMessage style={styles.gemmaSection}>
          <Text style={styles.gemmaText}>
            The reveal is one of my favorite parts! This is when you get to see all the beautiful portraits we created together. Here&apos;s what to expect and how to prepare.
          </Text>
          <Text style={styles.signature}>— Gemma 🐾</Text>
        </GemmaMessage>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="photo.fill" 
              android_material_icon_name="image" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.sectionTitle}>What is a Reveal?</Text>
          </View>
          <Text style={styles.bodyText}>
            Your reveal appointment is a private, in-person viewing of your finished gallery. You&apos;ll see professionally edited images displayed beautifully, and we&apos;ll help you select your favorites for prints, albums, or wall art.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="clock.fill" 
              android_material_icon_name="schedule" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.sectionTitle}>Timing & Duration</Text>
          </View>
          <Text style={styles.bodyText}>
            Reveal appointments typically last 45-60 minutes. We&apos;ll schedule this 2-3 weeks after your session to allow time for careful editing and retouching.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="list.bullet" 
              android_material_icon_name="checklist" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.sectionTitle}>How to Prepare</Text>
          </View>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Think about where you&apos;d like to display portraits in your home
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Measure wall spaces if considering large prints or canvas
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Consider your budget for prints and products
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Bring anyone who should be part of the decision
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Come with an open mind and heart
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="sparkles" 
              android_material_icon_name="auto-awesome" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.sectionTitle}>What You&apos;ll See</Text>
          </View>
          <Text style={styles.bodyText}>
            Your gallery will include professionally edited images showcasing your pet&apos;s personality and the special bond you share. Each image is carefully retouched and color-corrected.
          </Text>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightText}>
              Most clients see 30-50 final images from their session.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="cart.fill" 
              android_material_icon_name="shopping-cart" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.sectionTitle}>Product Options</Text>
          </View>
          <Text style={styles.bodyText}>
            We offer a range of heirloom-quality products:
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Fine art prints (various sizes)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Gallery-wrapped canvas
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Custom albums and folios
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Wall art collections
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Digital files with print release
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tipBox}>
          <View style={styles.tipHeader}>
            <IconSymbol 
              ios_icon_name="heart.fill" 
              android_material_icon_name="favorite" 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.tipTitle}>A Note on Choosing</Text>
          </View>
          <Text style={styles.tipText}>
            It&apos;s completely normal to love more images than you expected! We&apos;ll help you narrow down your favorites and create a collection that tells your pet&apos;s story beautifully.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="questionmark.circle.fill" 
              android_material_icon_name="help" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.sectionTitle}>Questions to Consider</Text>
          </View>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Do you want a statement piece or a gallery wall?
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Are you looking for gifts for family members?
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Would you like an album to preserve all your favorites?
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Do you need digital files for social media or holiday cards?
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.finalNote}>
          <Text style={styles.finalNoteTitle}>Remember</Text>
          <Text style={styles.finalNoteText}>
            There&apos;s no pressure to decide everything during the reveal. You can take time to think about your selections, and we&apos;re always here to answer questions.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  gemmaSection: {
    marginBottom: 32,
  },
  gemmaText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#111F0F',
  },
  signature: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#111F0F',
    marginTop: 12,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 16,
  },
  bulletList: {
    gap: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 12,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  highlightBox: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  highlightText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  tipBox: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  tipText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  finalNote: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  finalNoteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  finalNoteText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
});
