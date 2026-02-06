
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

interface NotificationBadgeContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
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

  // Fetch unread notification count (where read_at is null)
  const fetchUnreadCount = useCallback(async () => {
    if (!user?.id) {
      setUnreadCount(0);
      return;
    }

    console.log('Fetching unread notification count for user:', user.id);
    
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .is('read_at', null);

      if (error) {
        console.error('Error fetching unread count:', error.message);
        setUnreadCount(0);
      } else {
        console.log('Unread notification count:', count);
        setUnreadCount(count || 0);
      }
    } catch (error) {
      console.error('Unexpected error fetching unread count:', error);
      setUnreadCount(0);
    }
  }, [user?.id]);

  // Expose refresh function for manual updates
  const refreshUnreadCount = useCallback(async () => {
    await fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Fetch initial unread count
  useEffect(() => {
    if (!user?.id) {
      setUnreadCount(0);
      return;
    }

    fetchUnreadCount();
  }, [user?.id, fetchUnreadCount]);

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
          await fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription for notification badge');
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchUnreadCount]);

  return (
    <NotificationBadgeContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </NotificationBadgeContext.Provider>
  );
}
