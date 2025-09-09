import React, { useState } from 'react'
import { X, Users, UserPlus, Eye, EyeOff, Lock, Unlock, Settings, Share2, Copy, Check } from 'lucide-react'
import { ACTIONS, COLLABORATION_MODES, useCollaboration } from '../context/CollaborationContext.jsx'

export default function CollaborationSettings({ isOpen, onClose }) {
  const { state, dispatch } = useCollaboration()
  const [inviteEmail, setInviteEmail] = useState('')
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleToggleCollaboration = () => {
    dispatch({ type: ACTIONS.TOGGLE_COLLABORATION })
  }

  const handleModeChange = (mode) => {
    dispatch({ type: ACTIONS.SET_COLLABORATION_MODE, payload: mode })
  }

  const handleInviteUser = () => {
    if (!inviteEmail.trim()) return
    
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
  }

  const handleRemoveCollaborator = (collaboratorId) => {
    dispatch({ type: ACTIONS.REMOVE_COLLABORATOR, payload: collaboratorId })
  }

  const handleToggleLayerLock = () => {
    dispatch({ type: ACTIONS.TOGGLE_LAYER_LOCK })
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}${window.location.pathname}?collab=true&mode=${state.collaborationMode}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm " 
        onClick={onClose}
      />
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Collaboration Settings</h2>
              <p className="text-sm text-gray-500">Manage who can access and edit your board</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Collaboration Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                state.collaborationEnabled ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Users className={`w-5 h-5 ${
                  state.collaborationEnabled ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Enable Collaboration</h3>
                <p className="text-sm text-gray-500">
                  {state.collaborationEnabled ? 'Others can join your board' : 'Only you can edit this board'}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleCollaboration}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                state.collaborationEnabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                state.collaborationEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {state.collaborationEnabled && (
            <>
              {/* Collaboration Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Settings className="w-4 h-4 inline mr-2" />
                  Collaboration Mode
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(COLLABORATION_MODES).map(([mode, config]) => (
                    <button
                      key={mode}
                      onClick={() => handleModeChange(mode)}
                      className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 ${
                        state.collaborationMode === mode
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                        state.collaborationMode === mode
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300'
                      }`} />
                      <div className="text-left">
                        <div className="font-medium">{config.label}</div>
                        <div className="text-sm text-gray-500">{config.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Share Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Share2 className="w-4 h-4 inline mr-2" />
                  Share Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}${window.location.pathname}?collab=true&mode=${state.collaborationMode}`}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Invite Users */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <UserPlus className="w-4 h-4 inline mr-2" />
                  Invite Users
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleInviteUser}
                    disabled={!inviteEmail.trim()}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium"
                  >
                    Invite
                  </button>
                </div>
              </div>

              {/* Collaborators List */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Users className="w-4 h-4 inline mr-2" />
                  Collaborators ({state.collaborators.length})
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {state.collaborators.map(collaborator => (
                    <div key={collaborator.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-medium text-sm"
                          style={{ backgroundColor: collaborator.color }}
                        >
                          {collaborator.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{collaborator.name}</div>
                          <div className="text-sm text-gray-500">
                            {collaborator.isOwner ? 'Owner' : collaborator.isActive ? 'Active' : 'Pending'}
                          </div>
                        </div>
                      </div>
                      {!collaborator.isOwner && (
                        <button
                          onClick={() => handleRemoveCollaborator(collaborator.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Layer Lock */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                state.isLayerLocked ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {state.isLayerLocked ? (
                  <Lock className="w-5 h-5 text-red-600" />
                ) : (
                  <Unlock className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Lock Layer</h3>
                <p className="text-sm text-gray-500">
                  {state.isLayerLocked ? 'Layer is locked - no editing allowed' : 'Layer is unlocked - editing allowed'}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleLayerLock}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                state.isLayerLocked ? 'bg-red-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                state.isLayerLocked ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

