'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Node {
  id: string
  name: string
  icon: string
  color: string
  x: number
  y: number
  isVisible: boolean
}

interface Connection {
  from: string
  to: string
  isVisible: boolean
  pathData?: string
}

const agents = [
  { id: 'research', name: 'Research', icon: '🔍', color: '#00d9ff' },
  { id: 'writer', name: 'Writer', icon: '✍️', color: '#ff9500' },
  { id: 'code', name: 'Code', icon: '💻', color: '#00ff88' },
  { id: 'analyst', name: 'Analyst', icon: '📊', color: '#ff5555' },
]

const nodeAnimations = [
  { step: 1, nodes: [] },
  { step: 2, nodes: [{ id: 'writer', x: 100, y: 150 }] },
  { step: 3, nodes: [{ id: 'code', x: 300, y: 150 }] },
  { step: 4, nodes: [] },
  { step: 5, nodes: [{ id: 'research', x: 500, y: 80 }] },
  { step: 6, nodes: [{ id: 'analyst', x: 350, y: 280 }] },
  { step: 7, nodes: [] },
  { step: 8, nodes: [] },
]

export default function CanvasAnimator({ currentStep }: { currentStep: number }) {
  const [nodes, setNodes] = useState<Node[]>([])
  const [connections, setConnections] = useState<Connection[]>([])

  useEffect(() => {
    const animation = nodeAnimations[currentStep]
    if (!animation) return

    const newNodes: Node[] = []
    animation.nodes.forEach((nodeData) => {
      const agent = agents.find((a) => a.id === nodeData.id)
      if (agent) {
        newNodes.push({
          ...agent,
          x: nodeData.x,
          y: nodeData.y,
          isVisible: true,
        })
      }
    })
    setNodes(newNodes)

    // Add simple connections for later steps
    if (currentStep >= 3) {
      const newConnections: Connection[] = []
      if (nodeAnimations[currentStep - 1]?.nodes.length > 0) {
        newConnections.push({
          from: 'writer',
          to: 'code',
          isVisible: true,
        })
      }
      setConnections(newConnections)
    }
  }, [currentStep])

  return (
    <div className="relative w-full max-w-3xl h-96 bg-gradient-to-b from-secondary/20 to-background border border-accent/20 rounded-lg overflow-hidden">
      {/* Grid Background */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,217,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      >
        {/* Connections */}
        {connections.map(
          (conn, idx) =>
            conn.isVisible && (
              <motion.line
                key={`conn-${idx}`}
                x1="100"
                y1="150"
                x2="300"
                y2="150"
                stroke="#00d9ff"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8 }}
              />
            )
        )}
      </svg>

      {/* Nodes */}
      <div className="absolute inset-0">
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              left: `${(node.x / 600) * 100}%`,
              top: `${(node.y / 400) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute w-24 rounded-lg border-2 p-3 bg-secondary/50 text-center text-xs font-medium"
            style={{
              borderColor: node.color,
            } as React.CSSProperties}
          >
            <div className="text-xl mb-1">{node.icon}</div>
            <div>{node.name}</div>
          </motion.div>
        ))}
      </div>

      {/* Step Info */}
      {nodes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <p className="text-lg font-semibold text-accent mb-2">Canvas Ready</p>
            <p className="text-sm text-muted-foreground">Ready to build your workflow</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
