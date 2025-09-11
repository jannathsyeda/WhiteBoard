import React, { useState } from 'react'
import { Pencil, Eraser, Share2, Palette, Trash2, Users, Lock, Unlock } from 'lucide-react'
import { ACTIONS, useCollaboration } from '../context/CollaborationContext.jsx'
import UserProfile from './UserProfile.jsx'
import CollaborationSettings from './CollaborationSettings.jsx'

export default function Toolbar() {
  const { state, dispatch } = useCollaboration()
  const [showCollaborationSettings, setShowCollaborationSettings] = useState(false)

  const tools = [
    { id: 'draw', icon: Pencil, label: 'Draw' },
    { id: 'erase', icon: Eraser, label: 'Erase' }
  ]

  const presetColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#06b6d4', '#64748b', '#000000'
  ]

  return (
  <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl border-b border-white/20 dark:border-gray-700/30 p-4 relative z-20">
  <div className="flex items-center justify-between flex-wrap gap-4 max-w-7xl mx-auto">
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Share2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">CollabBoard</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Real-time collaboration</p>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-1">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => dispatch({ type: ACTIONS.SET_TOOL, payload: tool.id })}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              state.currentTool === tool.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md scale-105'
                : 'hover:bg-white/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
            }`}
          >
            <tool.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{tool.label}</span>
          </button>
        ))}
      </div>
    </div>

    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-3">
        <Palette className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        <div className="flex items-center gap-2">
          {presetColors.map(color => (
            <button
              key={color}
              onClick={() => dispatch({ type: ACTIONS.SET_COLOR, payload: color })}
              className={`w-7 h-7 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                state.currentColor === color
                  ? 'border-gray-800 dark:border-gray-300 shadow-lg scale-110'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
          <input
            type="color"
            value={state.currentColor}
            onChange={(e) => dispatch({ type: ACTIONS.SET_COLOR, payload: e.target.value })}
            className="w-7 h-7 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer ml-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-3">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Brush:</span>
        <input
          type="range"
          min="1"
          max="30"
          value={state.currentSize}
          onChange={(e) => dispatch({ type: ACTIONS.SET_SIZE, payload: parseInt(e.target.value) })}
          className="w-24 h-2 bg-gradient-to-r from-blue-200 to-purple-300 dark:from-blue-800 dark:to-purple-700 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm font-bold text-gray-700 dark:text-gray-200 min-w-[35px]">
          {state.currentSize}px
        </span>
      </div>

      <button
        onClick={() => dispatch({ type: ACTIONS.CLEAR_CANVAS })}
        className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-all duration-200 hover:scale-105"
      >
        <Trash2 className="w-4 h-4" />
        <span className="text-sm font-medium">Clear</span>
      </button>

      <button
        onClick={() => dispatch({ type: ACTIONS.TOGGLE_LAYER_LOCK })}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 ${
          state.isLayerLocked
            ? 'bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400'
            : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
        }`}
      >
        {state.isLayerLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        <span className="text-sm font-medium">
          {state.isLayerLocked ? 'Unlock' : 'Lock'}
        </span>
      </button>

      <button
        onClick={() => setShowCollaborationSettings(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 ${
          state.collaborationEnabled
            ? 'bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400'
            : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
        }`}
      >
        <Users className="w-4 h-4" />
        <span className="text-sm font-medium">Collaborate</span>
      </button>

      <UserProfile />
    </div>
  </div>

  {/* Collaboration Settings Modal */}
  <CollaborationSettings 
    isOpen={showCollaborationSettings} 
    onClose={() => setShowCollaborationSettings(false)} 
  />
</div>
  )
}



