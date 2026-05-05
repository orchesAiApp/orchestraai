'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Clock, RotateCcw, ChevronDown, ChevronUp, User } from 'lucide-react'

interface WorkflowVersion {
  id: string
  workflow_id: string
  version_number: number
  name: string
  description: string
  created_by: string
  created_at: string
  change_summary: string
}

interface WorkflowHistoryProps {
  workflowId: string
  onRestore?: (versionId: string) => void
}

export default function WorkflowHistory({
  workflowId,
  onRestore,
}: WorkflowHistoryProps) {
  const [versions, setVersions] = useState<WorkflowVersion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedVersionId, setExpandedVersionId] = useState<string | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)

  useEffect(() => {
    loadVersions()
  }, [workflowId])

  const loadVersions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/workflows/${workflowId}/versions`)
      if (!response.ok) throw new Error('Failed to load versions')

      const data = await response.json()
      console.log('[v0] Loaded versions:', data.length)
      setVersions(data)
    } catch (error) {
      console.error('[v0] Error loading versions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestore = async (versionId: string, versionNumber: number) => {
    if (!confirm(`Restore to version ${versionNumber}?`)) return

    try {
      setIsRestoring(true)
      const response = await fetch(
        `/api/workflows/${workflowId}/versions/${versionId}/restore`,
        { method: 'POST' }
      )

      if (!response.ok) throw new Error('Failed to restore version')

      console.log('[v0] Version restored:', versionNumber)
      onRestore?.(versionId)
      await loadVersions()
    } catch (error) {
      console.error('[v0] Error restoring version:', error)
      alert('Failed to restore version')
    } finally {
      setIsRestoring(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-muted-foreground text-sm">Loading history...</p>
      </div>
    )
  }

  if (versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <Clock className="w-8 h-8 text-muted-foreground/50 mb-2" />
        <p className="text-muted-foreground text-sm">No version history yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50">
        <Clock className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold text-foreground">Version History</h3>
        <span className="ml-auto text-xs text-muted-foreground">{versions.length} versions</span>
      </div>

      <div className="space-y-1 max-h-96 overflow-y-auto">
        {versions.map((version, idx) => {
          const isExpanded = expandedVersionId === version.id
          const isLatest = idx === 0

          return (
            <div
              key={version.id}
              className={`border rounded-lg transition-all ${
                isLatest
                  ? 'border-accent/50 bg-accent/10'
                  : 'border-border/30 bg-secondary/20 hover:border-border/50'
              }`}
            >
              <button
                onClick={() =>
                  setExpandedVersionId(isExpanded ? null : version.id)
                }
                className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-black/20 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      v{version.version_number}
                    </span>
                    {isLatest && (
                      <span className="text-xs px-2 py-0.5 rounded bg-accent/20 text-accent border border-accent/50">
                        Latest
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {version.change_summary}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <div className="px-3 py-2 border-t border-border/30 bg-black/20 space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Created</p>
                    <p className="text-xs text-foreground">
                      {new Date(version.created_at).toLocaleString()}
                    </p>
                  </div>

                  {version.description && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Description</p>
                      <p className="text-xs text-foreground">{version.description}</p>
                    </div>
                  )}

                  <div className="pt-2 flex gap-2">
                    <Button
                      onClick={() =>
                        handleRestore(version.id, version.version_number)
                      }
                      disabled={isLatest || isRestoring}
                      size="sm"
                      className="flex-1 gap-2 bg-accent hover:bg-accent/90 text-background"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restore
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
