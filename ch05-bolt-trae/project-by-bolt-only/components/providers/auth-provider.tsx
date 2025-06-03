'use client';

import { createContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { AuthDialog } from '@/components/features/auth-dialog';

type AuthMode = 'signin' | 'signup' | 'settings';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  signup: (username: string, password: string) => void;
  logout: () => void;
  updateProfile: (username: string, password?: string) => void;
  authDialogOpen: boolean;
  authDialogMode: AuthMode;
  openAuthDialog: (mode: AuthMode) => void;
  closeAuthDialog: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  signup: () => {},
  logout: () => {},
  updateProfile: () => {},
  authDialogOpen: false,
  authDialogMode: 'signin',
  openAuthDialog: () => {},
  closeAuthDialog: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogMode, setAuthDialogMode] = useState<AuthMode>('signin');

  useEffect(() => {
    const savedUser = localStorage.getItem('promptyoo-user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser) as User;
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string) => {
    // In a real app, we would send a request to the server
    // For this demo, we'll simulate it with local storage
    const users = JSON.parse(localStorage.getItem('promptyoo-users') || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);
    
    if (user) {
      const userData: User = {
        id: user.id,
        username: user.username,
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('promptyoo-user', JSON.stringify(userData));
      closeAuthDialog();
    } else {
      throw new Error('Invalid username or password');
    }
  };

  const signup = (username: string, password: string) => {
    // In a real app, we would send a request to the server
    const users = JSON.parse(localStorage.getItem('promptyoo-users') || '[]');
    
    // Check if username already exists
    if (users.some((u: any) => u.username === username)) {
      throw new Error('Username already exists');
    }
    
    const newUser = {
      id: Date.now().toString(),
      username,
      password,
    };
    
    users.push(newUser);
    localStorage.setItem('promptyoo-users', JSON.stringify(users));
    
    const userData: User = {
      id: newUser.id,
      username: newUser.username,
    };
    
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('promptyoo-user', JSON.stringify(userData));
    closeAuthDialog();
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('promptyoo-user');
  };

  const updateProfile = (username: string, password?: string) => {
    if (!user) return;
    
    // Update in local users storage
    const users = JSON.parse(localStorage.getItem('promptyoo-users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    
    if (userIndex >= 0) {
      users[userIndex].username = username;
      if (password) {
        users[userIndex].password = password;
      }
      
      localStorage.setItem('promptyoo-users', JSON.stringify(users));
      
      // Update current user
      const updatedUser: User = {
        ...user,
        username,
      };
      
      setUser(updatedUser);
      localStorage.setItem('promptyoo-user', JSON.stringify(updatedUser));
      closeAuthDialog();
    }
  };

  const openAuthDialog = (mode: AuthMode) => {
    setAuthDialogMode(mode);
    setAuthDialogOpen(true);
  };

  const closeAuthDialog = () => {
    setAuthDialogOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        updateProfile,
        authDialogOpen,
        authDialogMode,
        openAuthDialog,
        closeAuthDialog,
      }}
    >
      {children}
      <AuthDialog />
    </AuthContext.Provider>
  );
}