"use client";

// import { useSession } from "next-auth/react"; // Şu an kullanılmıyor
import { useState } from "react";

export default function SettingsPage() {
  const [language, setLanguage] = useState("tr");
  const [notifications, setNotifications] = useState(true);
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("Ayarlar kaydedildi.");
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">Hesap Ayarları</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dil</label>
          <select
            className="w-full border rounded px-3 py-2 mt-1"
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={notifications}
            onChange={e => setNotifications(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            id="notifications"
          />
          <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900">
            Bildirimleri Aç
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mt-4"
        >
          Kaydet
        </button>
        {success && <div className="text-green-600 mt-2">{success}</div>}
      </form>
    </div>
  );
} 