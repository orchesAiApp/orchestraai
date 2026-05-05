'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Search, Star, Download, Loader2, Check } from 'lucide-react'

interface AgentTemplate {
  id: string
  name: string
  role: string
  description: string
  rating: number
  downloads: number
  tags: string[]
}

const agentLibrary: AgentTemplate[] = [
  {
    id: 'research-1',
    name: 'Web Research Agent',
    role: 'research',
    description: 'Specialized in gathering and analyzing web information',
    rating: 4.8,
    downloads: 1250,
    tags: ['research', 'web-scraping', 'analysis'],
  },
  {
    id: 'writer-1',
    name: 'Content Writer Agent',
    role: 'writing',
    description: 'Generates high-quality written content',
    rating: 4.9,
    downloads: 2105,
    tags: ['writing', 'content', 'generation'],
  },
  {
    id: 'code-1',
    name: 'Code Generator Agent',
    role: 'coding',
    description: 'Writes and refactors code across multiple languages',
    rating: 4.7,
    downloads: 1890,
    tags: ['coding', 'development', 'refactoring'],
  },
  {
    id: 'data-1',
    name: 'Data Analysis Agent',
    role: 'analysis',
    description: 'Analyzes data and generates insights',
    rating: 4.6,
    downloads: 945,
    tags: ['analysis', 'data', 'insights'],
  },
]

export default function AgentLibrary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [deployingAgents, setDeployingAgents] = useState<Set<string>>(new Set())
  const [deployedAgents, setDeployedAgents] = useState<Set<string>>(new Set())

  const filteredAgents = agentLibrary.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !selectedTag || agent.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const allTags = Array.from(new Set(agentLibrary.flatMap((a) => a.tags)))

  const handleDeployAgent = async (agentId: string, agentName: string) => {
    console.log('[v0] Deploy Agent clicked for:', agentName)
    
    setDeployingAgents((prev) => new Set(prev).add(agentId))
    
    try {
      console.log('[v0] Sending POST request to /api/agents')
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: agentName,
          role: agentLibrary.find((a) => a.id === agentId)?.role || 'general',
          status: 'active',
          config: { template: agentId },
        }),
      })

      console.log('[v0] API response status:', response.status)
      const data = await response.json()
      console.log('[v0] API response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to deploy agent')
      }

      console.log('[v0] Agent deployed successfully:', data)
      
      setDeployedAgents((prev) => new Set(prev).add(agentId))
      setDeployingAgents((prev) => {
        const next = new Set(prev)
        next.delete(agentId)
        return next
      })

      // Show success message
      setTimeout(() => {
        console.log('[v0] Deployment complete for agent:', agentId)
      }, 1500)
    } catch (error: any) {
      console.error('[v0] Error deploying agent:', error.message, error)
      setDeployingAgents((prev) => {
        const next = new Set(prev)
        next.delete(agentId)
        return next
      })
      alert(`Failed to deploy agent: ${error.message || 'Unknown error'}`)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Agent Library</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary/30 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {allTags.map((tag) => (
          <Button
            key={tag}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            variant={selectedTag === tag ? 'default' : 'outline'}
            size="sm"
            className={`${
              selectedTag === tag
                ? 'bg-accent hover:bg-accent/90 text-background'
                : 'bg-transparent border-border/50 hover:border-accent/50'
            }`}
          >
            {tag}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/20"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{agent.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">{agent.role}</p>
              </div>
              <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-medium text-foreground">{agent.rating}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3">{agent.description}</p>

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Download className="w-3 h-3" />
                {agent.downloads} downloads
              </span>
            </div>

            <div className="flex gap-2 flex-wrap mb-3">
              {agent.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>

            <Button 
              onClick={() => handleDeployAgent(agent.id, agent.name)}
              disabled={deployingAgents.has(agent.id) || deployedAgents.has(agent.id)}
              className="w-full gap-2 bg-accent hover:bg-accent/90 text-background font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {deployedAgents.has(agent.id) ? (
                <>
                  <Check className="w-4 h-4" />
                  Deployed
                </>
              ) : deployingAgents.has(agent.id) ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Deploy Agent
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
