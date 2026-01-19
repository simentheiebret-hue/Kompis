import type { ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  rating: number;
  completedJobs: number;
  totalEarned: number;
  activeStreak: number;
  vehicle: string;
  avatar: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string, phone: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<AuthResult>;
  isAuthenticated: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface Helper {
  id: number;
  name: string;
  rating: number;
  distance: string;
  lat: number;
  lng: number;
  vehicle: string;
}

export interface JobPoster {
  name: string;
  rating: number;
  avatar: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  from: string;
  to: string;
  price: string;
  distance: string;
  timeAgo: string;
  image: string;
  category: JobCategory;
  postedBy: JobPoster;
}

export type JobCategory = 'all' | 'furniture' | 'moving' | 'recycling';

export interface Category {
  id: JobCategory;
  label: string;
  emoji: string;
  color: string;
}

export interface ActiveHelper {
  name: string;
  rating: number;
  phone: string;
  vehicle: string;
  eta: string;
  distance: string;
  photo: string;
}

export type AppStage = 'main' | 'searching' | 'matched' | 'active';
export type TabType = 'findHelp' | 'marketplace';
