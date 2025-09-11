import React, { useContext } from 'react'
import { AuthProvider } from './context/AuthContext'
import { CollaborationProvider } from './context/CollaborationContext'
import CollaborationApp from './CollaborationApp'
import { ThemeContext } from './context/ThemeContext'

export default function CollaborationAppContent() {
const {darkMode}=useContext(ThemeContext)
     return (
      <div className={`h-full w-full ${darkMode ?"dark":"" }`}>
        <AuthProvider>
          <CollaborationProvider>
            <CollaborationApp/>
          </CollaborationProvider>
        </AuthProvider>
        </div>
      )
  
}
