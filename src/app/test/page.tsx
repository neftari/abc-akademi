'use client';

import { useState, useEffect } from 'react';
import { ICourse } from '@/models/Course';
import { ICategory } from '@/models/Category';
import { IUser } from '@/models/User';

export default function TestPage() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Test sayfası: Veriler yükleniyor...');
        
        // Kursları getir
        const coursesResponse = await fetch('/api/courses');
        const coursesData = await coursesResponse.json();
        console.log('Kurslar:', coursesData);
        setCourses(coursesData);

        // Kategorileri getir
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        console.log('Kategoriler:', categoriesData);
        setCategories(categoriesData);

        // Kullanıcıları getir
        const usersResponse = await fetch('/api/users');
        const usersData = await usersResponse.json();
        console.log('Kullanıcılar:', usersData);
        setUsers(usersData);

      } catch (error) {
        console.error('Hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Yükleniyor...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">API Test Sayfası</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Kurslar ({courses.length})</h2>
          {courses.map((course: ICourse) => (
            <div key={course._id?.toString() || course.id} className="mb-2 p-2 bg-gray-50 rounded">
              <div className="font-medium">{course.title}</div>
              <div className="text-sm text-gray-600">{course.category}</div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Kategoriler ({categories.length})</h2>
          {categories.map((category: ICategory) => (
            <div key={category._id?.toString() || category.id} className="mb-2 p-2 bg-gray-50 rounded">
              <div className="font-medium">{category.name}</div>
              <div className="text-sm text-gray-600">{category.description}</div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Kullanıcılar ({users.length})</h2>
          {users.map((user: IUser) => (
            <div key={user._id?.toString() || user.id} className="mb-2 p-2 bg-gray-50 rounded">
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-600">{user.email}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 