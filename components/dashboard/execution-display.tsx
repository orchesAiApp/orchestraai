'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface ExecutionDisplayProps {
  workflowId: string
  workflowName: string
  onExecutionStart?: () => void
  onExecutionComplete?: () => void
}

interface ExecutionStatus {
  id: string
  status: 'running' | 'completed' | 'failed' | 'paused'
  startedAt: string
  endedAt?: string
  duration?: number
  progress?: number
}

export default function ExecutionDisplay({
  workflowId,
  workflowName,
  onExecutionStart,
  onExecutionComplete,
}: ExecutionDisplayProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [executionStatus, setExecutionStatus] = useState<ExecutionStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  // Update elapsed time while running
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  const handleRunWorkflow = async () => {
    try {
      setIsRunning(true)
      setError(null)
      setElapsedTime(0)
      console.log('[v0] Running workflow:', workflowId)

      const response = await fetch('/api/executions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId }),
      })

      if (!response.ok) throw new Error('Failed to start workflow')

      const data = await response.json()
      console.log('[v0] Execution started:', data.executionId)

      setExecutionStatus({
        id: data.executionId,
        status: 'running',
        startedAt: new Date().toISOString(),
        progress: 10,
      })

      onExecutionStart?.()

      // Poll for execution status
      pollExecutionStatus(data.executionId)
    } catch (err: any) {
      console.error('[v0] Error running workflow:', err)
      setError(err.message || 'Failed to run workflow')
      setIsRunning(false)
    }
  }

  const pollExecutionStatus = async (executionId: string) => {
    const maxAttempts = 60
    let attempts = 0

    const poll = async () => {
      try {
        const response = await fetch(`/api/executions/${executionId}`)
        if (!response.ok) throw new Error('Failed to fetch status')

        const data = await response.json()
        console.log('[v0] Execution status:', data.status)

        // Calculate progress based on execution status
        const progress =
          data.status === 'completed'
            ? 100
            : data.status === 'failed'
              ? 100
              : Math.min(90, 10 + attempts * 1.3)

        setExecutionStatus({
          ...data,
          progress,
        })

        if (data.status === 'completed' || data.status === 'failed') {
          setIsRunning(false)
          setElapsedTime(0)
          onExecutionComplete?.()
        } else if (attempts < maxAttempts) {
          attempts++
          setTimeout(poll, 2000)
        } else {
          setIsRunning(false)
          setError('Execution timeout')
        }
      } catch (err) {
        console.error('[v0] Error polling status:', err)
        setIsRunning(false)
      }
    }

    poll()
  }

  const getStatusIcon = () => {
    if (!executionStatus) return null
    switch (executionStatus.status) {
      case 'running':
        return <Loader2 className="w-4 h-4 text-accent animate-spin" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    if (!executionStatus) return 'Not run'
    switch (executionStatus.status) {
      case 'running':
        return `Running... ${elapsedTime}s`
      case 'completed':
        return 'Completed'
      case 'failed':
        return 'Failed'
      default:
        return executionStatus.status
    }
  }

  const progress = executionStatus?.progress || 0

  return (
    <div className="p-4 border border-border/50 rounded-lg bg-card/50 backdrop-blur space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm text-foreground">{workflowName}</h3>
          <p className="text-xs text-muted-foreground">Execution Status</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-xs text-muted-foreground font-medium">{getStatusText()}</span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400 animate-pulse">
          {error}
        </div>
      )}

      {/* Progress bar */}
      {isRunning && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-accent">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-secondary/30 rounded-full overflow-hidden border border-border/30">
            <div
              className="h-full bg-gradient-to-r from-accent via-cyan-400 to-accent animate-pulse rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Animated dots for visual feedback */}
          <div className="flex items-center justify-center gap-1 py-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-accent/60"
                style={{
                  animation: `pulse 1.5s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleRunWorkflow}
          disabled={isRunning}
          size="sm"
          className="flex-1 gap-2 bg-accent hover:bg-accent/90 text-background font-semibold disabled:opacity-50 transition-all"
        >
          <Play className="w-3 h-3" />
          Run
        </Button>
        <Button
          onClick={() => {
            setIsRunning(false)
            setExecutionStatus((prev) => (prev ? { ...prev, status: 'paused' } : null))
          }}
          disabled={!isRunning}
          size="sm"
          variant="outline"
          className="gap-2 bg-transparent hover:bg-accent/10 border-border/50 disabled:opacity-50 transition-all"
        >
          <Pause className="w-3 h-3" />
          Stop
        </Button>
      </div>

      {/* Execution info */}
      {executionStatus && (
        <div className="pt-2 border-t border-border/30 space-y-2">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Started:</span>
              <span className="text-foreground">
                {new Date(executionStatus.startedAt).toLocaleTimeString()}
              </span>
            </div>
            {isRunning && (
              <div className="flex justify-between">
                <span>Elapsed:</span>
                <span className="text-accent font-medium">{elapsedTime}s</span>
              </div>
            )}
            {executionStatus.duration && (
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="text-emerald-400 font-medium">
                  {(executionStatus.duration / 1000).toFixed(2)}s
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status indicator */}
      <div className="flex items-center gap-2 text-xs">
        <div
          className={`w-2 h-2 rounded-full ${
            isRunning
              ? 'bg-amber-400 animate-pulse'
              : executionStatus?.status === 'completed'
                ? 'bg-emerald-400'
                : executionStatus?.status === 'failed'
                  ? 'bg-red-400'
                  : 'bg-muted-foreground'
          }`}
        />
        <span className="text-muted-foreground capitalize">
          {executionStatus?.status || 'idle'}
        </span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
