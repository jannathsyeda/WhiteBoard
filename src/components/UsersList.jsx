import React from 'react'
import { Users, Share2 } from 'lucide-react'
import { useCollaboration } from '../context/CollaborationContext.jsx'

export default function UsersList() {
  const { state } = useCollaboration()
  const activeUsers = state.users.filter(user => user.isActive)

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 min-w-[240px] border border-white/20 relative z-10">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-gray-600" />
        <h3 className="font-bold text-gray-800">Collaborators</h3>
        <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
          {activeUsers.length} online
        </span>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {activeUsers.map(user => (
          <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
            <div className="relative">
              <div className="w-5 h-5 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: user.color }} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white animate-pulse" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {user.name}
              </span>
              {user.id === 'user1' && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">You</span>
              )}
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        ))}

        {state.users.filter(user => !user.isActive).map(user => (
          <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl opacity-50">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300" style={{ backgroundColor: user.color }} />
            <span className="text-sm text-gray-500">{user.name}</span>
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors text-sm font-medium">
          <Share2 className="w-4 h-4" />
          Invite Others
        </button>
      </div>
    </div>
  )
}


