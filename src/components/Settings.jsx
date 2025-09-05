import React, { useState } from 'react'
import { X, Palette, Volume2, VolumeX, Sun, Moon, Monitor, Save } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Settings({ isOpen, onClose }) {
  const { user, login } = useAuth()
  const [settings, setSettings] = useState({
    color: user?.color || '#3b82f6',
    soundEnabled: true,
    theme: 'light',
    notifications: true,
    autoSave: true
  })

  const presetColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#06b6d4', '#64748b', '#000000'
  ]

  const handleSave = () => {
    // Update user with new settings
    const updatedUser = {
      ...user,
      color: settings.color,
      settings: {
        soundEnabled: settings.soundEnabled,
        theme: settings.theme,
        notifications: settings.notifications,
        autoSave: settings.autoSave
      }
    }
    login(updatedUser) // This will update the user in localStorage
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
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Color Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Palette className="w-4 h-4 inline mr-2" />
              Your Color
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {presetColors.map(color => (
                  <button
                    key={color}
                    onClick={() => handleInputChange('color', color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                      settings.color === color
                        ? 'border-gray-800 shadow-lg scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={settings.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className="w-8 h-8 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
            </div>
          </div>

          {/* Sound Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 inline mr-2" /> : <VolumeX className="w-4 h-4 inline mr-2" />}
              Sound Effects
            </label>
            <button
              onClick={() => handleInputChange('soundEnabled', !settings.soundEnabled)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                settings.soundEnabled
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 ${
                settings.soundEnabled ? 'bg-green-500 border-green-500' : 'border-gray-300'
              }`} />
              <span className="font-medium">
                {settings.soundEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </button>
          </div>

          {/* Theme Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Monitor className="w-4 h-4 inline mr-2" />
              Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'auto', label: 'Auto', icon: Monitor }
              ].map(theme => (
                <button
                  key={theme.id}
                  onClick={() => handleInputChange('theme', theme.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                    settings.theme === theme.id
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <theme.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Notifications
            </label>
            <button
              onClick={() => handleInputChange('notifications', !settings.notifications)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                settings.notifications
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 ${
                settings.notifications ? 'bg-green-500 border-green-500' : 'border-gray-300'
              }`} />
              <span className="font-medium">
                {settings.notifications ? 'Enabled' : 'Disabled'}
              </span>
            </button>
          </div>

          {/* Auto Save */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Auto Save
            </label>
            <button
              onClick={() => handleInputChange('autoSave', !settings.autoSave)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                settings.autoSave
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 ${
                settings.autoSave ? 'bg-green-500 border-green-500' : 'border-gray-300'
              }`} />
              <span className="font-medium">
                {settings.autoSave ? 'Enabled' : 'Disabled'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
