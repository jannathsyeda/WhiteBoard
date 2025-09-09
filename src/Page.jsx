import React, { useState } from 'react'
import CollaborationApp from "./CollaborationApp.jsx"
import { useContext } from 'react'
import { ThemeContext } from './context/ThemeContext.jsx'
import CollaborationAppContent from './CollaborationAppContent.jsx'

export default function Page() {
 const [darkMode, setDarkMode] = useState(false)
    
    return (
        <ThemeContext.Provider value={{darkMode, setDarkMode}}>
            <CollaborationAppContent/>
        </ThemeContext.Provider>
    )
}
