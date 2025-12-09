'use client'

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import KanbanCard from './KanbanCard'

export interface Task {
  id: string
  title: string
  description: string
  metrics?: string
  progress?: number
  icon?: string
}

export interface Column {
  id: string
  title: string
  tasks: Task[]
}

interface KanbanBoardProps {
  initialColumns: Column[]
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ initialColumns }) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns)

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) return

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    const sourceColumn = columns.find((col) => col.id === source.droppableId)
    const destColumn = columns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(sourceColumn.tasks)
      const [removed] = newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, removed)

      const newColumns = columns.map((col) =>
        col.id === sourceColumn.id ? { ...col, tasks: newTasks } : col
      )
      setColumns(newColumns)
    } else {
      const sourceTasks = Array.from(sourceColumn.tasks)
      const destTasks = Array.from(destColumn.tasks)
      const [removed] = sourceTasks.splice(source.index, 1)
      destTasks.splice(destination.index, 0, removed)

      const newColumns = columns.map((col) => {
        if (col.id === sourceColumn.id) return { ...col, tasks: sourceTasks }
        if (col.id === destColumn.id) return { ...col, tasks: destTasks }
        return col
      })
      setColumns(newColumns)
    }
  }

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      {/* Iridescent background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-amber-500/20 to-purple-600/20 animate-gradient"></div>

      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* Board header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
            DIGITAL MARKETING OPERATIONS BOARD A
          </h1>
          <p className="text-white/80 text-lg">
            Organize the Present. Navigate the Horizon.
          </p>
        </div>

        {/* Kanban board with glass effect */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-emerald-400/10 via-amber-400/10 to-purple-500/10 rounded-3xl border border-white/20 shadow-2xl p-6">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-5 gap-4">
              {columns.map((column) => (
                <Droppable key={column.id} droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`backdrop-blur-md bg-white/5 rounded-2xl border border-white/20 p-4 min-h-[600px] transition-all ${
                        snapshot.isDraggingOver ? 'bg-white/10 border-white/40' : ''
                      }`}
                    >
                      <h2 className="text-white font-semibold text-lg mb-4 uppercase tracking-wider text-center">
                        {column.title}
                      </h2>
                      <div className="space-y-3">
                        {column.tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <KanbanCard task={task} isDragging={snapshot.isDragging} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-gradient {
          animation: gradient 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default KanbanBoard
