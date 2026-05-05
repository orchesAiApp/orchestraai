'use client'

import React from "react"

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Play, Download } from 'lucide-react'
import { Agent } from '@/types'

interface WorkflowNode {
  id: string
  agentId: string
  x: number
  y: number
}

interface WorkflowEdge {
  id: string
  source: string
  target: string
}

interface WorkflowBuilderProps {
  agents: Agent[]
}

export default function AdvancedWorkflowBuilder({ agents }: WorkflowBuilderProps) {
  const [nodes, setNodes] = useState<WorkflowNode[]>([])
  const [edges, setEdges] = useState<WorkflowEdge[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const addNode = useCallback((agentId: string) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      agentId,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
    }
    setNodes((prev) => [...prev, newNode])
  }, [])

  const deleteNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId))
    setEdges((prev) => prev.filter((e) => e.source !== nodeId && e.target !== nodeId))
  }

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    setDraggedNode(nodeId)
    const node = nodes.find((n) => n.id === nodeId)
    if (node) {
      setDragOffset({
        x: e.clientX - node.x,
        y: e.clientY - node.y,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNode) {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === draggedNode
            ? { ...n, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
            : n
        )
      )
    }
  }

  const handleMouseUp = () => {
    setDraggedNode(null)
  }

  const connectNodes = (sourceId: string, targetId: string) => {
    const edgeId = `edge-${sourceId}-${targetId}`
    if (!edges.find((e) => e.id === edgeId)) {
      setEdges((prev) => [...prev, { id: edgeId, source: sourceId, target: targetId }])
    }
  }

  const exportWorkflow = () => {
    const workflow = { nodes, edges }
    const dataStr = JSON.stringify(workflow, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `workflow-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b border-border/50 p-4 space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Workflow Builder</h2>
        <div className="flex gap-2 flex-wrap">
          {agents.map((agent) => (
            <Button
              key={agent.id}
              onClick={() => addNode(agent.id)}
              variant="outline"
              size="sm"
              className="gap-2 bg-accent/10 text-accent hover:bg-accent/20 border-accent/30"
            >
              <Plus className="w-3 h-3" />
              {agent.name}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={exportWorkflow}
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent hover:bg-accent/10"
          >
            <Download className="w-3 h-3" />
            Export
          </Button>
          <Button
            onClick={() => {
              setNodes([])
              setEdges([])
            }}
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </Button>
        </div>
      </div>

      <div
        className="flex-1 relative bg-gradient-to-br from-accent/5 via-background to-background overflow-auto"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Canvas background grid */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="workflow-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#workflow-grid)" />
        </svg>

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source)
            const targetNode = nodes.find((n) => n.id === edge.target)

            if (!sourceNode || !targetNode) return null

            return (
              <line
                key={edge.id}
                x1={sourceNode.x + 60}
                y1={sourceNode.y + 40}
                x2={targetNode.x + 20}
                y2={targetNode.y + 40}
                stroke="url(#edgeGradient)"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            )
          })}

          <defs>
            <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.5" />
            </linearGradient>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#00d4ff" />
            </marker>
          </defs>
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const agent = agents.find((a) => a.id === node.agentId)
          return (
            <div
              key={node.id}
              className="absolute"
              style={{ left: node.x, top: node.y, cursor: draggedNode === node.id ? 'grabbing' : 'grab' }}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
            >
              <div
                className={`w-40 p-3 rounded-lg border-2 bg-card/80 backdrop-blur cursor-pointer transition-all ${
                  selectedNode === node.id
                    ? 'border-accent bg-accent/10 shadow-lg shadow-accent/40'
                    : 'border-border/60 hover:border-accent/60'
                }`}
                onClick={() => setSelectedNode(node.id)}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h3 className="text-xs font-semibold text-foreground">{agent?.name || 'Unknown'}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{agent?.role}</p>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNode(node.id)
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                {/* Connection handles */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-3 h-3 rounded-full bg-accent border border-background cursor-pointer hover:bg-accent/80" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-3 h-3 rounded-full bg-accent border border-background cursor-pointer hover:bg-accent/80" />

                {/* Status badge */}
                <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  agent?.status === 'working'
                    ? 'bg-accent/20 text-accent'
                    : agent?.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-muted/20 text-muted-foreground'
                }`}>
                  {agent?.status || 'idle'}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
