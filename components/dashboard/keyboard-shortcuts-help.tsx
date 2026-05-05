'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, HelpCircle } from 'lucide-react'
import { SHORTCUTS, getShortcutDisplay } from '@/hooks/use-keyboard-shortcuts'

export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size="icon"
        variant="ghost"
        className="rounded-full hover:bg-accent/10"
        title="Keyboard shortcuts (?)"
      >
        <HelpCircle className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border/50 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border/50 bg-card/95 backdrop-blur">
              <h2 className="text-lg font-semibold text-foreground">Keyboard Shortcuts</h2>
              <Button
                onClick={() => setIsOpen(false)}
                size="icon"
                variant="ghost"
                className="hover:bg-accent/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {SHORTCUTS.map((group) => (
                <div key={group.name}>
                  <h3 className="text-sm font-semibold text-accent mb-3">{group.name}</h3>
                  <div className="space-y-2">
                    {group.shortcuts.map((shortcut, idx) => (
                      <div
                        key={`${group.name}-${idx}`}
                        className="flex items-center justify-between py-2 px-3 rounded bg-secondary/20 border border-border/30"
                      >
                        <span className="text-sm text-foreground">{shortcut.description}</span>
                        <code className="text-xs bg-secondary/50 px-2 py-1 rounded border border-border/50 text-accent font-mono">
                          {getShortcutDisplay(shortcut)}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 flex justify-end gap-2 p-6 border-t border-border/50 bg-card/95 backdrop-blur">
              <Button
                onClick={() => setIsOpen(false)}
                className="bg-accent hover:bg-accent/90 text-background"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
