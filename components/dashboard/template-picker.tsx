'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import TemplatesBrowser from './templates-browser'
import { Agent } from '@/types'

interface TemplatePickerProps {
  agents: Agent[]
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (templateName: string, nodes: any[], connections: any[]) => void
}

export default function TemplatePicker({
  agents,
  isOpen,
  onClose,
  onSelectTemplate,
}: TemplatePickerProps) {
  if (!isOpen) return null

  const handleSelectTemplate = (template: any) => {
    const nodes = typeof template.nodes === 'string' ? JSON.parse(template.nodes) : template.nodes
    const connections = typeof template.connections === 'string' ? JSON.parse(template.connections) : template.connections
    
    onSelectTemplate(template.name, nodes, connections)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border/50 rounded-lg shadow-lg w-full h-full md:w-5/6 md:h-5/6 md:rounded-lg flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h2 className="text-lg font-semibold text-foreground">Choose a Template</h2>
          <Button
            onClick={onClose}
            size="icon"
            variant="ghost"
            className="hover:bg-accent/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <TemplatesBrowser agents={agents} onUseTemplate={handleSelectTemplate} />
      </div>
    </div>
  )
}
