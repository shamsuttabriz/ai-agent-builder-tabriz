import React from 'react'
import { X, Brain, Sparkles } from 'lucide-react'

interface SelectedItemProps {
  id: string
  name: string
  type: 'skill' | 'layer' | 'profile'
  onRemove: () => void
}

const getItemIcon = (type: 'skill' | 'layer' | 'profile') => {
  switch (type) {
    case 'skill':
      return <Brain className="w-4 h-4" />
    case 'layer':
      return <Sparkles className="w-4 h-4" />
    default:
      return <Brain className="w-4 h-4" />
  }
}

const getItemColors = (type: 'skill' | 'layer' | 'profile') => {
  switch (type) {
    case 'skill':
      return {
        bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: 'text-blue-600',
        remove: 'hover:bg-blue-100',
      }
    case 'layer':
      return {
        bg: 'bg-gradient-to-r from-purple-50 to-pink-50',
        border: 'border-purple-200',
        text: 'text-purple-800',
        icon: 'text-purple-600',
        remove: 'hover:bg-purple-100',
      }
    case 'profile':
      return {
        bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: 'text-green-600',
        remove: 'hover:bg-green-100',
      }
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-800',
        icon: 'text-gray-600',
        remove: 'hover:bg-gray-100',
      }
  }
}

export const SelectedItem: React.FC<SelectedItemProps> = ({ name, type, onRemove }) => {
  const colors = getItemColors(type)
  const itemIcon = getItemIcon(type)

  return (
    <div
      className={`group flex items-center justify-between p-3 rounded-xl border-2 ${colors.bg} ${colors.border} animate-bounce-in transition-all duration-200 hover:shadow-md`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`p-2 rounded-lg bg-white/60 backdrop-blur-sm ${colors.icon}`}>
          {itemIcon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate ${colors.text}`}>{name}</p>
          <p className={`text-xs opacity-75 capitalize ${colors.text}`}>{type}</p>
        </div>
      </div>

      <button
        onClick={onRemove}
        className={`ml-3 p-1.5 rounded-lg transition-all duration-200 ${colors.remove} opacity-60 group-hover:opacity-100 hover:scale-110`}
        aria-label={`Remove ${name}`}
        title={`Remove ${name}`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
