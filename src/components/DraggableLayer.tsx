import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

interface DraggableLayerProps {
  id: string
  name: string
  type: string
}

export const DraggableLayer: React.FC<DraggableLayerProps> = ({ id, name, type }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `layer-${id}`,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`drag-item p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg cursor-move select-none border-2 border-transparent transition-all ${
        isDragging
          ? 'drag-item-active opacity-50 scale-95 shadow-lg border-purple-400'
          : 'shadow-md hover:shadow-lg hover:-translate-y-0.5'
      }`}
    >
      <div className="font-semibold text-sm">{name}</div>
      <div className="text-xs opacity-90 mt-0.5">{type}</div>
    </div>
  )
}
