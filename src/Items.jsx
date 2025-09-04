import React, { createContext, useContext, useReducer, useRef, useEffect, useState } from 'react';
import { Pencil, Eraser, Trash2, Users, Palette, Download, Share2 } from 'lucide-react';

// Action types
const ACTIONS = {
  SET_TOOL: 'SET_TOOL',
  SET_COLOR: 'SET_COLOR',
  SET_SIZE: 'SET_SIZE',
  ADD_STROKE: 'ADD_STROKE',
  CLEAR_CANVAS: 'CLEAR_CANVAS',
  UPDATE_USER_CURSOR: 'UPDATE_USER_CURSOR',
  SET_IS_DRAWING: 'SET_IS_DRAWING'
};

// Initial state
const initialState = {
  currentTool: 'draw',
  currentColor: '#3b82f6',
  currentSize: 3,
  strokes: [],
  users: [
    { id: 'user1', name: 'You', color: '#3b82f6', isActive: true, cursor: { x: 0, y: 0 } },
    { id: 'user2', name: 'Alice', color: '#10b981', isActive: true, cursor: { x: 100, y: 100 } },
    { id: 'user3', name: 'Bob', color: '#f59e0b', isActive: false, cursor: { x: 200, y: 200 } },
    { id: 'user4', name: 'Carol', color: '#8b5cf6', isActive: true, cursor: { x: 300, y: 300 } }
  ],
  isDrawing: false
};

// Reducer
function collaborationReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TOOL:
      return { ...state, currentTool: action.payload };
    
    case ACTIONS.SET_COLOR:
      return { ...state, currentColor: action.payload };
    
    case ACTIONS.SET_SIZE:
      return { ...state, currentSize: action.payload };
    
    case ACTIONS.ADD_STROKE:
      return { ...state, strokes: [...state.strokes, action.payload] };
    
    case ACTIONS.CLEAR_CANVAS:
      return { ...state, strokes: [] };
    
    case ACTIONS.UPDATE_USER_CURSOR:
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.userId
            ? { ...user, cursor: action.payload.position }
            : user
        )
      };
    
    case ACTIONS.SET_IS_DRAWING:
      return { ...state, isDrawing: action.payload };
    
    default:
      return state;
  }
}

// Context
const CollaborationContext = createContext();

// Context Provider
function CollaborationProvider({ children }) {
  const [state, dispatch] = useReducer(collaborationReducer, initialState);
  
  return (
    <CollaborationContext.Provider value={{ state, dispatch }}>
      {children}
    </CollaborationContext.Provider>
  );
}

// Custom hook
function useCollaboration() {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within CollaborationProvider');
  }
  return context;
}

// Toolbar Component
function Toolbar() {
  const { state, dispatch } = useCollaboration();
  
  const tools = [
    { id: 'draw', icon: Pencil, label: 'Draw' },
    { id: 'erase', icon: Eraser, label: 'Erase' }
  ];
  
  const presetColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#06b6d4', '#64748b', '#000000'
  ];
  
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
  );
}

// Canvas Component
function DrawingCanvas() {
  const { state, dispatch } = useCollaboration();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all strokes
    state.strokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      
      ctx.globalCompositeOperation = stroke.tool === 'erase' ? 'destination-out' : 'source-over';
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      
      ctx.stroke();
    });
  }, [state.strokes]);
  
  const getEventPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };
  
  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getEventPos(e);
    
    const newStroke = {
      id: Date.now() + Math.random(),
      tool: state.currentTool,
      color: state.currentColor,
      size: state.currentSize,
      points: [pos],
      userId: 'user1'
    };
    
    setCurrentStroke(newStroke);
    dispatch({ type: ACTIONS.ADD_STROKE, payload: newStroke });
    dispatch({ type: ACTIONS.SET_IS_DRAWING, payload: true });
  };
  
  const draw = (e) => {
    if (!isDrawing || !currentStroke) return;
    e.preventDefault();
    
    const pos = getEventPos(e);
    const updatedStroke = {
      ...currentStroke,
      points: [...currentStroke.points, pos]
    };
    
    setCurrentStroke(updatedStroke);
    
    // Update the current stroke
    const updatedStrokes = [...state.strokes];
    updatedStrokes[updatedStrokes.length - 1] = updatedStroke;
    
    dispatch({ type: ACTIONS.CLEAR_CANVAS });
    updatedStrokes.forEach(stroke => {
      dispatch({ type: ACTIONS.ADD_STROKE, payload: stroke });
    });
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
    setCurrentStroke(null);
    dispatch({ type: ACTIONS.SET_IS_DRAWING, payload: false });
  };
  
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={900}
        height={600}
        className="bg-white rounded-2xl shadow-2xl cursor-crosshair hover:shadow-3xl transition-all duration-300 border border-gray-200"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      
      {/* Drawing indicator */}
      {state.isDrawing && (
        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
          Drawing...
        </div>
      )}
      
      {/* Stroke count */}
      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
        {state.strokes.length} stroke{state.strokes.length !== 1 ? 's' : ''}
      </div>
      
      {/* User cursors */}
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
        ))
      }
    </div>
  );
}

