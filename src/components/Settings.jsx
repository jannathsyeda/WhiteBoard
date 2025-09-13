import React, { useState, useEffect } from 'react'
import { X, Palette, Volume2, VolumeX, Sun, Moon, Monitor, Save } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Settings({ isOpen, onClose }) {
  const { user, updateUser } = useAuth()
  const { theme, toggleTheme } = useTheme() 
  const [settings, setSettings] = useState({
    color: user?.color || '#3b82f6',
    soundEnabled: user?.settings?.soundEnabled ?? true,
    theme: user?.settings?.theme || 'light',
    notifications: user?.settings?.notifications ?? true,
    autoSave: user?.settings?.autoSave ?? true
  })

  const presetColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#06b6d4', '#64748b', '#000000'
  ]

  // Sync with user
  useEffect(() => {
    if (user) {
      setSettings({
        color: user.color || '#3b82f6',
        soundEnabled: user.settings?.soundEnabled ?? true,
        theme: user.settings?.theme || 'light',
        notifications: user.settings?.notifications ?? true,
        autoSave: user.settings?.autoSave ?? true
      })
    }
  }, [user])

  // ✅ When settings.theme changes, update ThemeContext
  useEffect(() => {
    if (settings.theme !== theme) {
      // If user selects auto → respect system preference
      if (settings.theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        toggleTheme(prefersDark ? 'dark' : 'light')
      } else {
        toggleTheme(settings.theme)
      }
    }
  }, [settings.theme])

  const handleSave = () => {
    updateUser({
      color: settings.color,
      settings: {
        soundEnabled: settings.soundEnabled,
        theme: settings.theme,
        notifications: settings.notifications,
        autoSave: settings.autoSave
      }
    })
    onClose()
  }

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* ✅ Theme Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Monitor className="w-4 h-4 inline mr-2" />
              Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'auto', label: 'Auto', icon: Monitor }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleInputChange('theme', opt.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition ${
                    settings.theme === opt.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <opt.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ✅ Debug */}
          <div className="p-4 bg-gray-100 dark:bg-black text-black dark:text-white border rounded">
            <p>Theme test: should change with switch</p>
            <p>Current theme (context): {theme}</p>
            <p>Current theme (settings): {settings.theme}</p>
            <p>Document dark class: {document.documentElement.classList.contains('dark') ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-400">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-xl"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
