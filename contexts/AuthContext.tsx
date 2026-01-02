
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  user_id: string;
  membership_status: 'active' | 'inactive' | 'cancelled';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('AuthContext: Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('AuthContext: Error fetching profile:', error);
        return null;
      }

      console.log('AuthContext: Profile fetched:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('AuthContext: Unexpected error fetching profile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    console.log('AuthContext: Initializing auth state');

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthContext: Error getting initial session', error);
        } else {
          console.log('AuthContext: Initial session retrieved', session ? 'User logged in' : 'No session');
          setSession(session);
          setUser(session?.user ?? null);
          
          // Fetch profile if user exists
          if (session?.user) {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error('AuthContext: Unexpected error getting initial session', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext: Auth state changed', event, session ? 'User logged in' : 'No session');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile if user exists
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      console.log('AuthContext: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: Attempting sign in for email:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        console.error('AuthContext: Sign in error -', error.message);
        return { error };
      }

      console.log('AuthContext: Sign in successful for user:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('AuthContext: Unexpected sign in error', error);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('AuthContext: Attempting sign up for email:', email);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed'
        }
      });

      if (error) {
        console.error('AuthContext: Sign up error -', error.message);
        return { error };
      }

      console.log('AuthContext: Sign up successful. User needs to verify email:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('AuthContext: Unexpected sign up error', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    console.log('AuthContext: Attempting sign out');
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('AuthContext: Sign out error', error);
        throw error;
      }

      console.log('AuthContext: Sign out successful');
    } catch (error) {
      console.error('AuthContext: Unexpected sign out error', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
