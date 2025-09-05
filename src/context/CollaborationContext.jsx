import React, { createContext, useContext, useReducer } from 'react'
import { ACTIONS, initialState, collaborationReducer, COLLABORATION_MODES } from '../reducers/collaborationReducer.js'

const CollaborationContext = createContext()

export function CollaborationProvider({ children }) {
  const [state, dispatch] = useReducer(collaborationReducer, initialState)
  return (
    <CollaborationContext.Provider value={{ state, dispatch }}>
      {children}
    </CollaborationContext.Provider>
  )
}

export function useCollaboration() {
  const context = useContext(CollaborationContext)
  if (!context) {
    throw new Error('useCollaboration must be used within CollaborationProvider')
  }
  return context
}

// Re-export ACTIONS and COLLABORATION_MODES for convenience
export { ACTIONS, COLLABORATION_MODES }



