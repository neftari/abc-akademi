'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { categoryAPI } from '@/lib/api';

interface Category {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  image?: string;
  color?: string;
}

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  addCategory: (category: Omit<Category, 'id' | '_id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  getActiveCategories: () => Category[];
  refreshCategories: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryAPI.getAll();
      setCategories(data);
    } catch (err) {
      setError('Kategoriler yüklenirken hata oluştu');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async (categoryData: Omit<Category, 'id' | '_id'>) => {
    try {
      const newCategory = await categoryAPI.create(categoryData);
      setCategories(prev => [...prev, newCategory]);
    } catch (err) {
      setError('Kategori eklenirken hata oluştu');
      throw err;
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      const updatedCategory = await categoryAPI.update(id, categoryData);
      setCategories(prev => prev.map(category => 
        (category._id === id || category.id === id) ? { ...category, ...updatedCategory } : category
      ));
    } catch (err) {
      setError('Kategori güncellenirken hata oluştu');
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoryAPI.delete(id);
      setCategories(prev => prev.filter(category => category._id !== id && category.id !== id));
    } catch (err) {
      setError('Kategori silinirken hata oluştu');
      throw err;
    }
  };

  const getCategoryById = (id: string) => {
    return categories.find(category => category._id === id || category.id === id);
  };

  const getActiveCategories = () => {
    return categories.filter(category => category.status === 'active');
  };

  const refreshCategories = async () => {
    await loadCategories();
  };

  const value: CategoryContextType = {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getActiveCategories,
    refreshCategories
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}; 