
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Notification {
  id: number;
  user_id: string;
  title: string;
  body: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 64;

export default function NotificationsScreen() {
  const { user } = useSupabaseAuth();
  const insets = useSafeAreaInsets();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch notifications from Supabase
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      console.log('No user logged in, skipping notifications fetch');
      setLoading(false);
      return;
    }

    console.log('Fetching notifications for user:', user.id);
    setRefreshing(true);

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error.message);
      } else {
        console.log('Notifications fetched successfully:', data?.length || 0, 'items');
        setNotifications(data || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching notifications:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [user]);

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setLoading(false);
    }
  }, [user, fetchNotifications]);

  // Subscribe to realtime changes on notifications table
  useEffect(() => {
    if (!user) return;

    console.log('Setting up realtime subscription for notifications');

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Notification changed in realtime:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Add new notification to the top of the list
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            // Update existing notification
            const updatedNotification = payload.new as Notification;
            setNotifications(prev => 
              prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
            );
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted notification
            const deletedId = (payload.old as Notification).id;
            setNotifications(prev => prev.filter(n => n.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription for notifications');
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Mark notification as read
  const markAsRead = async (notificationId: number) => {
    console.log('Marking notification as read:', notificationId);
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error marking notification as read:', error.message);
      } else {
        console.log('Notification marked as read successfully');
      }
    } catch (error) {
      console.error('Unexpected error marking notification as read:', error);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Just now';
    }
    if (diffMins < 60) {
      const minsText = diffMins === 1 ? 'minute' : 'minutes';
      return `${diffMins} ${minsText} ago`;
    }
    if (diffHours < 24) {
      const hoursText = diffHours === 1 ? 'hour' : 'hours';
      return `${hoursText} ago`;
    }
    if (diffDays < 7) {
      const daysText = diffDays === 1 ? 'day' : 'days';
      return `${daysText} ago`;
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={commonStyles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[
            styles.emptyContentContainer,
            { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 40 }
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchNotifications}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          <View style={styles.iconContainer}>
            <IconSymbol 
              ios_icon_name="bell.fill"
              android_material_icon_name="notifications"
              size={80}
              color={colors.primary}
            />
          </View>
          
          <Text style={styles.emptyTitle}>No Notifications Yet</Text>
          
          <View style={commonStyles.card}>
            <Text style={styles.bodyText}>
              We believe communication should feel thoughtful and intentional, never overwhelming. You&apos;ll receive updates here about your sessions, orders, and important studio news.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchNotifications}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {notifications.map((notification, index) => {
          const dateText = formatDate(notification.created_at);
          
          return (
            <Pressable
              key={index}
              style={[
                styles.notificationCard,
                !notification.is_read && styles.notificationCardUnread
              ]}
              onPress={() => {
                if (!notification.is_read) {
                  markAsRead(notification.id);
                }
              }}
            >
              <View style={styles.notificationHeader}>
                <View style={styles.notificationTitleRow}>
                  {!notification.is_read && (
                    <View style={styles.unreadDot} />
                  )}
                  <Text style={[
                    styles.notificationTitle,
                    !notification.is_read && styles.notificationTitleUnread
                  ]}>
                    {notification.title}
                  </Text>
                </View>
                <Text style={styles.notificationDate}>{dateText}</Text>
              </View>
              
              <Text style={styles.notificationBody}>
                {notification.body}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  emptyContentContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  contentContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 12,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  notificationCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notificationCardUnread: {
    backgroundColor: colors.highlight,
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  notificationHeader: {
    marginBottom: 8,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  notificationTitleUnread: {
    fontWeight: '700',
  },
  notificationDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  notificationBody: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
