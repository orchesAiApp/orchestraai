'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Copy, Check, AlertCircle, GitBranch, Slack, LinkIcon } from 'lucide-react'

interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  active: boolean
  created_at: string
}

interface Integration {
  id: string
  name: string
  provider: string
  active: boolean
  created_at: string
}

interface WebhookIntegrationManagerProps {
  webhooks?: Webhook[]
  integrations?: Integration[]
}

const providerIcons: { [key: string]: React.ReactNode } = {
  github: <GitBranch className="w-4 h-4" />,
  slack: <Slack className="w-4 h-4" />,
  discord: <LinkIcon className="w-4 h-4" />,
  stripe: <LinkIcon className="w-4 h-4" />,
}

export default function WebhookIntegrationManager({ webhooks = [], integrations = [] }: WebhookIntegrationManagerProps) {
  const [showWebhookForm, setShowWebhookForm] = useState(false)
  const [showIntegrationForm, setShowIntegrationForm] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [webhookForm, setWebhookForm] = useState({ name: '', url: '', events: [] })
  const [integrationForm, setIntegrationForm] = useState({ name: '', provider: '', apiKey: '' })

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Webhooks Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Webhooks</h2>
          <Button
            onClick={() => setShowWebhookForm(!showWebhookForm)}
            variant="outline"
            size="sm"
            className="gap-2 bg-accent/10 text-accent hover:bg-accent/20 border-accent/30"
          >
            <Plus className="w-4 h-4" />
            Add Webhook
          </Button>
        </div>

        {showWebhookForm && (
          <div className="p-4 rounded-lg border border-accent/30 bg-accent/5 mb-4 space-y-3">
            <input
              type="text"
              placeholder="Webhook name"
              value={webhookForm.name}
              onChange={(e) => setWebhookForm({ ...webhookForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-secondary/30 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-accent"
            />
            <input
              type="url"
              placeholder="Webhook URL"
              value={webhookForm.url}
              onChange={(e) => setWebhookForm({ ...webhookForm, url: e.target.value })}
              className="w-full px-3 py-2 bg-secondary/30 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-accent"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setWebhookForm({ name: '', url: '', events: [] })
                  setShowWebhookForm(false)
                }}
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent hover:bg-accent/10"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Handle webhook creation
                  setShowWebhookForm(false)
                }}
                size="sm"
                className="flex-1 bg-accent hover:bg-accent/90 text-background"
              >
                Create Webhook
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {webhooks.length === 0 ? (
            <div className="p-4 text-center rounded-lg border border-border/50 bg-card/50 backdrop-blur">
              <AlertCircle className="w-6 h-6 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No webhooks configured yet</p>
            </div>
          ) : (
            webhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur hover:border-accent/50 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{webhook.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 break-all">{webhook.url}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${webhook.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted/20 text-muted-foreground'}`}>
                    {webhook.active ? 'Active' : 'Inactive'}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex flex-wrap gap-1">
                    {webhook.events.map((event) => (
                      <span key={event} className="px-2 py-1 bg-secondary/30 text-accent text-xs rounded border border-border/50">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleCopy(webhook.url, webhook.id)}
                    variant="ghost"
                    size="sm"
                    className="gap-2 hover:bg-accent/10 hover:text-accent"
                  >
                    {copiedId === webhook.id ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy URL
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Integrations Section */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">API Integrations</h2>
          <Button
            onClick={() => setShowIntegrationForm(!showIntegrationForm)}
            variant="outline"
            size="sm"
            className="gap-2 bg-accent/10 text-accent hover:bg-accent/20 border-accent/30"
          >
            <Plus className="w-4 h-4" />
            Add Integration
          </Button>
        </div>

        {showIntegrationForm && (
          <div className="p-4 rounded-lg border border-accent/30 bg-accent/5 mb-4 space-y-3">
            <input
              type="text"
              placeholder="Integration name"
              value={integrationForm.name}
              onChange={(e) => setIntegrationForm({ ...integrationForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-secondary/30 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-accent"
            />
            <select
              value={integrationForm.provider}
              onChange={(e) => setIntegrationForm({ ...integrationForm, provider: e.target.value })}
              className="w-full px-3 py-2 bg-secondary/30 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-accent"
            >
              <option value="">Select Provider</option>
              <option value="github">GitHub</option>
              <option value="slack">Slack</option>
              <option value="discord">Discord</option>
              <option value="stripe">Stripe</option>
            </select>
            <input
              type="password"
              placeholder="API Key"
              value={integrationForm.apiKey}
              onChange={(e) => setIntegrationForm({ ...integrationForm, apiKey: e.target.value })}
              className="w-full px-3 py-2 bg-secondary/30 border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-accent"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setIntegrationForm({ name: '', provider: '', apiKey: '' })
                  setShowIntegrationForm(false)
                }}
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent hover:bg-accent/10"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Handle integration creation
                  setShowIntegrationForm(false)
                }}
                size="sm"
                className="flex-1 bg-accent hover:bg-accent/90 text-background"
              >
                Connect Integration
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {integrations.length === 0 ? (
            <div className="p-4 text-center rounded-lg border border-border/50 bg-card/50 backdrop-blur">
              <AlertCircle className="w-6 h-6 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No integrations connected yet</p>
            </div>
          ) : (
            integrations.map((integration) => (
              <div
                key={integration.id}
                className="p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur hover:border-accent/50 transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10 text-accent">
                      {providerIcons[integration.provider] || <LinkIcon className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{integration.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{integration.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${integration.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted/20 text-muted-foreground'}`}>
                      {integration.active ? 'Connected' : 'Disconnected'}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
