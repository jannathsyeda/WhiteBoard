import React, { useState } from 'react'
import CollaborationApp from "./CollaborationApp.jsx"
import { ThemeProvider } from './context/ThemeContext.jsx'
import CollaborationAppContent from './CollaborationAppContent.jsx'

export default function Page() {
    
    return (
       <ThemeProvider>
            <CollaborationAppContent/>
            </ThemeProvider>
      
    )
}
