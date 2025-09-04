export const ACTIONS = {
  SET_TOOL: 'SET_TOOL',
  SET_COLOR: 'SET_COLOR',
  SET_SIZE: 'SET_SIZE',
  ADD_STROKE: 'ADD_STROKE',
  CLEAR_CANVAS: 'CLEAR_CANVAS',
  UPDATE_USER_CURSOR: 'UPDATE_USER_CURSOR',
  SET_IS_DRAWING: 'SET_IS_DRAWING'
}

export const initialState = {
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
}

export function collaborationReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TOOL:
      return { ...state, currentTool: action.payload }
    case ACTIONS.SET_COLOR:
      return { ...state, currentColor: action.payload }
    case ACTIONS.SET_SIZE:
      return { ...state, currentSize: action.payload }
    case ACTIONS.ADD_STROKE:
      return { ...state, strokes: [...state.strokes, action.payload] }
    case ACTIONS.CLEAR_CANVAS:
      return { ...state, strokes: [] }
    case ACTIONS.UPDATE_USER_CURSOR:
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.userId
            ? { ...user, cursor: action.payload.position }
            : user
        )
      }
    case ACTIONS.SET_IS_DRAWING:
      return { ...state, isDrawing: action.payload }
    default:
      return state
  }
}
