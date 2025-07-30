'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { courseAPI } from '@/lib/api';

interface Course {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  content: string;
  category: string;
  price: number;
  duration: string;
  level: 'Başlangıç' | 'Orta' | 'İleri';
  instructor: string;
  status: 'active' | 'draft';
  image?: string;
  students?: number;
  rating?: number;
  courseAbout?: string;
  whatYouWillLearn?: string[];
  requirements?: string[];
  includes?: string[];
  lastUpdate?: string;
}

interface CourseContextType {
  courses: Course[];
  loading: boolean;
  error: string | null;
  getActiveCourses: () => Course[];
  getCourseById: (id: string) => Course | undefined;
  getCoursesByCategory: (category: string) => Course[];
  getCoursesByLevel: (level: string) => Course[];
  addCourse: (course: Omit<Course, 'id' | '_id'>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  refreshCourses: () => Promise<void>;
  clearError: () => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('CourseContext: Kurslar yükleniyor...');
      const data = await courseAPI.getAll();
      console.log('CourseContext: Yüklenen kurslar:', data);
      
      // MongoDB'den gelen _id'leri id olarak normalize et
      const normalizedCourses = data.map((course: Course) => ({
        ...course,
        id: course._id || course.id
      }));
      
      setCourses(normalizedCourses);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kurslar yüklenirken hata oluştu';
      setError(errorMessage);
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const getActiveCourses = () => {
    return courses.filter(course => course.status === 'active');
  };

  const getCourseById = (id: string) => {
    return courses.find(course => (course.id === id || course._id === id));
  };

  const getCoursesByCategory = (category: string) => {
    return courses.filter(course => course.category === category && course.status === 'active');
  };

  const getCoursesByLevel = (level: string) => {
    return courses.filter(course => course.level === level && course.status === 'active');
  };

  const addCourse = async (courseData: Omit<Course, 'id' | '_id'>) => {
    try {
      setError(null);
      const newCourse = await courseAPI.create(courseData);
      // MongoDB'den gelen _id'yi id olarak normalize et
      const normalizedCourse = {
        ...newCourse,
        id: newCourse._id || newCourse.id
      };
      setCourses(prev => [...prev, normalizedCourse]);
      return normalizedCourse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kurs eklenirken hata oluştu';
      setError(errorMessage);
      console.error('Error adding course:', err);
      throw err;
    }
  };

  const updateCourse = async (id: string, courseData: Partial<Course>) => {
    try {
      setError(null);
      const updatedCourse = await courseAPI.update(id, courseData);
      // MongoDB'den gelen _id'yi id olarak normalize et
      const normalizedCourse = {
        ...updatedCourse,
        id: updatedCourse._id || updatedCourse.id
      };
      setCourses(prev => prev.map(course => 
        (course.id === id || course._id === id) ? normalizedCourse : course
      ));
      return normalizedCourse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kurs güncellenirken hata oluştu';
      setError(errorMessage);
      console.error('Error updating course:', err);
      throw err;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      setError(null);
      await courseAPI.delete(id);
      setCourses(prev => prev.filter(course => course.id !== id && course._id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kurs silinirken hata oluştu';
      setError(errorMessage);
      console.error('Error deleting course:', err);
      throw err;
    }
  };

  const refreshCourses = async () => {
    await loadCourses();
  };
  
  const clearError = () => {
    setError(null);
  };

  const value: CourseContextType = {
    courses,
    loading,
    error,
    getActiveCourses,
    getCourseById,
    getCoursesByCategory,
    getCoursesByLevel,
    addCourse,
    updateCourse,
    deleteCourse,
    refreshCourses,
    clearError
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
}; 