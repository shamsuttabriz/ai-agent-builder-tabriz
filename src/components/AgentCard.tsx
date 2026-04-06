import React from 'react'

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
    <div className="card-hover p-4 bg-white rounded-xl border border-cyan-200 shadow-sm hover:shadow-md">
      <h3 className="text-lg font-bold text-cyan-700 mb-3">{name}</h3>

      <div className="space-y-2 mb-4 text-sm">
        {profileName && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600">Profile:</span>
            <span className="badge badge-blue">{profileName}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-600">Skills:</span>
          <span className="badge badge-green font-semibold">{skillCount}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-600">Layers:</span>
          <span className="badge badge-purple font-semibold">{layerCount}</span>
        </div>

        {provider && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600">Provider:</span>
            <span className="badge">{provider}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-3 border-t border-gray-200">
        <button
          onClick={onLoad}
          className="flex-1 btn-primary text-sm py-2"
        >
          Load
        </button>
        <button
          onClick={onDelete}
          className="btn-danger py-2"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
