import React, { useState } from 'react'
import { User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function UserProfile() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/20 transition-all duration-200 group"
      >
        <div className="relative">
          <div
            className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-medium text-sm"
            style={{ backgroundColor: user.color }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-white group-hover:text-gray-100">
            {user.name}
          </div>
          <div className="text-xs text-white/70">
            Online
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 z-20 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-lg flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="w-4 h-4" />
                <span className="text-sm">Profile</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </button>
              
              <div className="border-t border-gray-200 my-2" />
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>

            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Joined: {new Date(user.loginTime).toLocaleDateString()}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
