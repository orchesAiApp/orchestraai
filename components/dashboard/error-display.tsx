'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, X, ChevronDown, ChevronUp } from 'lucide-react'
import { ErrorLog, globalErrorHandler } from '@/lib/error-handling'

export default function ErrorDisplay() {
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedError, setSelectedError] = useState<string | null>(null)

  useEffect(() => {
    const updateErrors = () => {
      const logs = globalErrorHandler.getLogs({ resolved: false })
      setErrors(logs)
    }

    updateErrors()
    const interval = setInterval(updateErrors, 1000)
    return () => clearInterval(interval)
  }, [])

  if (errors.length === 0) return null

  const criticalErrors = errors.filter((e) => e.severity === 'critical')
  const hasUnresolved = errors.length > 0

  return (
    <div className="fixed bottom-4 right-4 z-40 space-y-2">
      {/* Minimized notification */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/90 hover:bg-destructive border border-destructive/50 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{errors.length} Error(s)</span>
          <ChevronUp className="w-4 h-4 ml-auto" />
        </button>
      )}

      {/* Expanded view */}
      {isExpanded && (
        <div className="bg-card border border-border/50 rounded-lg shadow-lg backdrop-blur max-w-md w-screen sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-destructive/10">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="font-semibold text-destructive">
                {errors.length} Error{errors.length !== 1 ? 's' : ''}
              </span>
            </div>
            <Button
              onClick={() => setIsExpanded(false)}
              size="icon"
              variant="ghost"
              className="hover:bg-destructive/20 h-8 w-8"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Error List */}
          <div className="max-h-96 overflow-y-auto">
            {errors.map((error, idx) => (
              <div
                key={error.id}
                className={`p-3 border-b border-border/30 last:border-b-0 cursor-pointer hover:bg-secondary/20 transition-colors ${
                  selectedError === error.id ? 'bg-secondary/30' : ''
                }`}
                onClick={() =>
                  setSelectedError(selectedError === error.id ? null : error.id)
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      error.severity === 'critical'
                        ? 'bg-destructive'
                        : error.severity === 'high'
                          ? 'bg-orange-500'
                          : 'bg-yellow-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {error.context}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {error.error}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(error.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {/* Expanded error details */}
                {selectedError === error.id && (
                  <div className="mt-3 p-2 bg-secondary/20 rounded border border-border/30 text-xs">
                    <pre className="text-foreground/80 whitespace-pre-wrap break-words font-mono">
                      {error.stack || error.error}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer with actions */}
          <div className="p-3 border-t border-border/50 bg-secondary/10 flex gap-2">
            <Button
              onClick={() => {
                errors.forEach((e) => globalErrorHandler.markResolved(e.id))
                setErrors([])
              }}
              size="sm"
              variant="outline"
              className="flex-1 bg-transparent hover:bg-accent/10 border-border/50"
            >
              Dismiss All
            </Button>
            <Button
              onClick={() => globalErrorHandler.clear()}
              size="sm"
              variant="outline"
              className="flex-1 bg-transparent hover:bg-destructive/10 border-border/50"
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
