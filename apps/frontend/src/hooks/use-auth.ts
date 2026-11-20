'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient, setAccessToken, getAccessToken } from '../lib/api-client';
import { UserSummary, USER_ROLES } from '@smartspace/shared';

export function useAuth() {
  const [user, setUser] = useState<UserSummary | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('smartspace_user');
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await apiClient.get('/users/me');
      setUser(res.data.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('smartspace_user', JSON.stringify(res.data.user));
      }
    } catch {
      // Don't wipe local demo session if backend endpoint is unreachable
      if (typeof window !== 'undefined' && !localStorage.getItem('smartspace_user')) {
        setUser(null);
        setAccessToken(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // If no access token in memory, try silent refresh
    if (!getAccessToken()) {
      apiClient
        .post('/auth/refresh')
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setUser(res.data.user);
          if (typeof window !== 'undefined') {
            localStorage.setItem('smartspace_user', JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          // If we had a cached demo user, retain it
          const stored = typeof window !== 'undefined' ? localStorage.getItem('smartspace_user') : null;
          if (stored) {
            try {
              setUser(JSON.parse(stored));
            } catch {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      fetchCurrentUser();
    }
  }, [fetchCurrentUser]);

  const login = async (data: any) => {
    const res = await apiClient.post('/auth/login', data);
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('smartspace_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const loginDemo = (role: 'USER' | 'SPACE_OWNER' | 'ADMIN') => {
    let mockUser: UserSummary;
    const now = new Date().toISOString();
    if (role === 'SPACE_OWNER') {
      mockUser = {
        id: 'usr-owner-1',
        email: 'marcus@wecreate.com',
        fullName: 'Marcus Sterling',
        role: USER_ROLES.SPACE_OWNER,
        isVerified: true,
        createdAt: now,
      };
    } else if (role === 'ADMIN') {
      mockUser = {
        id: 'usr-admin-1',
        email: 'admin@smartspace.io',
        fullName: 'Chief Administrator',
        role: USER_ROLES.ADMIN,
        isVerified: true,
        createdAt: now,
      };
    } else {
      mockUser = {
        id: 'usr-attendee-1',
        email: 'alice@fintech.io',
        fullName: 'Alice Cooper',
        role: USER_ROLES.USER,
        isVerified: true,
        createdAt: now,
      };
    }
    setAccessToken('demo-jwt-token-active');
    setUser(mockUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('smartspace_user', JSON.stringify(mockUser));
    }
    return mockUser;
  };

  const register = async (data: any) => {
    const res = await apiClient.post('/auth/register', data);
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('smartspace_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      setAccessToken(null);
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('smartspace_user');
      }
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    loginDemo,
    register,
    logout,
    refreshUser: fetchCurrentUser,
  };
}
