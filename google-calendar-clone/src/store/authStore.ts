import { create } from 'zustand';
import { safeSetItem, safeGetItem, safeRemoveItem } from '../lib/storageUtils';
import { TOKEN_REFRESH_BUFFER_MS } from '../lib/constants';

interface AuthStore {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
  userEmail: string | null;
  setAuth: (token: string, refreshToken: string, email: string, expiresIn: number) => void;
  clearAuth: () => void;
  refreshAccessToken: () => Promise<void>;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  tokenExpiry: null,
  userEmail: null,

  setAuth: (token, refreshToken, email, expiresIn) => {
    const expiryTime = Date.now() + expiresIn * 1000;
    set({
      isAuthenticated: true,
      accessToken: token,
      refreshToken,
      userEmail: email,
      tokenExpiry: expiryTime,
    });

    // Persist to localStorage
    try {
      safeSetItem('google_access_token', token);
      safeSetItem('google_refresh_token', refreshToken);
      safeSetItem('google_token_expiry', String(expiryTime));
      safeSetItem('google_user_email', email);
    } catch (error) {
      console.error('Failed to save auth to localStorage:', error);
      // Don't throw - auth is still set in memory
    }
  },

  clearAuth: () => {
    set({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      tokenExpiry: null,
      userEmail: null,
    });

    // Clear from localStorage
    safeRemoveItem('google_access_token');
    safeRemoveItem('google_refresh_token');
    safeRemoveItem('google_token_expiry');
    safeRemoveItem('google_user_email');
  },

  isTokenExpired: () => {
    const { tokenExpiry } = get();
    if (!tokenExpiry) return true;
    // Refresh 1 minute before expiry
    return Date.now() >= tokenExpiry - TOKEN_REFRESH_BUFFER_MS;
  },

  refreshAccessToken: async () => {
    const { refreshToken, userEmail } = get();
    if (!refreshToken) {
      console.warn('No refresh token available');
      get().clearAuth();
      return;
    }

    try {
      const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!CLIENT_ID) {
        throw new Error('Google Client ID not configured');
      }

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error_description || 'Token refresh failed');
      }

      const data = await response.json();
      get().setAuth(
        data.access_token,
        refreshToken, // Refresh token doesn't change
        userEmail || '',
        data.expires_in || 3600
      );
    } catch (error) {
      console.error('Token refresh failed:', error);
      get().clearAuth();
      throw error;
    }
  },
}));

// Load auth state on initialization
if (typeof window !== 'undefined') {
  try {
    const token = safeGetItem('google_access_token');
    const refreshToken = safeGetItem('google_refresh_token');
    const expiryStr = safeGetItem('google_token_expiry');
    const email = safeGetItem('google_user_email');

    if (token && refreshToken && expiryStr && email) {
      const expiry = parseInt(expiryStr, 10);
      const expiresIn = Math.max(0, Math.floor((expiry - Date.now()) / 1000));

      if (expiresIn > 0) {
        useAuthStore.getState().setAuth(token, refreshToken, email, expiresIn);
      } else {
        // Token expired, try to refresh
        useAuthStore.setState({
          accessToken: token,
          refreshToken,
          userEmail: email,
          tokenExpiry: expiry,
        });
        // Attempt refresh in background
        useAuthStore.getState().refreshAccessToken().catch(() => {
          // If refresh fails, clear auth
          useAuthStore.getState().clearAuth();
        });
      }
    }
  } catch (error) {
    console.error('Failed to load auth state:', error);
  }
}

