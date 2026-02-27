
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
    console.log('[Session Storage] Saving session:', session ? 'Session exists' : 'No session');
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
      console.log('[Session Storage] Session saved successfully');
    } catch (error) {
      console.log('[Session Storage] Error saving session - non-critical:', error);
    }
  }, []);

  // Load session from secure storage - wrapped in useCallback to stabilize the reference
  const loadSession = useCallback(async (): Promise<Session | null> => {
    console.log('[Session Storage] Loading session from secure storage');
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
        console.log('[Session Storage] No stored session found');
        return null;
      }

      // Check if session has expired due to inactivity
      const timestamp = parseInt(timestampStr, 10);
      const now = Date.now();
      const timeSinceLastActivity = now - timestamp;

      if (timeSinceLastActivity > SESSION_EXPIRATION_MS) {
        console.log('[Session Storage] Session expired due to inactivity (30 days)');
        // Clear expired session
        await saveSession(null);
        return null;
      }

      const storedSession = JSON.parse(sessionJson) as Session;
      console.log('[Session Storage] Loaded session from storage, checking validity');

      // Verify the session is still valid with Supabase
      const { data: { session: validSession }, error } = await supabase.auth.setSession({
        access_token: storedSession.access_token,
        refresh_token: storedSession.refresh_token,
      });

      if (error || !validSession) {
        console.log('[Session Storage] Stored session is invalid:', error?.message);
        await saveSession(null);
        return null;
      }

      console.log('[Session Storage] Session restored successfully');
      // Update timestamp since user is active
      await saveSession(validSession);
      return validSession;
    } catch (error) {
      console.log('[Session Storage] Error loading session - non-critical:', error);
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
    console.log('[Auth Context] Initializing auth context');
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // First, try to load session from secure storage
        const storedSession = await loadSession();
        
        if (storedSession && mounted) {
          console.log('[Auth Context] Using stored session');
          setSession(storedSession);
          setUser(storedSession.user);
          setLoading(false);
          return;
        }

        // If no stored session, check Supabase for active session
        console.log('[Auth Context] Checking Supabase for active session');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (currentSession) {
            console.log('[Auth Context] Found active Supabase session');
            await saveSession(currentSession);
          } else {
            console.log('[Auth Context] No active session found');
          }
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.log('[Auth Context] Error initializing auth - non-critical:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('[Auth Context] Auth state changed:', _event, session ? 'Session exists' : 'No session');
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
    console.log('[Auth] User signing up with email:', email);
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
      console.log('[Auth] Sign up failed - error will be handled by UI');
    } else {
      console.log('[Auth] Sign up successful');
    }
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('[Auth] User signing in with email:', email);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.log('[Auth] Sign in failed - error will be handled by UI');
    } else {
      console.log('[Auth] Sign in successful');
    }
    return { error };
  };

  const signOut = async () => {
    console.log('[Auth] User signing out');
    try {
      // Clear local state immediately (ONE CLICK OUT)
      setSession(null);
      setUser(null);
      await saveSession(null);
      console.log('[Auth] Local session cleared');
      
      // Then sign out from Supabase (fire and forget)
      await supabase.auth.signOut();
      console.log('[Auth] Sign out complete');
    } catch (error) {
      console.log('[Auth] Error during sign out - local state already cleared:', error);
      // Even if Supabase sign out fails, user is logged out locally
    }
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
