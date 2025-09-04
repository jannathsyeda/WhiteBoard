import React, { useEffect } from 'react'
import Toolbar from './components/Toolbar.jsx'
import DrawingCanvas from './components/DrawingCanvas.jsx'
import UsersList from './components/UsersList.jsx'
import StatusBar from './components/StatusBar.jsx'
import { ACTIONS, CollaborationProvider, useCollaboration } from './context/CollaborationContext.jsx'

function CollaborationShell() {
  const { state, dispatch } = useCollaboration()

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.15) {
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
      <div className="flex-1 relative flex items-center justify-center p-6">
        <DrawingCanvas />
        <div className="absolute top-6 right-6">
          <UsersList />
        </div>
      </div>
      <StatusBar />
    </div>
  )
}

export default function CollaborationApp() {
  return (
    <CollaborationProvider>
      <CollaborationShell />
    </CollaborationProvider>
  )
}


