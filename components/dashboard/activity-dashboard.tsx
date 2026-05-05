'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { Agent, Task } from '@/types'
import { Activity, CheckCircle, AlertCircle, Clock, Zap, TrendingUp } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ActivityItem {
  id: string
  type: 'workflow_started' | 'workflow_completed' | 'task_completed' | 'error' | 'agent_executed'
  title: string
  description: string
  timestamp: string
  status: 'success' | 'error' | 'pending'
  icon: React.ReactNode
}

interface DashboardMetrics {
  totalWorkflowsRun: number
  successRate: number
  averageExecutionTime: number
  activeAgents: number
  tasksCompleted: number
  errorsDetected: number
  trendData: Array<{
    time: string
    executions: number
    errors: number
  }>
}

interface ActivityDashboardProps {
  agents: Agent[]
  tasks: Task[]
}

export default function ActivityDashboard({ agents, tasks }: ActivityDashboardProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalWorkflowsRun: 0,
    successRate: 0,
    averageExecutionTime: 0,
    activeAgents: 0,
    tasksCompleted: 0,
    errorsDetected: 0,
    trendData: generateMockTrendData(),
  })
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Generate mock trend data
  function generateMockTrendData() {
    const data = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setHours(date.getHours() - i)
      data.push({
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        executions: Math.floor(Math.random() * 10) + 5,
        errors: Math.floor(Math.random() * 3),
      })
    }
    return data
  }

  // Simulate activity updates
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      const statuses: Array<'success' | 'error' | 'pending'> = ['success', 'error', 'pending']
      const types: Array<ActivityItem['type']> = [
        'workflow_started',
        'workflow_completed',
        'task_completed',
        'agent_executed',
      ]

      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: types[Math.floor(Math.random() * types.length)],
        title: `Activity ${Math.floor(Math.random() * 100)}`,
        description: 'Workflow execution activity',
        timestamp: new Date().toLocaleTimeString(),
        status: statuses[Math.floor(Math.random() * 3)],
        icon: <Activity className="w-4 h-4" />,
      }

      setActivities((prev) => [newActivity, ...prev.slice(0, 9)])

      // Update metrics
      setMetrics((prev) => ({
        ...prev,
        totalWorkflowsRun: prev.totalWorkflowsRun + 1,
        successRate: Math.round(Math.random() * 100),
        averageExecutionTime: Math.round(Math.random() * 5000) / 100,
        activeAgents: agents.filter((a) => a.status === 'working').length,
        tasksCompleted: prev.tasksCompleted + Math.floor(Math.random() * 3),
        errorsDetected: newActivity.status === 'error' ? prev.errorsDetected + 1 : prev.errorsDetected,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh, agents])

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'workflow_started':
        return <Clock className="w-4 h-4 text-accent" />
      case 'workflow_completed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />
      case 'agent_executed':
        return <Zap className="w-4 h-4 text-cyan-400" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-accent/5 via-background to-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Activity Dashboard</h2>
          <p className="text-xs text-muted-foreground">Real-time workflow and agent metrics</p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-muted-foreground">Auto-refresh</span>
        </label>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <MetricCard
            label="Workflows Run"
            value={metrics.totalWorkflowsRun}
            suffix="total"
            icon={<TrendingUp className="w-4 h-4" />}
            color="accent"
          />
          <MetricCard
            label="Success Rate"
            value={metrics.successRate}
            suffix="%"
            icon={<CheckCircle className="w-4 h-4" />}
            color="emerald"
          />
          <MetricCard
            label="Active Agents"
            value={metrics.activeAgents}
            suffix={`/${agents.length}`}
            icon={<Zap className="w-4 h-4" />}
            color="cyan"
          />
          <MetricCard
            label="Tasks Completed"
            value={metrics.tasksCompleted}
            suffix="tasks"
            icon={<CheckCircle className="w-4 h-4" />}
            color="lime"
          />
          <MetricCard
            label="Errors Detected"
            value={metrics.errorsDetected}
            suffix="errors"
            icon={<AlertCircle className="w-4 h-4" />}
            color="red"
          />
          <MetricCard
            label="Avg Execution Time"
            value={metrics.averageExecutionTime}
            suffix="ms"
            icon={<Clock className="w-4 h-4" />}
            color="orange"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Execution Trend */}
          <div className="border border-border/50 rounded-lg bg-card/50 backdrop-blur p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Execution Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={metrics.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10,14,26,0.8)',
                    border: '1px solid rgba(0,212,255,0.2)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="executions"
                  stroke="#00d4ff"
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Error Trend */}
          <div className="border border-border/50 rounded-lg bg-card/50 backdrop-blur p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Error Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={metrics.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,85,85,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10,14,26,0.8)',
                    border: '1px solid rgba(255,85,85,0.2)',
                  }}
                />
                <Bar dataKey="errors" fill="#ff5555" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="border border-border/50 rounded-lg bg-card/50 backdrop-blur p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Recent Activities</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {activities.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No activities yet</p>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-2 rounded bg-secondary/20 border border-border/30 hover:border-border/50 transition-all"
                >
                  <div className="mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full mt-1 ${
                      activity.status === 'success'
                        ? 'bg-emerald-400'
                        : activity.status === 'error'
                          ? 'bg-destructive'
                          : 'bg-accent animate-pulse'
                    }`}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: number
  suffix: string
  icon: React.ReactNode
  color: 'accent' | 'emerald' | 'cyan' | 'lime' | 'red' | 'orange'
}

function MetricCard({ label, value, suffix, icon, color }: MetricCardProps) {
  const colorClasses: { [key: string]: string } = {
    accent: 'border-accent/50 bg-accent/10 text-accent',
    emerald: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
    cyan: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400',
    lime: 'border-lime-500/50 bg-lime-500/10 text-lime-400',
    red: 'border-destructive/50 bg-destructive/10 text-destructive',
    orange: 'border-orange-500/50 bg-orange-500/10 text-orange-400',
  }

  return (
    <div className={`border rounded-lg p-3 bg-card/50 backdrop-blur ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium opacity-75">{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold">
        {value}
        <span className="text-sm opacity-75 ml-1">{suffix}</span>
      </p>
    </div>
  )
}
