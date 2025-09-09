import React, { useEffect, useRef, useState } from 'react'
import { ACTIONS, useCollaboration } from '../context/CollaborationContext.jsx'

export default function DrawingCanvas() {
  const { state, dispatch } = useCollaboration()
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentStroke, setCurrentStroke] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    state.strokes.forEach(stroke => {
      if (stroke.points.length < 2) return
      ctx.globalCompositeOperation = stroke.tool === 'erase' ? 'destination-out' : 'source-over'
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.size
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.beginPath()
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
      }
      ctx.stroke()
    })
  }, [state.strokes])

  const getEventPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX)
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY)
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const startDrawing = (e) => {
    e.preventDefault()
    
    // Check if drawing is allowed
    if (state.isLayerLocked) {
      console.log('Drawing blocked: Layer is locked')
      return
    }
    
    // View-only mode only blocks other users, not the owner (user1)
    // The owner can always draw unless layer is locked
    
    setIsDrawing(true)
    const pos = getEventPos(e)
    const newStroke = {
      id: Date.now() + Math.random(),
      tool: state.currentTool,
      color: state.currentColor,
      size: state.currentSize,
      points: [pos],
      userId: 'user1'
    }
    setCurrentStroke(newStroke)
    dispatch({ type: ACTIONS.ADD_STROKE, payload: newStroke })
    dispatch({ type: ACTIONS.SET_IS_DRAWING, payload: true })
  }

  const draw = (e) => {
    if (!isDrawing || !currentStroke) return
    
    // Check if drawing is still allowed
    if (state.isLayerLocked) {
      stopDrawing()
      return
    }
    
    e.preventDefault()
    const pos = getEventPos(e)
    const updatedStroke = { ...currentStroke, points: [...currentStroke.points, pos] }
    setCurrentStroke(updatedStroke)

    const updatedStrokes = [...state.strokes]
    updatedStrokes[updatedStrokes.length - 1] = updatedStroke

    dispatch({ type: ACTIONS.CLEAR_CANVAS })
    updatedStrokes.forEach(stroke => {
      dispatch({ type: ACTIONS.ADD_STROKE, payload: stroke })
    })
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    setCurrentStroke(null)
    dispatch({ type: ACTIONS.SET_IS_DRAWING, payload: false })
  }

  // Only the layer lock blocks the owner from drawing
  // View-only mode only affects other users
  const isDrawingBlocked = state.isLayerLocked
  
  return (
    <div className="relative ">
      <canvas
        ref={canvasRef}
        width={900}
        height={600}
        className={`bg-white rounded-2xl shadow-2xl transition-all duration-300 border border-gray-200 ${
          isDrawingBlocked 
            ? 'cursor-not-allowed opacity-75' 
            : 'cursor-crosshair hover:shadow-3xl'
        }`}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      {state.isDrawing && (
        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
          Drawing...
        </div>
      )}

      {isDrawingBlocked && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          🔒 Layer Locked
        </div>
      )}

      {state.collaborationEnabled && state.collaborationMode === 'view-only' && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          👁️ View Only (Others)
        </div>
      )}

      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
        {state.strokes.length} stroke{state.strokes.length !== 1 ? 's' : ''}
      </div>

      {state.users
        .filter(user => user.isActive && user.id !== 'user1')
        .map(user => (
          <div
            key={user.id}
            className="absolute w-3 h-3 rounded-full border-2 border-white shadow-lg pointer-events-none z-10 transition-all duration-200"
            style={{
              backgroundColor: user.color,
              left: user.cursor.x + 'px',
              top: user.cursor.y + 'px',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="absolute top-4 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
              {user.name}
            </div>
          </div>
        ))}
    </div>
  )
}


