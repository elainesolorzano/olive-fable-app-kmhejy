
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform, AppState, AppStateStatus } from 'react-native';

interface SupabaseAuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshAuthAndUser: () => Promise<void>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

// Secure storage keys
const SESSION_KEY = 'supabase_session';
const SESSION_TIMESTAMP_KEY = 'supabase_session_timestamp';

// Session expiration: 30 days of inactivity
const SESSION_EXPIRATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Save session to secure storage
  const saveSession = useCallback(async (session: Session | null) => {
    console.log('Saving session to secure storage:', session ? 'Session exists' : 'No session');
    try {
      if (Platform.OS === 'web') {
        // Use localStorage for web
        if (session) {
          localStorage.setItem(SESSION_KEY, JSON.stringify(session));
          localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
        } else {
          localStorage.removeItem(SESSION_KEY);
          localStorage.removeItem(SESSION_TIMESTAMP_KEY);
        }
      } else {
        // Use SecureStore for native
        if (session) {
          await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
          await SecureStore.setItemAsync(SESSION_TIMESTAMP_KEY, Date.now().toString());
        } else {
          await SecureStore.deleteItemAsync(SESSION_KEY);
          await SecureStore.deleteItemAsync(SESSION_TIMESTAMP_KEY);
        }
      }
    } catch (error) {
      console.log('Error saving session to secure storage - non-critical');
    }
  }, []);

  // Load session from secure storage - wrapped in useCallback to stabilize the reference
  const loadSession = useCallback(async (): Promise<Session | null> => {
    console.log('Loading session from secure storage');
    try {
      let sessionJson: string | null = null;
      let timestampStr: string | null = null;

      if (Platform.OS === 'web') {
        // Use localStorage for web
        sessionJson = localStorage.getItem(SESSION_KEY);
        timestampStr = localStorage.getItem(SESSION_TIMESTAMP_KEY);
      } else {
        // Use SecureStore for native
        sessionJson = await SecureStore.getItemAsync(SESSION_KEY);
        timestampStr = await SecureStore.getItemAsync(SESSION_TIMESTAMP_KEY);
      }

      if (!sessionJson || !timestampStr) {
        console.log('No stored session found');
        return null;
      }

      // Check if session has expired due to inactivity
      const timestamp = parseInt(timestampStr, 10);
      const now = Date.now();
      const timeSinceLastActivity = now - timestamp;

      if (timeSinceLastActivity > SESSION_EXPIRATION_MS) {
        console.log('Session expired due to inactivity (30 days)');
        // Clear expired session
        await saveSession(null);
        return null;
      }

      const storedSession = JSON.parse(sessionJson) as Session;
      console.log('Loaded session from storage, checking validity');

      // Verify the session is still valid with Supabase
      const { data: { session: validSession }, error } = await supabase.auth.setSession({
        access_token: storedSession.access_token,
        refresh_token: storedSession.refresh_token,
      });

      if (error || !validSession) {
        console.log('Stored session is invalid:', error?.message);
        await saveSession(null);
        return null;
      }

      console.log('Session restored successfully');
      // Update timestamp since user is active
      await saveSession(validSession);
      return validSession;
    } catch (error) {
      console.log('Error loading session from secure storage - non-critical');
      return null;
    }
  }, [saveSession]);

  // Refresh auth state and user data
  const refreshAuthAndUser = useCallback(async () => {
    console.log('[Auth Refresh] Starting auth refresh...');
    try {
      // Get the latest session from Supabase
      const { data: { session: freshSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.log('[Auth Refresh] Error getting session:', sessionError.message);
        return;
      }

      if (!freshSession) {
        console.log('[Auth Refresh] No active session found');
        return;
      }

      console.log('[Auth Refresh] Session found, fetching user data...');

      // Get the latest user data
      const { data: { user: freshUser }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.log('[Auth Refresh] Error getting user:', userError.message);
        return;
      }

      if (freshUser) {
        console.log('[Auth Refresh] User data refreshed');
        console.log('[Auth Refresh] Email verified:', !!freshUser.email_confirmed_at);
        
        // Update state with fresh data
        setSession(freshSession);
        setUser(freshUser);
        await saveSession(freshSession);
        
        console.log('[Auth Refresh] Auth state updated successfully');
      }
    } catch (error) {
      console.log('[Auth Refresh] Error during refresh:', error);
    }
  }, [saveSession]);

  useEffect(() => {
    console.log('Auth context initializing');
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // First, try to load session from secure storage
        const storedSession = await loadSession();
        
        if (storedSession && mounted) {
          console.log('Using stored session');
          setSession(storedSession);
          setUser(storedSession.user);
          setLoading(false);
          return;
        }

        // If no stored session, check Supabase for active session
        console.log('Checking Supabase for active session');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (currentSession) {
            console.log('Found active Supabase session');
            await saveSession(currentSession);
          }
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.log('Error initializing auth - non-critical');
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session ? 'Session exists' : 'No session');
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        await saveSession(session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadSession, saveSession]);

  // Listen for AppState changes (app coming to foreground)
  useEffect(() => {
    console.log('[AppState] Setting up AppState listener for auth refresh');
    
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log('[AppState] App state changed to:', nextAppState);
      
      if (nextAppState === 'active') {
        console.log('[AppState] App became active, triggering auth refresh');
        refreshAuthAndUser();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [refreshAuthAndUser]);

  const signUp = async (email: string, password: string, name?: string) => {
    console.log('User signing up with email:', email);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: "https://oliveandfable.com/appconfirmed",
      }
    });
    if (error) {
      console.log('Sign up failed - error will be handled by UI');
    } else {
      console.log('Sign up successful');
    }
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('User signing in with email:', email);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.log('Sign in failed - error will be handled by UI');
    } else {
      console.log('Sign in successful');
    }
    return { error };
  };

  const signOut = async () => {
    console.log('User signing out');
    await supabase.auth.signOut();
    await saveSession(null);
    console.log('Sign out complete');
  };

  return (
    <SupabaseAuthContext.Provider value={{ session, user, loading, signUp, signIn, signOut, refreshAuthAndUser }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within SupabaseAuthProvider');
  }
  return context;
}
