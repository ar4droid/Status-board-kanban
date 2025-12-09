'use client'

import React from 'react'
import { Task } from './KanbanBoard'

interface KanbanCardProps {
  task: Task
  isDragging: boolean
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task, isDragging }) => {
  return (
    <div
      className={`backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-4 cursor-grab active:cursor-grabbing transition-all hover:bg-white/15 hover:border-white/30 ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-white font-medium text-sm">{task.title}</h3>
        {task.icon && (
          <span className="text-xl">{task.icon}</span>
        )}
      </div>

      {task.description && (
        <p className="text-white/70 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Metrics visualization */}
      {task.metrics && (
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-12 bg-gradient-to-r from-emerald-500/20 to-purple-500/20 rounded-lg border border-white/10 flex items-end justify-around px-2 py-1">
              {/* Simple bar chart representation */}
              {[0.3, 0.5, 0.7, 0.4, 0.8].map((height, i) => (
                <div
                  key={i}
                  className="w-2 bg-gradient-to-t from-emerald-400 to-purple-400 rounded-sm"
                  style={{ height: `${height * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {task.progress !== undefined && (
        <div className="mb-3">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-purple-400 rounded-full transition-all"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer icons */}
      <div className="flex items-center gap-2 text-white/50 text-xs">
        <div className="flex items-center gap-1">
          <span>👁️</span>
          <span>{Math.floor(Math.random() * 100)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>💬</span>
          <span>{Math.floor(Math.random() * 20)}</span>
        </div>
        <div className="ml-auto text-white/40">
          {task.metrics || '80%'}
        </div>
      </div>
    </div>
  )
}

export default KanbanCard
