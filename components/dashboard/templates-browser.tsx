'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Download, Grid2X2, List } from 'lucide-react'
import { Agent } from '@/types'

interface Template {
  id: string
  name: string
  description: string
  category: string
  thumbnail?: string
  nodes: any[]
  connections: any[]
  user_id: string
  is_public: boolean
  created_at: string
}

interface TemplatesBrowserProps {
  agents: Agent[]
  onUseTemplate?: (template: Template) => void
}

const PRESET_TEMPLATES: Template[] = [
  {
    id: 'template-research-to-write',
    name: 'Research & Write',
    description: 'Gather research data and write content',
    category: 'content',
    nodes: [
      { id: 'node1', agentId: '1', x: 100, y: 150 },
      { id: 'node2', agentId: '2', x: 380, y: 150 },
    ],
    connections: [{ id: 'conn1', fromNodeId: 'node1', toNodeId: 'node2' }],
    user_id: 'system',
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'template-code-test',
    name: 'Code Generation & Testing',
    description: 'Generate code and run tests',
    category: 'development',
    nodes: [
      { id: 'node1', agentId: '3', x: 100, y: 150 },
      { id: 'node2', agentId: '5', x: 380, y: 150 },
    ],
    connections: [{ id: 'conn1', fromNodeId: 'node1', toNodeId: 'node2' }],
    user_id: 'system',
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'template-data-analysis',
    name: 'Data Analysis Pipeline',
    description: 'Analyze data and generate insights',
    category: 'analytics',
    nodes: [{ id: 'node1', agentId: '4', x: 100, y: 150 }],
    connections: [],
    user_id: 'system',
    is_public: true,
    created_at: new Date().toISOString(),
  },
]

export default function TemplatesBrowser({
  agents,
  onUseTemplate,
}: TemplatesBrowserProps) {
  const [templates, setTemplates] = useState<Template[]>(PRESET_TEMPLATES)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/templates')
        if (response.ok) {
          const data = await response.json()
          setTemplates([...PRESET_TEMPLATES, ...data])
        }
      } catch (error) {
        console.error('[v0] Error loading templates:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTemplates()
  }, [])

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter((t) => t.category === selectedCategory)

  const categories = ['all', ...new Set(templates.map((t) => t.category))]

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-accent/5 via-background to-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Workflow Templates</h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setViewMode('grid')}
              size="icon"
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              className={`${
                viewMode === 'grid'
                  ? 'bg-accent hover:bg-accent/90'
                  : 'bg-transparent hover:bg-accent/10 border-border/50'
              }`}
            >
              <Grid2X2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              size="icon"
              variant={viewMode === 'list' ? 'default' : 'outline'}
              className={`${
                viewMode === 'list'
                  ? 'bg-accent hover:bg-accent/90'
                  : 'bg-transparent hover:bg-accent/10 border-border/50'
              }`}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              className={`capitalize whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-accent hover:bg-accent/90 text-background'
                  : 'bg-transparent hover:bg-accent/10 border-border/50'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid/List */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading templates...</p>
          </div>
        ) : (
          <div
            className={`grid gap-4 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}
          >
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="border border-border/50 rounded-lg bg-card/50 backdrop-blur hover:border-accent/50 transition-all overflow-hidden group"
              >
                {/* Thumbnail */}
                <div className="h-32 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                  <p className="text-muted-foreground text-sm z-10">
                    {template.nodes.length} nodes
                  </p>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-sm text-foreground">{template.name}</h3>
                  <p className="text-xs text-muted-foreground">{template.description}</p>

                  {/* Tags */}
                  <div className="flex items-center gap-2 flex-wrap pt-2">
                    <span className="text-xs px-2 py-1 rounded bg-secondary/30 border border-border/50 text-accent capitalize">
                      {template.category}
                    </span>
                    {template.is_public && (
                      <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        Public
                      </span>
                    )}
                  </div>

                  {/* Button */}
                  <Button
                    onClick={() => onUseTemplate?.(template)}
                    className="w-full mt-3 gap-2 bg-accent hover:bg-accent/90 text-background font-semibold"
                    size="sm"
                  >
                    <Download className="w-3 h-3" />
                    Use Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
