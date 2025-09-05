import React, { useEffect } from 'react'
import Toolbar from './components/Toolbar.jsx'
import DrawingCanvas from './components/DrawingCanvas.jsx'
import UsersList from './components/UsersList.jsx'
import StatusBar from './components/StatusBar.jsx'
import Login from './components/Login.jsx'
import { ACTIONS, CollaborationProvider, useCollaboration } from './context/CollaborationContext.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

function CollaborationShell() {
  const { state, dispatch } = useCollaboration()
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-lg font-medium text-gray-700">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login />
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Only allow simulated drawing if collaboration is enabled, layer is not locked, and not in view-only mode
      if (Math.random() < 0.15 && state.collaborationEnabled && !state.isLayerLocked && state.collaborationMode !== 'view-only') {
        const activeUsers = state.users.filter(user => user.isActive && user.id !== 'user1')
        if (activeUsers.length > 0) {
          const randomUser = activeUsers[Math.floor(Math.random() * activeUsers.length)]
          const randomStroke = {
            id: Date.now() + Math.random(),
            tool: 'draw',
            color: randomUser.color,
            size: Math.floor(Math.random() * 8) + 2,
            points: generateRandomStroke(),
            userId: randomUser.id
          }
          dispatch({ type: ACTIONS.ADD_STROKE, payload: randomStroke })
        }
      }

      state.users.forEach(user => {
        if (user.isActive && user.id !== 'user1') {
          const newPosition = {
            x: Math.max(0, Math.min(850, user.cursor.x + (Math.random() - 0.5) * 60)),
            y: Math.max(0, Math.min(550, user.cursor.y + (Math.random() - 0.5) * 60))
          }
          dispatch({ type: ACTIONS.UPDATE_USER_CURSOR, payload: { userId: user.id, position: newPosition } })
        }
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [state.users, dispatch])

  const generateRandomStroke = () => {
    const startX = Math.random() * 800
    const startY = Math.random() * 500
    const points = [{ x: startX, y: startY }]
    for (let i = 1; i < 10; i++) {
      points.push({ x: startX + (Math.random() - 0.5) * 100, y: startY + (Math.random() - 0.5) * 100 })
    }
    return points
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex flex-col">
      <Toolbar />
      <div className="flex-1 flex items-center justify-center p-6 gap-6">
        <div className="hidden lg:block flex-shrink-0">
          <UsersList />
        </div>
        <div className="flex-1 flex justify-center">
          <DrawingCanvas />
        </div>
      </div>
      
      {/* Mobile UsersList - positioned at bottom */}
      <div className="lg:hidden fixed bottom-20 left-4 right-4 z-20">
        <UsersList />
      </div>
      <StatusBar />
    </div>
  )
}

export default function CollaborationApp() {
  return (
    <AuthProvider>
      <CollaborationProvider>
        <CollaborationShell />
      </CollaborationProvider>
    </AuthProvider>
  )
}


