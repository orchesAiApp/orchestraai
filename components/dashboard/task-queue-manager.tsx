'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Clock, AlertCircle, CheckCircle, Loader2, Trash2, Edit } from 'lucide-react'
import { Task } from '@/types'

interface TaskQueueManagerProps {
  tasks: Task[]
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask?: (taskId: string) => void
}

interface ScheduledTask extends Task {
  scheduled_for?: string
  repeat_interval?: 'once' | 'daily' | 'weekly' | 'monthly'
}

export default function TaskQueueManager({ tasks, onUpdateTask, onDeleteTask }: TaskQueueManagerProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all')
  const [sortBy, setSortBy] = useState<'priority' | 'time' | 'created'>('priority')
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<ScheduledTask | null>(null)

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true
    return task.status === filter
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 3) - 
             (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 3)
    }
    if (sortBy === 'time') {
      return parseInt(a.estimatedTime) - parseInt(b.estimatedTime)
    }
    return 0
  })

  const statusConfig = {
    pending: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    'in-progress': { icon: Loader2, color: 'text-accent', bg: 'bg-accent/10' },
    completed: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  }

  const priorityConfig = {
    high: 'bg-destructive/20 text-destructive border-destructive/30',
    medium: 'bg-accent/20 text-accent border-accent/30',
    low: 'bg-muted/20 text-muted-foreground border-muted/30',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Task Queue</h2>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-1.5 text-sm bg-secondary/30 border border-border/50 rounded-lg text-foreground hover:border-accent/50 focus:outline-none focus:border-accent"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 text-sm bg-secondary/30 border border-border/50 rounded-lg text-foreground hover:border-accent/50 focus:outline-none focus:border-accent"
          >
            <option value="priority">Sort by Priority</option>
            <option value="time">Sort by Time</option>
            <option value="created">Sort by Created</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {sortedTasks.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-border/50 bg-card/50 backdrop-blur">
            <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-muted-foreground">No tasks in this queue</p>
          </div>
        ) : (
          sortedTasks.map((task) => {
            const status = task.status as keyof typeof statusConfig
            const StatusIcon = statusConfig[status]?.icon || AlertCircle
            const statusColor = statusConfig[status]?.color
            const statusBg = statusConfig[status]?.bg

            return (
              <div
                key={task.id}
                className="p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-2 rounded-lg ${statusBg}`}>
                    <StatusIcon className={`w-4 h-4 ${statusColor} animate-pulse`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-medium text-foreground text-sm">{task.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-semibold border ${priorityConfig[task.priority as keyof typeof priorityConfig]}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Est: {task.estimatedTime}
                      </span>
                      <span className="flex items-center gap-1">
                        Assigned: {task.agent}
                      </span>
                      <span className="px-2 py-1 bg-secondary/30 rounded border border-border/50">
                        {task.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>

                    {/* Progress bar for in-progress tasks */}
                    {status === 'in-progress' && (
                      <div className="mt-2 h-1.5 bg-secondary/30 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-gradient-to-r from-accent to-cyan-400 animate-pulse" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      onClick={() => {
                        setSelectedTask(task as ScheduledTask)
                        setShowScheduleModal(true)
                      }}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-accent/10 hover:text-accent"
                    >
                      <Clock className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => {
                        if (onUpdateTask) {
                          const newStatus = status === 'completed' ? 'pending' : 
                                          status === 'pending' ? 'in-progress' : 'completed'
                          onUpdateTask(task.id, { status: newStatus })
                        }
                      }}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-accent/10 hover:text-accent"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => onDeleteTask?.(task.id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border/50 rounded-lg p-6 max-w-md w-full space-y-4">
            <h3 className="font-semibold text-foreground">Schedule Task</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Scheduled For</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 bg-secondary/30 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-accent"
                  defaultValue={selectedTask.scheduled_for}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Repeat Interval</label>
                <select className="w-full px-3 py-2 bg-secondary/30 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-accent">
                  <option value="once">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setShowScheduleModal(false)}
                variant="outline"
                className="flex-1 bg-transparent hover:bg-accent/10"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowScheduleModal(false)
                  // Handle schedule save
                }}
                className="flex-1 bg-accent hover:bg-accent/90 text-background"
              >
                Schedule
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
