'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import WorkflowCanvas from './workflow-canvas'
import ExecutionDisplay from './execution-display'
import TemplatePicker from './template-picker'
import { Agent } from '@/types'

interface Workflow {
  id: string
  name: string
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived'
  nodes: any[]
  connections: any[]
  created_at: string
  updated_at: string
}

interface WorkflowManagerProps {
  agents: Agent[]
}

export default function WorkflowManager({ agents }: WorkflowManagerProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)

  // Helper function to parse workflow data from API
  const parseWorkflow = (data: any): Workflow => {
    return {
      id: data.id,
      name: data.name,
      status: data.status,
      nodes: typeof data.nodes === 'string' ? JSON.parse(data.nodes || '[]') : (data.nodes || []),
      connections: typeof data.connections === 'string' ? JSON.parse(data.connections || '[]') : (data.connections || []),
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }

  // Load workflows from database
  useEffect(() => {
    const loadWorkflows = async () => {
      try {
        console.log('[v0] Loading workflows...')
        const response = await fetch('/api/workflows')
        if (!response.ok) throw new Error('Failed to load workflows')
        const data = await response.json()
        console.log('[v0] Workflows loaded:', data.length)
        const parsedWorkflows = data.map(parseWorkflow)
        setWorkflows(parsedWorkflows)
        if (parsedWorkflows.length > 0) {
          setActiveWorkflowId(parsedWorkflows[0].id)
        }
      } catch (error) {
        console.error('[v0] Error loading workflows:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadWorkflows()
  }, [])

  const activeWorkflow = workflows.find((w) => w.id === activeWorkflowId)

  const handleCreateWorkflow = async () => {
    const name = prompt('Enter workflow name:', 'New Workflow')
    if (!name) return

    try {
      setIsSaving(true)
      console.log('[v0] Creating new workflow:', name)
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description: '',
          status: 'draft',
          nodes: [],
          connections: [],
        }),
      })

      const responseData = await response.json()
      
      if (!response.ok) {
        const errorMessage = responseData.error || 'Failed to create workflow'
        console.error('[v0] API error response:', errorMessage)
        throw new Error(errorMessage)
      }
      
      const newWorkflow = parseWorkflow(responseData)
      console.log('[v0] Workflow created:', newWorkflow)
      setWorkflows([newWorkflow, ...workflows])
      setActiveWorkflowId(newWorkflow.id)
    } catch (error: any) {
      console.error('[v0] Error creating workflow:', error.message)
      alert(`Failed to create workflow: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUseTemplate = async (templateName: string, nodes: any[], connections: any[]) => {
    try {
      setIsSaving(true)
      console.log('[v0] Creating workflow from template:', templateName)
      
      const workflowName = `${templateName} - ${new Date().toLocaleTimeString()}`
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: workflowName,
          description: `Created from template: ${templateName}`,
          status: 'draft',
          nodes,
          connections,
        }),
      })

      const responseData = await response.json()
      
      if (!response.ok) throw new Error(responseData.error || 'Failed to create workflow')
      
      const newWorkflow = parseWorkflow(responseData)
      console.log('[v0] Workflow created from template:', newWorkflow)
      setWorkflows([newWorkflow, ...workflows])
      setActiveWorkflowId(newWorkflow.id)
      setShowTemplatePicker(false)
    } catch (error: any) {
      console.error('[v0] Error creating workflow from template:', error.message)
      alert(`Failed to create workflow: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveWorkflow = async (updatedWorkflow: Workflow) => {
    try {
      setIsSaving(true)
      console.log('[v0] Saving workflow:', updatedWorkflow.id)
      const response = await fetch('/api/workflows', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedWorkflow),
      })

      if (!response.ok) throw new Error('Failed to save workflow')
      const saved = parseWorkflow(await response.json())
      console.log('[v0] Workflow saved')
      setWorkflows(workflows.map((w) => (w.id === saved.id ? saved : w)))
    } catch (error) {
      console.error('[v0] Error saving workflow:', error)
      alert('Failed to save workflow')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return

    try {
      console.log('[v0] Deleting workflow:', workflowId)
      const response = await fetch(`/api/workflows?id=${workflowId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete workflow')
      console.log('[v0] Workflow deleted')
      const updated = workflows.filter((w) => w.id !== workflowId)
      setWorkflows(updated)
      if (activeWorkflowId === workflowId) {
        setActiveWorkflowId(updated.length > 0 ? updated[0].id : null)
      }
    } catch (error) {
      console.error('[v0] Error deleting workflow:', error)
      alert('Failed to delete workflow')
    }
  }

  const handleRunWorkflow = async (workflowId: string) => {
    console.log('[v0] Running workflow:', workflowId)
    try {
      const response = await fetch('/api/executions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId }),
      })

      if (!response.ok) throw new Error('Failed to start workflow')
      console.log('[v0] Workflow execution started')
    } catch (error: any) {
      console.error('[v0] Error running workflow:', error)
      alert(`Failed to run workflow: ${error.message}`)
    }
  }

  const handlePauseWorkflow = (workflowId: string) => {
    console.log('[v0] Pausing workflow:', workflowId)
    setWorkflows(
      workflows.map((w) => (w.id === workflowId ? { ...w, status: 'paused' } : w))
    )
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Loading workflows...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Workflow Tabs */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur overflow-x-auto">
        <div className="flex items-center gap-2 p-2 min-w-min">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all cursor-pointer group ${
                activeWorkflowId === workflow.id
                  ? 'border-accent bg-accent/10 shadow-lg shadow-accent/20'
                  : 'border-border/50 bg-card/30 hover:border-accent/50'
              }`}
              onClick={() => setActiveWorkflowId(workflow.id)}
            >
              <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                {workflow.name}
              </span>
              <div className="flex items-center gap-1">
                {workflow.status === 'running' && (
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteWorkflow(workflow.id)
                }}
                className="p-1 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 rounded transition-all"
              >
                <X className="w-3 h-3 text-destructive" />
              </button>
            </div>
          ))}

          <Button
            onClick={handleCreateWorkflow}
            disabled={isSaving}
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent hover:bg-accent/10 border-border/50 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New Workflow
          </Button>
        </div>
      </div>

      <TemplatePicker
        agents={agents}
        isOpen={showTemplatePicker}
        onClose={() => setShowTemplatePicker(false)}
        onSelectTemplate={handleUseTemplate}
      />

      {/* Workflow Controls */}
      {activeWorkflow && (
        <div className="border-b border-border/50 bg-card/30 backdrop-blur px-4 py-2 flex items-center gap-2">
          <Button
            onClick={() => handleRunWorkflow(activeWorkflow.id)}
            disabled={activeWorkflow.status === 'running'}
            size="sm"
            className="gap-2 bg-accent hover:bg-accent/90 text-background"
          >
            <Play className="w-4 h-4" />
            Run
          </Button>
          <Button
            onClick={() => handlePauseWorkflow(activeWorkflow.id)}
            disabled={activeWorkflow.status !== 'running'}
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent hover:bg-accent/10 border-border/50"
          >
            <Pause className="w-4 h-4" />
            Pause
          </Button>
          <div className="flex-1" />
          <span className="text-xs text-muted-foreground">
            Status: <span className="font-medium text-foreground capitalize">{activeWorkflow.status}</span>
          </span>
        </div>
      )}

      {/* Canvas */}
      {activeWorkflow ? (
        <WorkflowCanvas
          key={activeWorkflow.id}
          agents={agents}
          initialWorkflow={activeWorkflow}
          onSave={handleSaveWorkflow}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">No workflows yet</p>
          <Button onClick={handleCreateWorkflow} className="gap-2 bg-accent hover:bg-accent/90">
            <Plus className="w-4 h-4" />
            Create First Workflow
          </Button>
        </div>
      )}
    </div>
  )
}
