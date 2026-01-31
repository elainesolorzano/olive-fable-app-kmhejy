
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

interface NotificationBadgeContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  hasUnseenUpdate: boolean;
}

const NotificationBadgeContext = createContext<NotificationBadgeContextType | undefined>(undefined);

export function useNotificationBadge() {
  const context = useContext(NotificationBadgeContext);
  if (!context) {
    throw new Error('useNotificationBadge must be used within NotificationBadgeProvider');
  }
  return context;
}

interface NotificationBadgeProviderProps {
  children: ReactNode;
}

export function NotificationBadgeProvider({ children }: NotificationBadgeProviderProps) {
  const { user } = useSupabaseAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasUnseenUpdate, setHasUnseenUpdate] = useState(false);

  // Check if there's an unseen order status update
  const checkUnseenUpdate = async () => {
    if (!user?.id) {
      setHasUnseenUpdate(false);
      return;
    }

    try {
      console.log('Checking for unseen order status updates');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('updated_at, last_seen_at')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error checking unseen updates:', error.message);
        setHasUnseenUpdate(false);
        return;
      }

      if (!data) {
        setHasUnseenUpdate(false);
        return;
      }

      // Show dot if updated_at > last_seen_at (or if last_seen_at is null)
      const updatedAt = data.updated_at ? new Date(data.updated_at).getTime() : 0;
      const lastSeenAt = data.last_seen_at ? new Date(data.last_seen_at).getTime() : 0;
      
      const hasUpdate = updatedAt > lastSeenAt;
      console.log('Unseen update check:', {
        updatedAt: data.updated_at,
        lastSeenAt: data.last_seen_at,
        hasUpdate
      });
      
      setHasUnseenUpdate(hasUpdate);
    } catch (error) {
      console.error('Unexpected error checking unseen updates:', error);
      setHasUnseenUpdate(false);
    }
  };

  // Fetch initial unread count and check for unseen updates
  useEffect(() => {
    if (!user?.id) {
      setUnreadCount(0);
      setHasUnseenUpdate(false);
      return;
    }

    const fetchUnreadCount = async () => {
      console.log('Fetching unread notification count for user:', user.id);
      
      try {
        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false);

        if (error) {
          console.error('Error fetching unread count:', error.message);
        } else {
          console.log('Unread notification count:', count);
          setUnreadCount(count || 0);
        }
      } catch (error) {
        console.error('Unexpected error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
    checkUnseenUpdate();
  }, [user?.id]);

  // Subscribe to realtime changes for notifications
  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up realtime subscription for notification badge');

    const channel = supabase
      .channel('notification-badge-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          console.log('Notification badge realtime change:', payload.eventType);
          
          // Refetch the unread count whenever notifications change
          try {
            const { count, error } = await supabase
              .from('notifications')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id)
              .eq('is_read', false);

            if (error) {
              console.error('Error refetching unread count:', error.message);
            } else {
              console.log('Updated unread notification count:', count);
              setUnreadCount(count || 0);
            }
          } catch (error) {
            console.error('Unexpected error refetching unread count:', error);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription for notification badge');
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Subscribe to realtime changes for profile updates (order status changes)
  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up realtime subscription for profile updates');

    const channel = supabase
      .channel('profile-update-badge')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          console.log('Profile updated in realtime, checking for unseen updates');
          await checkUnseenUpdate();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription for profile updates');
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return (
    <NotificationBadgeContext.Provider value={{ unreadCount, setUnreadCount, hasUnseenUpdate }}>
      {children}
    </NotificationBadgeContext.Provider>
  );
}
