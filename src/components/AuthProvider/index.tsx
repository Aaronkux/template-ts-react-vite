import React, { useState, useEffect } from 'react';
import { LoginServiceData } from '@/services/auth';

export const user_key = '__user';
export const token_key = '__token';
export const refresh_token_key = '__refresh_token';

interface AuthContextType {
  user: LoginServiceData | null;
  setUser: React.Dispatch<React.SetStateAction<LoginServiceData | null>>;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<LoginServiceData | null>(() => {
    const oldUserJSON = localStorage.getItem(user_key);
    if (oldUserJSON) {
      try {
        return JSON.parse(oldUserJSON);
      } catch (error) {
        return null;
      }
    }
  });

  const value = { user, setUser };

  useEffect(() => {
    localStorage.setItem(user_key, user ? JSON.stringify(user) : '');
    localStorage.setItem(token_key, user?.Access_Token__c ?? '');
    localStorage.setItem(refresh_token_key, user?.Refresh_Token__c ?? '');
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
