// MongoDB API fonksiyonları

// Kurs API'leri
export const courseAPI = {
  // Tüm kursları getir
  getAll: async () => {
    console.log('courseAPI.getAll: API çağrısı yapılıyor...');
    try {
      const response = await fetch('/api/courses');
      console.log('courseAPI.getAll: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('courseAPI.getAll: Dönen veri:', data);
        return data;
      } else {
        throw new Error('Kurslar yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('courseAPI.getAll: API çağrısı hata verdi:', error);
      throw new Error('Kurslar yüklenirken hata oluştu');
    }
  },

  // Kurs ekle
  create: async (courseData: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Kurs oluşturulurken hata oluştu');
      }
    } catch (error) {
      console.error('courseAPI.create: API çağrısı hata verdi:', error);
      throw new Error('Kurs oluşturulurken hata oluştu');
    }
  },

  // Kurs güncelle
  update: async (id: string, courseData: Record<string, unknown>) => {
    try {
      console.log('courseAPI.update: Gönderilen veri:', { id, courseData });
      
      const response = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });
      
      console.log('courseAPI.update: Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('courseAPI.update: Başarılı sonuç:', result);
        return result;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('courseAPI.update: API hatası:', errorData);
        throw new Error(errorData.error || 'Kurs güncellenirken hata oluştu');
      }
    } catch (error) {
      console.error('courseAPI.update: API çağrısı hata verdi:', error);
      throw new Error('Kurs güncellenirken hata oluştu');
    }
  },

  // Kurs sil
  delete: async (id: string) => {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Kurs silinirken hata oluştu');
      }
    } catch (error) {
      console.error('courseAPI.delete: API çağrısı hata verdi:', error);
      throw new Error('Kurs silinirken hata oluştu');
    }
  }
};

// Kullanıcı API'leri
export const userAPI = {
  // Tüm kullanıcıları getir
  getAll: async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Kullanıcılar yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('userAPI.getAll: API çağrısı hata verdi:', error);
      throw new Error('Kullanıcılar yüklenirken hata oluştu');
    }
  },

  // Kullanıcı ekle
  create: async (userData: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (response.ok) {
        const result = await response.json();
        return result.user || result; // API'den dönen user objesini döndür
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Kullanıcı oluşturulurken hata oluştu');
      }
    } catch (error) {
      console.error('userAPI.create: API çağrısı hata verdi:', error);
      throw new Error('Kullanıcı oluşturulurken hata oluştu');
    }
  },

  // Kullanıcı güncelle
  update: async (id: string, userData: Record<string, unknown>) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Kullanıcı güncellenirken hata oluştu');
      }
    } catch (error) {
      console.error('userAPI.update: API çağrısı hata verdi:', error);
      throw new Error('Kullanıcı güncellenirken hata oluştu');
    }
  },

  // Kullanıcı sil
  delete: async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Kullanıcı silinirken hata oluştu');
      }
    } catch (error) {
      console.error('userAPI.delete: API çağrısı hata verdi:', error);
      throw new Error('Kullanıcı silinirken hata oluştu');
    }
  }
};

// Kategori API'leri
export const categoryAPI = {
  // Tüm kategorileri getir
  getAll: async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Kategoriler yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('categoryAPI.getAll: API çağrısı hata verdi:', error);
      throw new Error('Kategoriler yüklenirken hata oluştu');
    }
  },

  // Kategori ekle
  create: async (categoryData: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Kategori oluşturulurken hata oluştu');
      }
    } catch (error) {
      console.error('categoryAPI.create: API çağrısı hata verdi:', error);
      throw new Error('Kategori oluşturulurken hata oluştu');
    }
  },

  // Kategori güncelle
  update: async (id: string, categoryData: Record<string, unknown>) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Kategori güncellenirken hata oluştu');
      }
    } catch (error) {
      console.error('categoryAPI.update: API çağrısı hata verdi:', error);
      throw new Error('Kategori güncellenirken hata oluştu');
    }
  },

  // Kategori sil
  delete: async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Kategori silinirken hata oluştu');
      }
    } catch (error) {
      console.error('categoryAPI.delete: API çağrısı hata verdi:', error);
      throw new Error('Kategori silinirken hata oluştu');
    }
  }
};

// Sertifika API'leri
export const certificateAPI = {
  // Tüm sertifikaları getir
  getAll: async () => {
    try {
      const response = await fetch('/api/certificates');
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Sertifikalar yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('certificateAPI.getAll: API çağrısı hata verdi:', error);
      throw new Error('Sertifikalar yüklenirken hata oluştu');
    }
  },

  // Sertifika ekle
  create: async (certificateData: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certificateData)
      });
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Sertifika oluşturulurken hata oluştu');
      }
    } catch (error) {
      console.error('certificateAPI.create: API çağrısı hata verdi:', error);
      throw new Error('Sertifika oluşturulurken hata oluştu');
    }
  },

  // Sertifika güncelle
  update: async (id: string, certificateData: Record<string, unknown>) => {
    try {
      const response = await fetch(`/api/certificates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certificateData)
      });
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Sertifika güncellenirken hata oluştu');
      }
    } catch (error) {
      console.error('certificateAPI.update: API çağrısı hata verdi:', error);
      throw new Error('Sertifika güncellenirken hata oluştu');
    }
  },

  // Sertifika sil
  delete: async (id: string) => {
    try {
      const response = await fetch(`/api/certificates/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Sertifika silinirken hata oluştu');
      }
    } catch (error) {
      console.error('certificateAPI.delete: API çağrısı hata verdi:', error);
      throw new Error('Sertifika silinirken hata oluştu');
    }
  }
};

// Ayarlar API'leri
export const settingsAPI = {
  // Ayarları getir
  get: async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Ayarlar yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('settingsAPI.get: API çağrısı hata verdi:', error);
      throw new Error('Ayarlar yüklenirken hata oluştu');
    }
  },

  // Ayarları güncelle
  update: async (settingsData: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData)
      });
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Ayarlar güncellenirken hata oluştu');
      }
    } catch (error) {
      console.error('settingsAPI.update: API çağrısı hata verdi:', error);
      throw new Error('Ayarlar güncellenirken hata oluştu');
    }
  }
}; 