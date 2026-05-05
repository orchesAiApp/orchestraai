'use client'

import { Activity, TrendingUp, Zap, Clock } from 'lucide-react'
import { Agent, Task } from '@/types'

interface MetricsDashboardProps {
  agents: Agent[]
  tasks: Task[]
}

export default function MetricsDashboard({ agents, tasks }: MetricsDashboardProps) {
  const totalTokensUsed = agents.reduce((sum, agent) => sum + agent.tokenUsage, 0)
  const activeAgents = agents.filter((a) => a.status === 'working').length
  const completedTasks = tasks.filter((t) => t.status === 'completed').length
  const averageResponseTime = Math.floor(Math.random() * 500) + 100

  const metrics = [
    {
      label: 'Total Tokens Used',
      value: totalTokensUsed.toLocaleString(),
      icon: Zap,
      color: 'from-accent to-cyan-400',
    },
    {
      label: 'Active Agents',
      value: activeAgents,
      icon: Activity,
      color: 'from-emerald-500 to-green-400',
    },
    {
      label: 'Tasks Completed',
      value: completedTasks,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-400',
    },
    {
      label: 'Avg Response Time',
      value: `${averageResponseTime}ms`,
      icon: Clock,
      color: 'from-orange-500 to-yellow-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <div
            key={metric.label}
            className="p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/20"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">{metric.label}</h3>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.color} opacity-20`}>
                <Icon className="w-4 h-4 text-accent" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-foreground">{metric.value}</span>
              <span className="text-xs text-accent mb-1">+12%</span>
            </div>
            <div className="mt-3 h-1 bg-secondary/20 rounded-full overflow-hidden">
              <div className={`h-full w-3/4 bg-gradient-to-r ${metric.color}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
