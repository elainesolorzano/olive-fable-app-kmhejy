
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

interface NotificationBadgeContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
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

  // Fetch initial unread count
  useEffect(() => {
    if (!user?.id) {
      setUnreadCount(0);
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
  }, [user?.id]);

  // Subscribe to realtime changes for unread count
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

  return (
    <NotificationBadgeContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </NotificationBadgeContext.Provider>
  );
}