// User List Component
function UsersList() {
  const { state } = useCollaboration();
  const activeUsers = state.users.filter(user => user.isActive);
  
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 min-w-[240px] border border-white/20">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-gray-600" />
        <h3 className="font-bold text-gray-800">Collaborators</h3>
        <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
          {activeUsers.length} online
        </span>
      </div>
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {activeUsers.map(user => (
          <div 
            key={user.id} 
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
          >
            <div className="relative">
              <div
                className="w-5 h-5 rounded-full border-2 border-white shadow-lg"
                style={{ backgroundColor: user.color }}
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white animate-pulse" />
            </div>
            
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {user.name}
              </span>
              {user.id === 'user1' && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                  You
                </span>
              )}
            </div>
            
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        ))}
        
        {state.users.filter(user => !user.isActive).map(user => (
          <div 
            key={user.id} 
            className="flex items-center gap-3 p-3 rounded-xl opacity-50"
          >
            <div
              className="w-5 h-5 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: user.color }}
            />
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
  );
}

// Status Bar Component
function StatusBar() {
  const { state } = useCollaboration();
  const activeUsersCount = state.users.filter(user => user.isActive).length;
  
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
  );
}

// Main App Component with simulated collaboration
function CollaborationApp() {
  const { state, dispatch } = useCollaboration();
  
  // Simulate other users drawing
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.15) { // 15% chance every 3 seconds
        const activeUsers = state.users.filter(user => user.isActive && user.id !== 'user1');
        if (activeUsers.length > 0) {
          const randomUser = activeUsers[Math.floor(Math.random() * activeUsers.length)];
          const randomStroke = {
            id: Date.now() + Math.random(),
            tool: 'draw',
            color: randomUser.color,
            size: Math.floor(Math.random() * 8) + 2,
            points: generateRandomStroke(),
            userId: randomUser.id
          };
          dispatch({ type: ACTIONS.ADD_STROKE, payload: randomStroke });
        }
      }
      
      // Update user cursor positions
      state.users.forEach(user => {
        if (user.isActive && user.id !== 'user1') {
          const newPosition = {
            x: Math.max(0, Math.min(850, user.cursor.x + (Math.random() - 0.5) * 60)),
            y: Math.max(0, Math.min(550, user.cursor.y + (Math.random() - 0.5) * 60))
          };
          
          dispatch({
            type: ACTIONS.UPDATE_USER_CURSOR,
            payload: { userId: user.id, position: newPosition }
          });
        }
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [state.users, dispatch]);
  
  const generateRandomStroke = () => {
    const startX = Math.random() * 800;
    const startY = Math.random() * 500;
    const points = [{ x: startX, y: startY }];
    
    for (let i = 1; i < 10; i++) {
      points.push({
        x: startX + (Math.random() - 0.5) * 100,
        y: startY + (Math.random() - 0.5) * 100
      });
    }
    
    return points;
  };
  
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
  );
}

// Main Export Component
export default function App() {
  return (
    <CollaborationProvider>
      <CollaborationApp />
    </CollaborationProvider>
  );
}