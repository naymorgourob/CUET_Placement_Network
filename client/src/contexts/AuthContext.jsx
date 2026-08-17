import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as authService from '@/services/authService';
import { tokenStorage } from '@/utils/tokenStorage';
import { UNAUTHORIZED_EVENT } from '@/services/axiosInstance';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  useEffect(() => {
    async function restoreSession() {
      const token = tokenStorage.get();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, [clearSession]);

  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, clearSession);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, clearSession);
  }, [clearSession]);

  const login = useCallback(async (email, password) => {
    const result = await authService.login(email, password);
    tokenStorage.set(result.token);

    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);

    return currentUser;
  }, []);

  const register = useCallback(
    async ({ fullName, email, password, role }) => {
      await authService.register({ fullName, email, password, role });
      return login(email, password);
    },
    [login]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
