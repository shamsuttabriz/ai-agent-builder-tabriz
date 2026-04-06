import React from 'react'

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <span className="text-sm text-gray-600 ml-2">Loading...</span>
    </div>
  )
}
