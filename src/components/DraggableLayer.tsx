import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Heart, Shield, Sparkles, Users, MessageCircle, Eye, Mic, Palette } from 'lucide-react'

interface DraggableLayerProps {
  id: string
  name: string
  type: string
}

const getLayerIcon = (type: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Empathy': <Heart className="w-4 h-4" />,
    'Security': <Shield className="w-4 h-4" />,
    'Creativity': <Sparkles className="w-4 h-4" />,
    'Social': <Users className="w-4 h-4" />,
    'Communication': <MessageCircle className="w-4 h-4" />,
    'Observation': <Eye className="w-4 h-4" />,
    'Voice': <Mic className="w-4 h-4" />,
    'Personality': <Palette className="w-4 h-4" />,
  }
  return iconMap[type] || <Sparkles className="w-4 h-4" />
}

const getLayerGradient = (type: string) => {
  const gradientMap: Record<string, string> = {
    'Empathy': 'from-pink-500 via-rose-500 to-red-500',
    'Security': 'from-red-500 via-orange-500 to-yellow-500',
    'Creativity': 'from-purple-500 via-violet-500 to-fuchsia-500',
    'Social': 'from-green-500 via-teal-500 to-cyan-500',
    'Communication': 'from-blue-500 via-indigo-500 to-purple-500',
    'Observation': 'from-slate-500 via-gray-500 to-zinc-500',
    'Voice': 'from-amber-500 via-orange-500 to-red-500',
    'Personality': 'from-emerald-500 via-green-500 to-teal-500',
  }
  return gradientMap[type] || 'from-purple-500 to-pink-500'
}

export const DraggableLayer: React.FC<DraggableLayerProps> = ({ id, name, type }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `layer-${id}`,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  const gradientClass = getLayerGradient(type)
  const layerIcon = getLayerIcon(type)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group relative drag-item p-4 bg-gradient-to-br ${gradientClass} text-white rounded-xl cursor-move select-none border-2 border-transparent transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden ${
        isDragging
          ? 'drag-item-active opacity-80 scale-105 shadow-2xl border-white/30 -rotate-2'
          : 'hover:scale-105 hover:-translate-y-1 hover:-rotate-1'
      }`}
      title={`Drag to add: ${name} (${type})`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            {layerIcon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm truncate leading-tight">{name}</h3>
            <p className="text-xs opacity-90 font-medium">{type}</p>
          </div>
        </div>

        {/* Drag indicator */}
        <div className="flex justify-center opacity-60 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  )
}
