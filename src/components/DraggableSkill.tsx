import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Brain, Zap, Code, Database, Globe, Cpu, Lightbulb, Target } from 'lucide-react'

interface DraggableSkillProps {
  id: string
  name: string
  category: string
}

const getSkillIcon = (category: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'AI Core': <Brain className="w-4 h-4" />,
    'Programming': <Code className="w-4 h-4" />,
    'Data': <Database className="w-4 h-4" />,
    'Web': <Globe className="w-4 h-4" />,
    'System': <Cpu className="w-4 h-4" />,
    'Creative': <Lightbulb className="w-4 h-4" />,
    'Analytics': <Target className="w-4 h-4" />,
  }
  return iconMap[category] || <Zap className="w-4 h-4" />
}

const getSkillGradient = (category: string) => {
  const gradientMap: Record<string, string> = {
    'AI Core': 'from-blue-500 via-cyan-500 to-teal-500',
    'Programming': 'from-purple-500 via-pink-500 to-rose-500',
    'Data': 'from-green-500 via-emerald-500 to-teal-500',
    'Web': 'from-orange-500 via-red-500 to-pink-500',
    'System': 'from-gray-600 via-slate-600 to-zinc-600',
    'Creative': 'from-yellow-500 via-orange-500 to-red-500',
    'Analytics': 'from-indigo-500 via-purple-500 to-pink-500',
  }
  return gradientMap[category] || 'from-blue-500 to-blue-600'
}

export const DraggableSkill: React.FC<DraggableSkillProps> = ({ id, name, category }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `skill-${id}`,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  const gradientClass = getSkillGradient(category)
  const skillIcon = getSkillIcon(category)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group relative drag-item p-4 bg-gradient-to-br ${gradientClass} text-white rounded-xl cursor-move select-none border-2 border-transparent transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden ${
        isDragging
          ? 'drag-item-active opacity-80 scale-105 shadow-2xl border-white/30 rotate-2'
          : 'hover:scale-105 hover:-translate-y-1 hover:rotate-1'
      }`}
      title={`Drag to add: ${name} (${category})`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            {skillIcon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm truncate leading-tight">{name}</h3>
            <p className="text-xs opacity-90 font-medium">{category}</p>
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
