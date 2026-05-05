export interface Agent {
  id: string
  name: string
  role: string
  status: 'idle' | 'working' | 'completed' | 'error'
  tokenUsage: number
  progress: number
}

export interface Task {
  id: string
  title: string
  agent: string
  priority: 'high' | 'medium' | 'low'
  estimatedTime: string
  status: 'pending' | 'completed'
}

export interface ActivityLog {
  id: string
  timestamp: string
  agentName: string
  agentRole: string
  message: string
  duration: number
}
