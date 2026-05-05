'use client'

import React from "react"

import { Agent } from '@/types'
import { useState, useRef, useEffect } from 'react'
import { Plus, X, Trash2, Download, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WorkflowCanvasProps {
  agents: Agent[]
  initialWorkflow?: {
    id: string
    name: string
    nodes: WorkflowNode[]
    connections: WorkflowConnection[]
  }
  onSave?: (workflow: any) => void
  executingNodeId?: string | null
  executionProgress?: number
}

interface WorkflowNode {
  id: string
  agentId: string
  x: number
  y: number
}

interface WorkflowConnection {
  id: string
  fromNodeId: string
  toNodeId: string
}

const statusDotColors: { [key: string]: string } = {
  idle: 'fill-muted',
  working: 'fill-accent animate-pulse',
  completed: 'fill-emerald-400',
  error: 'fill-destructive',
}

const roleEmojis: { [key: string]: string } = {
  research: '🔍',
  writing: '✍️',
  coding: '💻',
  analysis: '📊',
  testing: '🧪',
}

export default function WorkflowCanvas({ agents, initialWorkflow, onSave, executingNodeId, executionProgress }: WorkflowCanvasProps) {
  const [nodes, setNodes] = useState<WorkflowNode[]>(
    initialWorkflow?.nodes || [
      { id: 'node1', agentId: '1', x: 100, y: 150 },
      { id: 'node2', agentId: '2', x: 380, y: 150 },
      { id: 'node3', agentId: '5', x: 660, y: 150 },
    ]
  )
  const [connections, setConnections] = useState<WorkflowConnection[]>(
    initialWorkflow?.connections || [
      { id: 'conn1', fromNodeId: 'node1', toNodeId: 'node2' },
      { id: 'conn2', fromNodeId: 'node2', toNodeId: 'node3' },
    ]
  )
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [draggedAgent, setDraggedAgent] = useState<string | null>(null)
  const [connecting, setConnecting] = useState<string | null>(null)
  const [connectionMode, setConnectionMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [workflowName, setWorkflowName] = useState(initialWorkflow?.name || 'Untitled Workflow')

  const getAgent = (agentId: string) => agents.find((a) => a.id === agentId)

  const handleDragStart = (agentId: string, e: React.DragEvent) => {
    setDraggedAgent(agentId)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedAgent || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      agentId: draggedAgent,
      x: Math.max(0, Math.min(x - 60, rect.width - 120)),
      y: Math.max(0, Math.min(y - 60, rect.height - 120)),
    }

    setNodes([...nodes, newNode])
    setDraggedAgent(null)
  }

  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    if (e.button === 2) {
      // Right click - start connection
      setConnecting(nodeId)
      e.preventDefault()
    } else if (connectionMode && e.button === 0) {
      // Left click in connection mode - start pipeline connection
      console.log('[v0] Starting connection from node:', nodeId)
      setConnecting(nodeId)
    }
  }

  const handleNodeMouseUp = (toNodeId: string) => {
    if (connecting && connecting !== toNodeId) {
      const connectionExists = connections.some(
        (c) => c.fromNodeId === connecting && c.toNodeId === toNodeId
      )
      if (!connectionExists) {
        const newConnection: WorkflowConnection = {
          id: `conn-${Date.now()}`,
          fromNodeId: connecting,
          toNodeId: toNodeId,
        }
        console.log('[v0] Creating connection:', newConnection)
        setConnections([...connections, newConnection])
      }
      setConnecting(null)
      if (connectionMode) {
        setConnectionMode(false)
      }
    }
  }

  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter((n) => n.id !== nodeId))
    setConnections(
      connections.filter((c) => c.fromNodeId !== nodeId && c.toNodeId !== nodeId)
    )
    setSelectedNode(null)
  }

  const deleteConnection = (connId: string) => {
    setConnections(connections.filter((c) => c.id !== connId))
  }

  const updateNodePosition = (nodeId: string, x: number, y: number) => {
    setNodes(nodes.map((n) => (n.id === nodeId ? { ...n, x, y } : n)))
  }

  const handleSaveWorkflow = async () => {
    if (!initialWorkflow || !onSave) return

    try {
      setIsSaving(true)
      console.log('[v0] Saving workflow:', workflowName)
      onSave({
        id: initialWorkflow.id,
        name: workflowName,
        nodes,
        connections,
        status: 'draft',
      })
    } catch (error) {
      console.error('[v0] Error saving workflow:', error)
      alert('Failed to save workflow')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex-1 border-b border-border/50 bg-gradient-to-br from-accent/5 via-background to-background overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="px-3 py-2 bg-secondary/30 border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-accent"
            placeholder="Workflow Name"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setConnectionMode(!connectionMode)}
            variant={connectionMode ? 'default' : 'outline'}
            size="sm"
            className={`gap-2 text-xs ${
              connectionMode
                ? 'bg-accent hover:bg-accent/90 text-background'
                : 'bg-transparent hover:bg-accent/10 border-border/50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {connectionMode ? 'Connecting' : 'Connect'}
          </Button>
          <Button
            onClick={handleSaveWorkflow}
            disabled={isSaving}
            size="sm"
            variant="default"
            className="gap-2 text-xs bg-accent hover:bg-accent/90 text-background font-semibold"
          >
            <Upload className="w-3 h-3" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-2 text-xs bg-transparent hover:bg-accent/10 border-border/50"
          >
            <Download className="w-3 h-3" />
            Export
          </Button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex flex-1 overflow-hidden gap-4 p-4">
        {/* Agent Palette */}
        <div className="w-40 border border-border/50 rounded-lg bg-card/50 backdrop-blur overflow-y-auto">
          <div className="p-3 border-b border-border/50 sticky top-0 bg-card/80">
            <p className="text-xs font-semibold text-foreground">Available Agents</p>
          </div>
          <div className="p-3 space-y-2">
            {agents.map((agent) => (
              <div
                key={agent.id}
                draggable
                onDragStart={(e) => handleDragStart(agent.id, e)}
                className="p-2 bg-secondary/30 border border-border/50 rounded-lg cursor-move hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/10 group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{roleEmojis[agent.role] || '🤖'}</span>
                  <p className="text-xs text-foreground font-medium truncate group-hover:text-accent">
                    {agent.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onContextMenu={(e) => e.preventDefault()}
          className="flex-1 border border-border/50 rounded-lg bg-background relative overflow-auto"
        >
          {/* Background grid */}
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Connection lines with animated data flow */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#00d4ff" stopOpacity="1" />
                <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.3" />
              </linearGradient>
              {/* Animation for data particles - only moves along path */}
              <style>{`
                @keyframes pulse {
                  0%, 100% {
                    r: 3;
                    opacity: 0.6;
                  }
                  50% {
                    r: 5;
                    opacity: 1;
                  }
                }
                .pulse-dot {
                  animation: pulse 1.5s infinite;
                }
              `}</style>
            </defs>
            {connections.map((conn) => {
              const fromNode = nodes.find((n) => n.id === conn.fromNodeId)
              const toNode = nodes.find((n) => n.id === conn.toNodeId)
              if (!fromNode || !toNode) return null

              const x1 = fromNode.x + 60
              const y1 = fromNode.y + 60
              const x2 = toNode.x + 20
              const y2 = toNode.y + 60
              const midX = (x1 + x2) / 2

              const pathD = `M ${x1} ${y1} Q ${midX} ${y1}, ${midX} ${y2} T ${x2} ${y2}`

              return (
                <g key={`connection-${conn.id}`}>
                  {/* Main connection line */}
                  <path
                    d={pathD}
                    stroke="#00d4ff"
                    strokeWidth="3"
                    fill="none"
                    className="drop-shadow-lg"
                    opacity="0.6"
                  />
                  
                  {/* Glowing line effect */}
                  <path
                    d={pathD}
                    stroke="#00d4ff"
                    strokeWidth="6"
                    fill="none"
                    opacity="0.2"
                  />

                  {/* Path definitions for animations */}
                  <path
                    id={`path-${conn.id}`}
                    d={pathD}
                    fill="none"
                    style={{ display: 'none' }}
                  />

                  {/* Animated data particles flowing through the pipe - only on path */}
                  {[0.15, 0.5, 0.85].map((offset, idx) => (
                    <g key={`particle-${conn.id}-${idx}`}>
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        begin={`${offset * 3}s`}
                      >
                        <mpath href={`#path-${conn.id}`} />
                        <circle
                          cx="0"
                          cy="0"
                          r="4"
                          fill="#00d4ff"
                          style={{
                            filter: 'drop-shadow(0 0 8px #00d4ff)',
                          }}
                        />
                      </animateMotion>
                    </g>
                  ))}

                  {/* Center pulse indicator */}
                  <circle
                    cx={x1 + (x2 - x1) * 0.5}
                    cy={y1 + (y2 - y1) * 0.5}
                    r="3"
                    fill="#00d4ff"
                    className="pulse-dot"
                    style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }}
                  />
                </g>
              )
            })}
          </svg>

          {/* Nodes */}
          <div className="absolute inset-0 pointer-events-none">
            {nodes.map((node) => {
              const agent = getAgent(node.agentId)
              if (!agent) return null

              return (
                <DraggableNode
                  key={node.id}
                  node={node}
                  agent={agent}
                  emoji={roleEmojis[agent.role] || '🤖'}
                  isSelected={selectedNode === node.id}
                  isConnecting={connecting === node.id}
                  isExecuting={executingNodeId === node.id}
                  executionProgress={executingNodeId === node.id ? executionProgress : undefined}
                  onSelect={() => setSelectedNode(node.id)}
                  onMouseDown={(e) => handleMouseDown(node.id, e)}
                  onMouseUp={() => handleNodeMouseUp(node.id)}
                  onPositionChange={updateNodePosition}
                  onDelete={() => deleteNode(node.id)}
                  statusColor={statusDotColors[agent.status]}
                />
              )
            })}
          </div>

          {/* Help text */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-muted-foreground text-center">
                Drag agents from the palette to create workflow nodes<br/>
                Right-click on nodes to connect them
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating action button */}
      <Button
        onClick={() => {}}
        className="absolute bottom-6 right-6 rounded-full w-12 h-12 p-0 bg-accent hover:bg-accent/90 shadow-lg shadow-accent/40 text-background"
        size="icon"
      >
        <Plus className="w-5 h-5" />
      </Button>

      {/* Selected node detail panel */}
      {selectedNode && (
        <div className="absolute bottom-6 left-6 bg-card/95 border border-accent/40 rounded-lg p-4 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-lg shadow-accent/20 max-w-xs">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h4 className="font-semibold text-accent text-sm uppercase tracking-wider">Node Details</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 hover:text-accent hover:bg-accent/10"
              onClick={() => setSelectedNode(null)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          {getAgent(nodes.find((n) => n.id === selectedNode)?.agentId || '')?.id && (
            <>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">
                    {getAgent(nodes.find((n) => n.id === selectedNode)?.agentId || '')?.name}
                  </span>
                </div>
                <div>Status: {getAgent(nodes.find((n) => n.id === selectedNode)?.agentId || '')?.status}</div>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                <Button variant="outline" size="sm" className="text-xs bg-transparent hover:bg-accent/10 hover:text-accent border-accent/30">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-xs bg-transparent hover:bg-accent/10 hover:text-accent border-accent/30">
                  Pause
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function DraggableNode({
  node,
  agent,
  emoji,
  isSelected,
  isConnecting,
  isExecuting,
  executionProgress,
  onSelect,
  onMouseDown,
  onMouseUp,
  onPositionChange,
  onDelete,
  statusColor,
}: {
  node: WorkflowNode
  agent: Agent
  emoji: string
  isSelected: boolean
  isConnecting: boolean
  isExecuting?: boolean
  executionProgress?: number
  onSelect: () => void
  onMouseDown: (e: React.MouseEvent) => void
  onMouseUp: () => void
  onPositionChange: (nodeId: string, x: number, y: number) => void
  onDelete: () => void
  statusColor: string
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [showOutport, setShowOutport] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    })
    onMouseDown(e)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      onPositionChange(node.id, e.clientX - dragOffset.x, e.clientY - dragOffset.y)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      onMouseUp()
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset, node.id, onPositionChange, onMouseUp])

  return (
    <div
      style={{
        position: 'absolute',
        left: `${node.x}px`,
        top: `${node.y}px`,
        pointerEvents: 'auto',
      }}
      onMouseDown={handleMouseDown}
      onClick={onSelect}
      onMouseEnter={() => setShowOutport(true)}
      onMouseLeave={() => setShowOutport(false)}
    >
      <div
        className={`
          w-32 p-3 rounded-lg border-2 cursor-move transition-all relative
          ${
            isExecuting
              ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/60 animate-pulse'
              : isSelected
                ? 'border-accent bg-accent/10 shadow-lg shadow-accent/40'
                : isConnecting
                  ? 'border-destructive bg-destructive/10'
                  : 'border-border/60 bg-card/70 hover:border-accent/60'
          }
          backdrop-blur supports-[backdrop-filter]:bg-card/40
        `}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{emoji}</span>
            <h3 className="text-xs font-semibold text-foreground truncate flex-1">
              {agent.name}
            </h3>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1 hover:bg-destructive/20 rounded transition-colors"
          >
            <X className="w-3 h-3 text-destructive" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <svg className="w-3 h-3" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="5" className={statusColor} stroke="currentColor" strokeWidth="1" />
          </svg>
          <span className="text-xs text-muted-foreground capitalize">{agent.status}</span>
        </div>

        {agent.status === 'working' && (
          <div className="w-full bg-secondary/30 rounded-full h-1 overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-accent to-cyan-400 transition-all duration-300"
              style={{ width: `${agent.progress}%` }}
            />
          </div>
        )}

        {isExecuting && (
          <div className="w-full space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-400 font-medium">Executing</span>
              {executionProgress !== undefined && (
                <span className="text-xs text-amber-400">{Math.round(executionProgress)}%</span>
              )}
            </div>
            <div className="w-full bg-secondary/30 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 transition-all duration-500 animate-pulse"
                style={{ width: `${executionProgress || 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Connection Ports */}
        {showOutport && (
          <>
            {/* Input Port */}
            <div
              title="Connection input"
              className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-accent bg-card hover:bg-accent hover:scale-125 transition-all cursor-crosshair shadow-lg shadow-accent/50"
            />
            {/* Output Port */}
            <div
              title="Connection output"
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-accent bg-card hover:bg-accent hover:scale-125 transition-all cursor-crosshair shadow-lg shadow-accent/50"
            />
          </>
        )}
      </div>
    </div>
  )
}
