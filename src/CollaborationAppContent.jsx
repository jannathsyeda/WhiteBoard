import React from 'react'
import { AuthProvider } from './context/AuthContext'
import { CollaborationProvider } from './context/CollaborationContext'
import CollaborationApp from './CollaborationApp'

export default function CollaborationAppContent() {

     return (
        <AuthProvider>
          <CollaborationProvider>
            <CollaborationApp/>
          </CollaborationProvider>
        </AuthProvider>
      )
  
}
