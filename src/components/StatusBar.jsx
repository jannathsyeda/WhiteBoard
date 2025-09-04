import React from 'react'
import { Download } from 'lucide-react'
import { useCollaboration } from '../context/CollaborationContext.jsx'

export default function StatusBar() {
  const { state } = useCollaboration()
  const activeUsersCount = state.users.filter(user => user.isActive).length

  return (
    <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Tool: <span className="font-medium capitalize text-blue-600">{state.currentTool}</span></span>
          <span>Color: <span className="font-medium" style={{ color: state.currentColor }}>{state.currentColor}</span></span>
          <span>Size: <span className="font-medium">{state.currentSize}px</span></span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {activeUsersCount} user{activeUsersCount !== 1 ? 's' : ''} online
          </span>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors text-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


