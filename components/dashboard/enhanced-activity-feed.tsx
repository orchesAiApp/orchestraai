'use client'

import { useState, useEffect, useCallback } from 'react'
import { ActivityLog } from '@/types'
import { Button } from '@/components/ui/button'
import { RefreshCw, Zap, AlertTriangle, CheckCircle } from 'lucide-react'

interface EnhancedActivityFeedProps {
  activities: ActivityLog[]
  isLive?: boolean
  onRefresh?: () => void
}

const severityColors: { [key: string]: string } = {
  info: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  error: 'bg-red-500/20 text-red-300 border-red-500/30',
  success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'error':
      return AlertTriangle
    case 'success':
      return CheckCircle
    case 'warning':
      return AlertTriangle
    default:
      return Zap
  }
}

export default function EnhancedActivityFeed({ activities, isLive = true, onRefresh }: EnhancedActivityFeedProps) {
  const [displayedActivities, setDisplayedActivities] = useState<ActivityLog[]>([])
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!isPaused) {
      setDisplayedActivities(activities)
    }
  }, [activities, isPaused])

  const stats = {
    total: activities.length,
    recent: activities.slice(0, 5).length,
    errors: activities.filter((a) => a.agentRole === 'testing').length,
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">Real-Time Activity Feed</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-accent animate-pulse' : 'bg-muted'}`} />
              {isLive ? 'Live' : 'Paused'}
            </span>
            <span>Total: {stats.total}</span>
            <span className="text-accent">Recent: {stats.recent}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsPaused(!isPaused)}
            variant="outline"
            size="sm"
            className="bg-transparent hover:bg-accent/10 border-border/50"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent hover:bg-accent/10 border-border/50"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: 'Total Activities', value: stats.total, icon: Zap, color: 'from-accent to-cyan-400' },
          { label: 'Recent Updates', value: stats.recent, icon: CheckCircle, color: 'from-emerald-500 to-green-400' },
          { label: 'Issues Detected', value: stats.errors, icon: AlertTriangle, color: 'from-red-500 to-orange-400' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="p-3 rounded-lg border border-border/50 bg-card/50 backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} opacity-20`}>
                  <Icon className="w-4 h-4 text-accent" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {displayedActivities.length === 0 ? (
          <div className="p-6 text-center rounded-lg border border-border/50 bg-card/50 backdrop-blur">
            <p className="text-muted-foreground text-sm">No activities to display</p>
          </div>
        ) : (
          displayedActivities.map((activity, index) => {
            const severity = activity.agentRole === 'testing' ? 'error' : 'success'
            const Icon = getSeverityIcon(severity)

            return (
              <div
                key={`${activity.id}-${index}`}
                className={`p-4 rounded-lg border border-l-4 bg-card/50 backdrop-blur transition-all animate-in fade-in slide-in-from-right-4 duration-500 ${severityColors[severity]}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-medium text-sm">{activity.agentName}</span>
                      <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                    </div>
                    <p className="text-sm text-foreground mb-1">{activity.message}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Duration: {activity.duration}ms</span>
                      <div className="w-16 h-1 bg-muted/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent"
                          style={{ width: `${Math.min((activity.duration / 3000) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
