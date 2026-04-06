import React from 'react'
import { useDroppable } from '@dnd-kit/core'

interface DroppableZoneProps {
  id: string
  title: string
  children: React.ReactNode
  isEmpty: boolean
  className?: string
}

export const DroppableZone: React.FC<DroppableZoneProps> = ({
  id,
  title,
  children,
  isEmpty,
  className = '',
}) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id,
  })

  const isDropActive = isOver && active?.id

  return (
    <div className={`${className} rounded-lg transition-all duration-200`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
      <div
        ref={setNodeRef}
        className={`drop-zone min-h-[150px] p-4 ${
          isDropActive ? 'drop-zone-active' : 'border-gray-300 bg-gray-50'
        } ${isEmpty ? 'flex items-center justify-center' : ''}`}
      >
        {isEmpty && !isDropActive ? (
          <div className="text-center text-gray-400">
            <svg
              className="w-10 h-10 mx-auto mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p className="text-sm">Drag items here</p>
          </div>
        ) : (
          <div className="w-full space-y-2">{children}</div>
        )}
      </div>
    </div>
  )
}
