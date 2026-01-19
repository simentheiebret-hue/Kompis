import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import type { AuthContextValue, AuthProviderProps, AuthResult, User } from '../types';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredUser();
  }, []);

  const login = async (email: string, _password: string): Promise<AuthResult> => {
    try {
      const mockUser: User = {
        id: '1',
        name: 'Thomas Berg',
        email: email,
        phone: '+47 123 45 678',
        rating: 4.7,
        completedJobs: 89,
        totalEarned: 12450,
        activeStreak: 14,
        vehicle: 'Varebil',
        avatar: 'https://i.pravatar.cc/150?img=12',
      };

      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login feilet' };
    }
  };

  const register = async (
    name: string,
    email: string,
    _password: string,
    phone: string
  ): Promise<AuthResult> => {
    try {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        rating: 5.0,
        completedJobs: 0,
        totalEarned: 0,
        activeStreak: 0,
        vehicle: 'Personbil',
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      };

      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registrering feilet' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<AuthResult> => {
    try {
      const updatedUser = { ...user, ...updates } as User;
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: 'Oppdatering feilet' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
