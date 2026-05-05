'use client'

import { ActivityLog } from '@/types'
import { Button } from '@/components/ui/button'
import { useEffect, useRef } from 'react'

interface ActivityFeedProps {
  activities: ActivityLog[]
  filter: 'all' | 'errors' | 'completed'
  setFilter: (filter: 'all' | 'errors' | 'completed') => void
}

const roleColors: { [key: string]: string } = {
  research: 'bg-blue-500/20 text-blue-300',
  writing: 'bg-purple-500/20 text-purple-300',
  coding: 'bg-green-500/20 text-green-300',
  analysis: 'bg-yellow-500/20 text-yellow-300',
  testing: 'bg-red-500/20 text-red-300',
}

export default function ActivityFeed({ activities, filter, setFilter }: ActivityFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [activities])

  return (
    <div className="flex-1 border-t border-border bg-card/50 flex flex-col overflow-hidden">
      {/* Header with filters */}
      <div className="border-b border-border p-4 flex items-center justify-between gap-2 flex-shrink-0">
        <h2 className="text-sm font-semibold text-foreground">Activity Feed</h2>
        <div className="flex gap-2">
          {(['all', 'errors', 'completed'] as const).map((filterOption) => (
            <Button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              variant={filter === filterOption ? 'default' : 'outline'}
              size="sm"
              className="text-xs capitalize"
            >
              {filterOption}
            </Button>
          ))}
        </div>
      </div>

      {/* Activity logs */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1 p-4"
      >
        {activities.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-sm">No activities yet. Start a workflow to see logs.</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="p-3 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors text-sm animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${roleColors[activity.agentRole] || 'bg-muted/20'}`}>
                      {activity.agentName}
                    </span>
                  </div>
                  <p className="text-foreground text-sm line-clamp-2">{activity.message}</p>
                  <div className="text-xs text-muted-foreground mt-1">
                    {Math.round(activity.duration)}ms
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
