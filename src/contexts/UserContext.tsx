'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userAPI } from '@/lib/api';

interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'admin';
  status: 'active' | 'inactive';
  phone?: string;
  address?: string;
  joinDate?: string;
  assignedCourses?: string[];
  bio?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  school?: string;
  degree?: string;
  field?: string;
  graduationYear?: string;
}

interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  addUser: (user: Omit<User, 'id' | '_id'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  getUserById: (id: string) => User | undefined;
  getUserByEmail: (email: string) => User | undefined;
  refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userAPI.getAll();
      setUsers(data);
    } catch (err) {
      setError('Kullanıcılar yüklenirken hata oluştu');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const addUser = async (userData: Omit<User, 'id' | '_id'>) => {
    try {
      const newUser = await userAPI.create(userData);
      setUsers(prev => [...prev, newUser]);
    } catch (err) {
      setError('Kullanıcı eklenirken hata oluştu');
      throw err;
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      const updatedUser = await userAPI.update(id, userData);
      setUsers(prev => prev.map(user => 
        (user._id === id || user.id === id) ? { ...user, ...updatedUser } : user
      ));
    } catch (err) {
      setError('Kullanıcı güncellenirken hata oluştu');
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await userAPI.delete(id);
      setUsers(prev => prev.filter(user => user._id !== id && user.id !== id));
    } catch (err) {
      setError('Kullanıcı silinirken hata oluştu');
      throw err;
    }
  };

  const getUserById = (id: string) => {
    return users.find(user => user._id === id || user.id === id);
  };

  const getUserByEmail = (email: string) => {
    return users.find(user => user.email === email);
  };

  const refreshUsers = async () => {
    await loadUsers();
  };

  const value: UserContextType = {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    getUserByEmail,
    refreshUsers
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 