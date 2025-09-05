import React, { useState } from 'react'
import { Users, Share2, X, Copy, Check, Mail } from 'lucide-react'
import { useCollaboration, ACTIONS } from '../context/CollaborationContext.jsx'

export default function UsersList() {
  const { state, dispatch } = useCollaboration()
  const activeUsers = state.users.filter(user => user.isActive)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [copied, setCopied] = useState(false)
  const [isInviting, setIsInviting] = useState(false)

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) return
    
    setIsInviting(true)
    
    // Simulate sending invite
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newCollaborator = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      isActive: false,
      isOwner: false
    }
    
    dispatch({ type: ACTIONS.ADD_COLLABORATOR, payload: newCollaborator })
    setInviteEmail('')
    setIsInviting(false)
    setShowInviteModal(false)
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}${window.location.pathname}?collab=true&mode=${state.collaborationMode}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 w-[280px] border border-white/20 relative z-10">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-gray-600" />
        <h3 className="font-bold text-gray-800">Collaborators</h3>
        <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
          {activeUsers.length} online
        </span>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {activeUsers.map(user => (
          <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
            <div className="relative">
              <div className="w-5 h-5 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: user.color }} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white animate-pulse" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {user.name}
              </span>
              {user.id === 'user1' && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">You</span>
              )}
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        ))}

        {state.users.filter(user => !user.isActive).map(user => (
          <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl opacity-50">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300" style={{ backgroundColor: user.color }} />
            <span className="text-sm text-gray-500">{user.name}</span>
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
        <button 
          onClick={() => setShowInviteModal(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors text-sm font-medium"
        >
          <Share2 className="w-4 h-4" />
          Invite Others
        </button>
        
        <button 
          onClick={handleCopyLink}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-colors text-sm font-medium"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setShowInviteModal(false)}
          />
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Invite Collaborator</h2>
                  <p className="text-sm text-gray-500">Send an invitation to join your board</p>
                </div>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-medium text-blue-800 mb-2">Invitation Details</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• They'll receive an email invitation</p>
                  <p>• Access level: {state.collaborationMode === 'view-only' ? 'View Only' : 'Can Edit'}</p>
                  <p>• They can join immediately with the link</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteUser}
                disabled={!inviteEmail.trim() || isInviting}
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium"
              >
                {isInviting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Send Invite
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


