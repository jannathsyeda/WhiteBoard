import React, { useContext, useState } from 'react'
import { X, User, Mail, Palette, Edit3, Save, Camera } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { ThemeContext } from '../context/ThemeContext.jsx'

export default function Profile({ isOpen, onClose }) {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    color: user?.color || '#3b82f6'
  })

  const {darkMode}=useContext(ThemeContext)

  const presetColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#06b6d4', '#64748b', '#000000'
  ]

  const handleSave = () => {
    updateUser({
      name: profileData.name.trim(),
      email: profileData.email.trim(),
      color: profileData.color
    })
    setIsEditing(false)
    onClose()
  }

  const handleInputChange = (key, value) => {
    setProfileData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleEdit = () => {
    setIsEditing(true)
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      color: user?.color || '#3b82f6'
    })
  }

  if (!isOpen) return null

  return (
   <div className={` fixed inset-0 z-50 flex items-center justify-center p-4 ${darkMode ? "dark" : ""}`}>
  <div 
    className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
    onClick={onClose}
  />
  <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 w-full max-w-md max-h-[90vh] overflow-y-auto">
    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Profile</h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>
    </div>

    <div className="p-6 space-y-6">
      {/* Profile Picture/Avatar */}
      <div className="text-center">
        <div className="relative inline-block">
          <div
            className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-xl flex items-center justify-center text-white font-bold text-2xl mx-auto"
            style={{ backgroundColor: profileData.color }}
          >
            {profileData.name.charAt(0).toUpperCase()}
          </div>
          {isEditing && (
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Profile Avatar</p>
      </div>

      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <User className="w-4 h-4 inline mr-2" />
          Name
        </label>
        {isEditing ? (
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter your name"
          />
        ) : (
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-800 dark:text-gray-200">
            {user?.name}
          </div>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Mail className="w-4 h-4 inline mr-2" />
          Email
        </label>
        {isEditing ? (
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter your email"
          />
        ) : (
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-800 dark:text-gray-200">
            {user?.email}
          </div>
        )}
      </div>

      {/* Color Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Palette className="w-4 h-4 inline mr-2" />
          Color
        </label>
        {isEditing ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {presetColors.map(color => (
                <button
                  key={color}
                  onClick={() => handleInputChange('color', color)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                    profileData.color === color
                      ? 'border-gray-800 dark:border-gray-300 shadow-lg scale-110'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="color"
              value={profileData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
              className="w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: user?.color }}
            />
            <span className="text-gray-800 dark:text-gray-200 font-mono">{user?.color}</span>
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Account Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">User ID:</span>
            <span className="font-mono text-gray-800 dark:text-gray-200">{user?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Joined:</span>
            <span className="text-gray-800 dark:text-gray-200">
              {user?.loginTime ? new Date(user.loginTime).toLocaleDateString() : 'Unknown'}
            </span>
          </div>
          {user?.lastUpdated && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
              <span className="text-gray-800 dark:text-gray-200">
                {new Date(user.lastUpdated).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
      {isEditing ? (
        <>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
        </>
      )}
    </div>
  </div>
</div>
  )
}
