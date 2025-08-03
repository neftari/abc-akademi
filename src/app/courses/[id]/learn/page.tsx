'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
// Lucide React import'larını kaldırıp emoji kullanacağız
// CourseContext'i kaldırıyoruz çünkü statik veri kullanıyoruz
import { 
  getCourseContent, 
  getNextLesson, 
  getPreviousLesson,
  calculateProgress,
  type Lesson
} from '@/lib/courseContent';
import Link from 'next/link';

export default function CourseLearnPage() {
  const params = useParams();
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  
  const courseContent = getCourseContent(params.id as string);
  
  // İlk modülü seç
  useEffect(() => {
    if (courseContent && courseContent.modules.length > 0 && !selectedModule) {
      setSelectedModule(courseContent.modules[0].id);
      if (courseContent.modules[0].lessons.length > 0) {
        setSelectedLesson(courseContent.modules[0].lessons[0].id);
      }
    }
  }, [courseContent, selectedModule]);

  if (!courseContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Kurs Bulunamadı</h1>
          <p className="text-gray-600 mb-4">Bu kurs için eğitim içeriği henüz hazırlanmamış.</p>
          <Link href="/courses" className="text-blue-600 hover:text-blue-800">
            ← Kurslara Dön
          </Link>
        </div>
      </div>
    );
  }

  const currentModule = courseContent.modules.find(m => m.id === selectedModule);
  const currentLesson = currentModule?.lessons.find(l => l.id === selectedLesson);

  const progress = calculateProgress(params.id as string, completedLessons);

  const handleLessonComplete = () => {
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'text': return <span className="text-lg">📄</span>;
      case 'video': return <span className="text-lg">▶️</span>;
      case 'document': return <span className="text-lg">📥</span>;
      case 'test': return <span className="text-lg">📊</span>;
      default: return <span className="text-lg">📖</span>;
    }
  };

  const getLessonStatus = (lessonId: string) => {
    const isCompleted = completedLessons.includes(lessonId);
    return isCompleted ? (
      <span className="text-green-500 text-lg">✅</span>
    ) : (
      <span className="text-gray-400 text-lg">⭕</span>
    );
  };

  const renderLessonContent = (lesson: Lesson) => {
    return (
      <div className="space-y-6">
        {/* Öğrenme Hedefleri */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <span className="mr-2">🎯</span>
            Öğrenme Hedefleri
          </h3>
          <ul className="space-y-2">
            {lesson.content.learningObjectives.map((objective, index) => (
              <li key={index} className="flex items-start">
                                        <span className="text-blue-600 mr-2 mt-0.5 flex-shrink-0 text-lg">✅</span>
                <span className="text-blue-800">{objective}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ana İçerik */}
        <div className="space-y-4">
          {lesson.content.mainContent.sections.map((section, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h4>
              <p className="text-gray-700 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Pratik Örnekler */}
        {lesson.content.practicalExamples.length > 0 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
              <span className="mr-2">💡</span>
              Pratik Örnekler
            </h3>
            <div className="space-y-4">
              {lesson.content.practicalExamples.map((example, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <h4 className="font-medium text-green-800 mb-2">{example.title}</h4>
                  <p className="text-green-700 mb-2">{example.description}</p>
                  {example.steps && (
                    <ol className="list-decimal list-inside space-y-1 text-green-700">
                      {example.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ol>
                  )}
                  {example.dialogue && (
                    <div className="space-y-2">
                      {Object.entries(example.dialogue).map(([speaker, text]) => (
                        <div key={speaker} className="flex">
                          <span className="font-medium text-green-800 mr-2">{speaker}:</span>
                          <span className="text-green-700">{text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Önemli Notlar */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
            <span className="mr-2">⚠️</span>
            Önemli Notlar
          </h3>
          <ul className="space-y-2">
            {lesson.content.importantNotes.map((note, index) => (
              <li key={index} className="flex items-start">
                <span className="text-yellow-600 mr-2 mt-0.5">⚠️</span>
                <span className="text-yellow-800">{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Özet */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Özet</h3>
          <p className="text-gray-700">{lesson.content.summary}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href={`/courses/${params.id}`}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← Kursa Dön
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">{courseContent.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                İlerleme: %{Math.round(progress)}
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Modüller */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Modüller</h2>
              <div className="space-y-2">
                {courseContent.modules.map((module) => (
                  <div key={module.id} className="space-y-2">
                    <button
                      onClick={() => setSelectedModule(module.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedModule === module.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{module.title}</span>
                        <span className="text-lg">▶️</span>
                      </div>
                    </button>
                    
                    {selectedModule === module.id && (
                      <div className="ml-4 space-y-1">
                        {module.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson.id)}
                            className={`w-full text-left p-2 rounded transition-colors flex items-center space-x-2 ${
                              selectedLesson === lesson.id
                                ? 'bg-blue-100 text-blue-700'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            {getLessonStatus(lesson.id)}
                            {getLessonIcon(lesson.type)}
                            <span className="text-sm">{lesson.title}</span>
                            <span className="text-xs text-gray-500 ml-auto">{lesson.duration}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Ders İçeriği */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              {currentLesson ? (
                <div className="p-8">
                  {/* Ders Header */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                      <span>{currentModule?.title}</span>
                      <span className="text-lg">▶️</span>
                      <span>{currentLesson.title}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentLesson.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">⏰</span>
                        <span>{currentLesson.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getLessonIcon(currentLesson.type)}
                        <span className="capitalize">{currentLesson.type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ders İçeriği */}
                  <div className="prose max-w-none">
                    {renderLessonContent(currentLesson)}
                  </div>

                  {/* Navigation */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => {
                          const prev = getPreviousLesson(params.id as string, selectedModule, selectedLesson);
                          if (prev) {
                            setSelectedModule(prev.moduleId);
                            setSelectedLesson(prev.lessonId);
                          }
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <span className="text-lg">◀️</span>
                        <span>Önceki Ders</span>
                      </button>
                      
                      <button 
                        onClick={handleLessonComplete}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Dersi Tamamla
                      </button>
                      
                      <button 
                        onClick={() => {
                          const next = getNextLesson(params.id as string, selectedModule, selectedLesson);
                          if (next) {
                            setSelectedModule(next.moduleId);
                            setSelectedLesson(next.lessonId);
                          }
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <span>Sonraki Ders</span>
                        <span className="text-lg">▶️</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Bir ders seçin
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 