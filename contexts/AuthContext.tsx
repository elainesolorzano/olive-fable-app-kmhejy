
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    );

    return () => {
      console.log('AuthContext: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: Attempting sign in');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('AuthContext: Sign in error', error);
        return { error };
      }

      console.log('AuthContext: Sign in successful');
      return { error: null };
    } catch (error) {
      console.error('AuthContext: Unexpected sign in error', error);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('AuthContext: Attempting sign up');
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed'
        }
      });

      if (error) {
        console.error('AuthContext: Sign up error', error);
        return { error };
      }

      console.log('AuthContext: Sign up successful');
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
    loading,
    signIn,
    signUp,
    signOut,
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
