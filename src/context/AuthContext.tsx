import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export interface AppUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isMockUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_MOCK_USER_KEY = 'fpl_kino_mock_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMockUser, setIsMockUser] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check local mock user first (for dev/testing fallback)
    const storedMock = localStorage.getItem(LOCAL_STORAGE_MOCK_USER_KEY);
    if (storedMock) {
      try {
        const parsed = JSON.parse(storedMock);
        setUser(parsed);
        setIsMockUser(true);
        setLoading(false);
      } catch (e) {
        localStorage.removeItem(LOCAL_STORAGE_MOCK_USER_KEY);
      }
    }

    // 2. Check Supabase session
    const getInitialSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.user && !storedMock) {
          setSession(currentSession);
          setUser(formatSupabaseUser(currentSession.user));
          setIsMockUser(false);
        }
      } catch (err) {
        console.warn('[Auth] Failed to get initial Supabase session:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // 3. Listen to auth state changes from Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (newSession?.user) {
        setSession(newSession);
        setUser(formatSupabaseUser(newSession.user));
        setIsMockUser(false);
        localStorage.removeItem(LOCAL_STORAGE_MOCK_USER_KEY);
      } else if (!localStorage.getItem(LOCAL_STORAGE_MOCK_USER_KEY)) {
        setSession(null);
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const formatSupabaseUser = (sbUser: User): AppUser => {
    return {
      id: sbUser.id,
      email: sbUser.email || 'user@gmail.com',
      name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'FPL User',
      avatar_url: sbUser.user_metadata?.avatar_url || sbUser.user_metadata?.picture,
    };
  };

  const signInWithGoogle = async () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      
      // If Supabase URL is placeholder or unconfigured, fallback gracefully to interactive email input or quick login in dev
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        const testEmail = window.prompt(
          '[Dev Mode - Supabase Config Required]\nSupabase URL belum dikonfigurasi. Masukkan email Google Anda untuk simulasi Login:'
        ) || 'user.kino@gmail.com';
        
        const mock: AppUser = {
          id: 'mock-user-' + Date.now(),
          email: testEmail.trim(),
          name: testEmail.split('@')[0].toUpperCase(),
        };
        localStorage.setItem(LOCAL_STORAGE_MOCK_USER_KEY, JSON.stringify(mock));
        setUser(mock);
        setIsMockUser(true);
        return { error: null };
      }

      const redirectTarget = typeof window !== 'undefined' 
        ? window.location.origin 
        : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTarget,
        },
      });

      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      console.error('[Auth] Error signing in with Google:', err);
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_MOCK_USER_KEY);
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[Auth] Sign out error:', err);
    } finally {
      setUser(null);
      setSession(null);
      setIsMockUser(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithGoogle,
        signOut,
        isMockUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
