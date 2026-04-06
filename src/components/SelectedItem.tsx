import React from 'react'

interface SelectedItemProps {
  id: string
  name: string
  type: 'skill' | 'layer' | 'profile'
  onRemove: () => void
}

export const SelectedItem: React.FC<SelectedItemProps> = ({ name, type, onRemove }) => {
  const colorClasses = {
    skill: 'bg-blue-100 text-blue-800 border-blue-200',
    layer: 'bg-purple-100 text-purple-800 border-purple-200',
    profile: 'bg-green-100 text-green-800 border-green-200',
  }

  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-lg border ${colorClasses[type]} animate-bounce-in`}
    >
      <div className="flex-1">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs opacity-75 capitalize">{type}</p>
      </div>
      <button
        onClick={onRemove}
        className="ml-2 text-lg hover:opacity-70 transition-opacity"
        aria-label="Remove item"
      >
        ✕
      </button>
    </div>
  )
}
