'use client'

export interface RetryConfig {
  maxAttempts: number
  initialDelayMs: number
  maxDelayMs: number
  backoffMultiplier: number
  shouldRetry?: (error: Error) => boolean
}

export interface ErrorLog {
  id: string
  timestamp: string
  error: string
  stack?: string
  context: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  resolved: boolean
  attemptCount: number
  lastAttemptAt: string
}

export class RetryError extends Error {
  constructor(
    message: string,
    public readonly attempts: number,
    public readonly lastError: Error
  ) {
    super(message)
    this.name = 'RetryError'
  }
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const defaults: RetryConfig = {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
  }

  const finalConfig = { ...defaults, ...config }
  let lastError: Error | null = null
  let delay = finalConfig.initialDelayMs

  for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
    try {
      console.log(`[v0] Attempt ${attempt}/${finalConfig.maxAttempts}`)
      const result = await fn()
      return result
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Check if we should retry this error
      if (finalConfig.shouldRetry && !finalConfig.shouldRetry(lastError)) {
        throw lastError
      }

      // Don't delay on last attempt
      if (attempt < finalConfig.maxAttempts) {
        console.warn(
          `[v0] Attempt ${attempt} failed:`,
          lastError.message,
          `Retrying in ${delay}ms...`
        )
        await sleep(delay)

        // Exponential backoff
        delay = Math.min(
          delay * finalConfig.backoffMultiplier,
          finalConfig.maxDelayMs
        )
      }
    }
  }

  throw new RetryError(
    `Failed after ${finalConfig.maxAttempts} attempts`,
    finalConfig.maxAttempts,
    lastError!
  )
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Circuit breaker pattern for preventing cascading failures
 */
export class CircuitBreaker {
  private failureCount = 0
  private successCount = 0
  private state: 'closed' | 'open' | 'half-open' = 'closed'
  private lastFailureTime: number | null = null

  constructor(
    private readonly failureThreshold: number = 5,
    private readonly successThreshold: number = 2,
    private readonly timeoutMs: number = 60000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (
        this.lastFailureTime &&
        Date.now() - this.lastFailureTime > this.timeoutMs
      ) {
        console.log('[v0] Circuit breaker transitioning to half-open')
        this.state = 'half-open'
        this.successCount = 0
      } else {
        throw new Error('Circuit breaker is open')
      }
    }

    try {
      const result = await fn()

      if (this.state === 'half-open') {
        this.successCount++
        if (this.successCount >= this.successThreshold) {
          console.log('[v0] Circuit breaker transitioning to closed')
          this.state = 'closed'
          this.failureCount = 0
          this.successCount = 0
        }
      } else if (this.state === 'closed') {
        this.failureCount = 0
      }

      return result
    } catch (error) {
      this.failureCount++
      this.lastFailureTime = Date.now()

      if (this.failureCount >= this.failureThreshold) {
        console.warn('[v0] Circuit breaker opening after', this.failureCount, 'failures')
        this.state = 'open'
      }

      throw error
    }
  }

  getState() {
    return this.state
  }

  reset() {
    this.failureCount = 0
    this.successCount = 0
    this.state = 'closed'
    this.lastFailureTime = null
  }
}

/**
 * Error handler with logging
 */
export class ErrorHandler {
  private errorLogs: ErrorLog[] = []

  log(error: Error, context: string, severity: ErrorLog['severity'] = 'medium') {
    const errorLog: ErrorLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      context,
      severity,
      resolved: false,
      attemptCount: 0,
      lastAttemptAt: new Date().toISOString(),
    }

    this.errorLogs.push(errorLog)
    console.error(`[v0] [${severity.toUpperCase()}] ${context}:`, error)

    // Keep only last 50 errors
    if (this.errorLogs.length > 50) {
      this.errorLogs = this.errorLogs.slice(-50)
    }

    return errorLog
  }

  getLogs(filter?: { context?: string; severity?: ErrorLog['severity'] }) {
    return this.errorLogs.filter((log) => {
      if (filter?.context && log.context !== filter.context) return false
      if (filter?.severity && log.severity !== filter.severity) return false
      return true
    })
  }

  markResolved(errorId: string) {
    const log = this.errorLogs.find((l) => l.id === errorId)
    if (log) {
      log.resolved = true
    }
  }

  clear() {
    this.errorLogs = []
  }

  getStats() {
    return {
      total: this.errorLogs.length,
      critical: this.errorLogs.filter((l) => l.severity === 'critical').length,
      high: this.errorLogs.filter((l) => l.severity === 'high').length,
      unresolved: this.errorLogs.filter((l) => !l.resolved).length,
    }
  }
}

// Global error handler instance
export const globalErrorHandler = new ErrorHandler()

/**
 * Handle API errors
 */
export function handleApiError(response: Response, context: string): Error {
  const error = new Error(`API Error: ${response.status} ${response.statusText}`)
  globalErrorHandler.log(error, context, response.status >= 500 ? 'high' : 'medium')
  return error
}
