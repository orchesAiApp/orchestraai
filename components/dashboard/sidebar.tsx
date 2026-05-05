'use client'

import { Agent } from '@/types'
import { Button } from '@/components/ui/button'
import { Settings2, Plus } from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  agents: Agent[]
}

const roleIcons: { [key: string]: string } = {
  research: '🔍',
  writing: '✍️',
  coding: '💻',
  analysis: '📊',
  testing: '🧪',
}

const statusColors: { [key: string]: string } = {
  idle: 'bg-muted text-muted-foreground',
  working: 'bg-accent text-accent-foreground animate-pulse',
  completed: 'bg-emerald-500/30 text-emerald-300',
  error: 'bg-destructive/20 text-destructive',
}

const statusBgColors: { [key: string]: string } = {
  idle: 'bg-card hover:border-accent/30 border-border/30',
  working: 'bg-accent/5 border-accent/40',
  completed: 'bg-emerald-500/5 border-emerald-500/30',
  error: 'bg-destructive/5 border-destructive/30',
}

export default function Sidebar({ agents }: SidebarProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  return (
    <aside className="w-80 border-r border-border/50 bg-gradient-to-b from-card/80 to-card/40 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">Active Agents</h2>
            <div className="space-y-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  className={`p-3 rounded-lg border border-border/40 cursor-pointer transition-all ${
                    statusBgColors[agent.status]
                  } ${selectedAgent === agent.id ? 'ring-1 ring-accent shadow-lg shadow-accent/20' : 'hover:border-accent/50'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">{roleIcons[agent.role] || '🤖'}</span>
                        <h3 className="text-sm font-medium text-foreground truncate">{agent.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${statusColors[agent.status]}`}>
                          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </div>
                      </div>

                      {agent.status === 'working' && (
                        <div className="w-full bg-secondary/30 rounded-full h-1.5 overflow-hidden mb-2">
                          <div
                            className="h-full bg-gradient-to-r from-accent to-cyan-400 transition-all duration-300 shadow-lg shadow-accent/50"
                            style={{ width: `${agent.progress}%` }}
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Tokens: {agent.tokenUsage}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:text-accent hover:bg-accent/10"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <Settings2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border/40" />
    </aside>
  )
}
