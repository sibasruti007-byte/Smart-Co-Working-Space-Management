'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient, setAccessToken, getAccessToken } from '../lib/api-client';
import { UserSummary } from '@smartspace/shared';

export function useAuth() {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await apiClient.get('/users/me');
      setUser(res.data.user);
    } catch {
      setUser(null);
      setAccessToken(null);
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
        })
        .catch(() => {
          setUser(null);
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
    return res.data;
  };

  const register = async (data: any) => {
    const res = await apiClient.post('/auth/register', data);
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser: fetchCurrentUser,
  };
}

