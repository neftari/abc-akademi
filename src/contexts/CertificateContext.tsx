"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { certificateAPI } from '@/lib/api';

interface Certificate {
  _id?: string;
  id?: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  courseId: string;
  certificateNumber: string;
  issueDate: string;
  status: 'issued' | 'pending' | 'revoked';
}

interface CertificateContextType {
  certificates: Certificate[];
  loading: boolean;
  error: string | null;
  addCertificate: (certificate: Omit<Certificate, 'id' | '_id'>) => Promise<void>;
  updateCertificate: (id: string, certificate: Partial<Certificate>) => Promise<void>;
  deleteCertificate: (id: string) => Promise<void>;
  getCertificateById: (id: string) => Certificate | undefined;
  getCertificatesByStudent: (email: string) => Certificate[];
  getCertificatesByCourse: (courseId: string) => Certificate[];
  refreshCertificates: () => Promise<void>;
}

const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

export const useCertificates = () => {
  const context = useContext(CertificateContext);
  if (context === undefined) {
    throw new Error('useCertificates must be used within a CertificateProvider');
  }
  return context;
};

interface CertificateProviderProps {
  children: ReactNode;
}

export const CertificateProvider: React.FC<CertificateProviderProps> = ({ children }) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await certificateAPI.getAll();
      setCertificates(data);
    } catch (err) {
      setError('Sertifikalar yüklenirken hata oluştu');
      console.error('Error loading certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const addCertificate = async (certificateData: Omit<Certificate, 'id' | '_id'>) => {
    try {
      const newCertificate = await certificateAPI.create(certificateData);
      setCertificates(prev => [...prev, newCertificate]);
    } catch (err) {
      setError('Sertifika eklenirken hata oluştu');
      throw err;
    }
  };

  const updateCertificate = async (id: string, certificateData: Partial<Certificate>) => {
    try {
      const updatedCertificate = await certificateAPI.update(id, certificateData);
      setCertificates(prev => prev.map(certificate => 
        (certificate._id === id || certificate.id === id) ? { ...certificate, ...updatedCertificate } : certificate
      ));
    } catch (err) {
      setError('Sertifika güncellenirken hata oluştu');
      throw err;
    }
  };

  const deleteCertificate = async (id: string) => {
    try {
      await certificateAPI.delete(id);
      setCertificates(prev => prev.filter(certificate => certificate._id !== id && certificate.id !== id));
    } catch (err) {
      setError('Sertifika silinirken hata oluştu');
      throw err;
    }
  };

  const getCertificateById = (id: string) => {
    return certificates.find(certificate => certificate._id === id || certificate.id === id);
  };

  const getCertificatesByStudent = (email: string) => {
    return certificates.filter(certificate => certificate.studentEmail === email);
  };

  const getCertificatesByCourse = (courseId: string) => {
    return certificates.filter(certificate => certificate.courseId === courseId);
  };

  const refreshCertificates = async () => {
    await loadCertificates();
  };

  const value: CertificateContextType = {
    certificates,
    loading,
    error,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    getCertificateById,
    getCertificatesByStudent,
    getCertificatesByCourse,
    refreshCertificates
  };

  return (
    <CertificateContext.Provider value={value}>
      {children}
    </CertificateContext.Provider>
  );
}; 