'use client'

import { Agent, Task } from '@/types'
import { Button } from '@/components/ui/button'
import { Check, GripVertical, Plus, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface RightPanelProps {
  tasks: Task[]
  onCompleteTask: (taskId: string) => void
  completedTasks: string[]
  agents: Agent[]
}

export default function RightPanel({
  tasks,
  onCompleteTask,
  completedTasks,
  agents,
}: RightPanelProps) {
  const [tokenCount, setTokenCount] = useState(12450)
  const [avgResponseTime, setAvgResponseTime] = useState(1.2)
  const [successRate, setSuccessRate] = useState(92)

  // Simulate metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTokenCount((prev) => prev + Math.floor(Math.random() * 500))
      setAvgResponseTime((prev) => prev + (Math.random() - 0.5) * 0.2)
      setSuccessRate((prev) => Math.min(99, Math.max(85, prev + (Math.random() - 0.5) * 2)))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const priorityColors: { [key: string]: string } = {
    high: 'bg-red-500/20 text-red-300',
    medium: 'bg-yellow-500/20 text-yellow-300',
    low: 'bg-green-500/20 text-green-300',
  }

  const priorityBorders: { [key: string]: string } = {
    high: 'border-red-500/30',
    medium: 'border-yellow-500/30',
    low: 'border-green-500/30',
  }

  const totalTokensToday = agents.reduce((sum, agent) => sum + agent.tokenUsage, 0)

  return (
    <aside className="w-80 border-l border-border bg-card/50 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {/* Task Queue Section */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Task Queue</h3>
            <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full font-medium">
              {tasks.length}
            </span>
          </div>

          <div className="space-y-2">
            {tasks.length === 0 ? (
              <div className="text-xs text-muted-foreground text-center py-4">
                No pending tasks
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border transition-all ${
                    completedTasks.includes(task.id)
                      ? 'opacity-50'
                      : `border-border/50 bg-secondary/20 hover:bg-secondary/40 ${priorityBorders[task.priority]}`
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 p-0 flex-shrink-0 mt-0.5 cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="w-3 h-3 text-muted-foreground" />
                    </Button>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs font-medium line-clamp-2 ${
                        completedTasks.includes(task.id) ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}>
                        {task.title}
                      </h4>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </div>
                    <Button
                      onClick={() => onCompleteTask(task.id)}
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 p-0 flex-shrink-0"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground ml-7">
                    <span className="truncate">{task.agent}</span>
                    <span>{task.estimatedTime}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <Button
            onClick={() => {}}
            variant="outline"
            size="sm"
            className="w-full mt-3 gap-2 text-xs"
          >
            <Plus className="w-3 h-3" />
            Add Task
          </Button>
        </div>

        {/* Performance Metrics Section */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Performance Metrics</h3>

          <div className="space-y-4">
            {/* Total Tokens */}
            <div className="bg-secondary/20 rounded-lg p-3 border border-border/50">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs text-muted-foreground">Total Tokens Today</span>
                <TrendingUp className="w-3 h-3 text-primary" />
              </div>
              <div className="text-xl font-bold text-primary mb-2">{totalTokensToday.toLocaleString()}</div>
              <div className="flex h-1 bg-secondary/30 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500"
                  style={{ width: `${Math.min(100, (totalTokensToday / 50000) * 100)}%` }}
                />
              </div>
            </div>

            {/* Average Response Time */}
            <div className="bg-secondary/20 rounded-lg p-3 border border-border/50">
              <span className="text-xs text-muted-foreground">Avg Response Time</span>
              <div className="text-2xl font-bold text-accent mt-1">{avgResponseTime.toFixed(2)}s</div>
              <div className="text-xs text-muted-foreground mt-1">Target: &lt;1.5s</div>
            </div>

            {/* Success Rate */}
            <div className="bg-secondary/20 rounded-lg p-3 border border-border/50">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs text-muted-foreground">Success Rate</span>
                <span className="text-xs font-semibold text-green-400">{successRate.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-center mb-2">
                <div className="relative w-24 h-24">
                  <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-secondary/30"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#successGradient)"
                      strokeWidth="8"
                      strokeDasharray={`${(successRate / 100) * 251} 251`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                    <defs>
                      <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-foreground">{Math.round(successRate)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Estimate */}
            <div className="bg-secondary/20 rounded-lg p-3 border border-border/50">
              <span className="text-xs text-muted-foreground">Cost Estimate Today</span>
              <div className="text-2xl font-bold text-amber-400 mt-1">
                ${(totalTokensToday * 0.00002).toFixed(3)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Based on token usage</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
