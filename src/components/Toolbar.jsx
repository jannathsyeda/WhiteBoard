import React from 'react'
import { Pencil, Eraser, Share2, Palette, Trash2 } from 'lucide-react'
import { ACTIONS, useCollaboration } from '../context/CollaborationContext.jsx'

export default function Toolbar() {
  const { state, dispatch } = useCollaboration()

  const tools = [
    { id: 'draw', icon: Pencil, label: 'Draw' },
    { id: 'erase', icon: Eraser, label: 'Erase' }
  ]

  const presetColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#06b6d4', '#64748b', '#000000'
  ]

  return (
    <div className="bg-white/95 backdrop-blur-sm shadow-xl border-b border-white/20 p-4">
      <div className="flex items-center justify-between flex-wrap gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">CollabBoard</h1>
              <p className="text-xs text-gray-500">Real-time collaboration</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-gray-100/80 rounded-xl p-1">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => dispatch({ type: ACTIONS.SET_TOOL, payload: tool.id })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  state.currentTool === tool.id
                    ? 'bg-white text-blue-600 shadow-md scale-105'
                    : 'hover:bg-white/50 text-gray-600 hover:text-gray-800'
                }`}
              >
                <tool.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-gray-100/80 rounded-xl p-3">
            <Palette className="w-4 h-4 text-gray-600" />
            <div className="flex items-center gap-2">
              {presetColors.map(color => (
                <button
                  key={color}
                  onClick={() => dispatch({ type: ACTIONS.SET_COLOR, payload: color })}
                  className={`w-7 h-7 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                    state.currentColor === color
                      ? 'border-gray-800 shadow-lg scale-110'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                type="color"
                value={state.currentColor}
                onChange={(e) => dispatch({ type: ACTIONS.SET_COLOR, payload: e.target.value })}
                className="w-7 h-7 rounded-lg border-2 border-gray-300 cursor-pointer ml-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-100/80 rounded-xl p-3">
            <span className="text-sm font-medium text-gray-600">Brush:</span>
            <input
              type="range"
              min="1"
              max="30"
              value={state.currentSize}
              onChange={(e) => dispatch({ type: ACTIONS.SET_SIZE, payload: parseInt(e.target.value) })}
              className="w-24 h-2 bg-gradient-to-r from-blue-200 to-purple-300 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-bold text-gray-700 min-w-[35px]">
              {state.currentSize}px
            </span>
          </div>

          <button
            onClick={() => dispatch({ type: ACTIONS.CLEAR_CANVAS })}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium">Clear</span>
          </button>
        </div>
      </div>
    </div>
  )
}



