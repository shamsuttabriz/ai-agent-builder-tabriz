import React from 'react'
import { Bot, Brain, Sparkles, Settings, Play, Trash2, ChevronRight } from 'lucide-react'

interface AgentCardProps {
  name: string
  profileName?: string
  skillCount: number
  layerCount: number
  provider?: string
  onLoad: () => void
  onDelete: () => void
}

export const AgentCard: React.FC<AgentCardProps> = ({
  name,
  profileName,
  skillCount,
  layerCount,
  provider,
  onLoad,
  onDelete,
}) => {
  return (
    <div className="group card-hover p-6 bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {name}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Settings className="w-3 h-3" />
                AI Agent Configuration
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {profileName && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200/50">
              <div className="flex items-center gap-2 mb-1">
                <Bot className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-700 uppercase tracking-wide">Profile</span>
              </div>
              <p className="text-sm font-semibold text-green-800 truncate">{profileName}</p>
            </div>
          )}

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200/50">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">Skills</span>
            </div>
            <p className="text-lg font-bold text-blue-800">{skillCount}</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-200/50">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-700 uppercase tracking-wide">Layers</span>
            </div>
            <p className="text-lg font-bold text-purple-800">{layerCount}</p>
          </div>

          {provider && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-lg border border-orange-200/50">
              <div className="flex items-center gap-2 mb-1">
                <Settings className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-medium text-orange-700 uppercase tracking-wide">Provider</span>
              </div>
              <p className="text-sm font-semibold text-orange-800 truncate">{provider}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200/60">
          <button
            onClick={onLoad}
            className="flex-1 flex items-center justify-center gap-2 btn-primary group/btn"
          >
            <Play className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            Load Agent
          </button>
          <button
            onClick={onDelete}
            className="btn-danger flex items-center justify-center gap-2 group/btn"
          >
            <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
