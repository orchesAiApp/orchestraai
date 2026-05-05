'use client';

import { useEffect } from 'react'

export interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  callback: () => void
  description?: string
  enabled?: boolean
}

export interface ShortcutGroup {
  name: string
  shortcuts: KeyboardShortcut[]
}

export const SHORTCUTS: ShortcutGroup[] = [
  {
    name: 'Workflow',
    shortcuts: [
      {
        key: 's',
        ctrlKey: true,
        description: 'Save workflow',
        callback: () => console.log('[v0] Save shortcut triggered'),
      },
      {
        key: 'r',
        ctrlKey: true,
        description: 'Run workflow',
        callback: () => console.log('[v0] Run shortcut triggered'),
      },
      {
        key: ' ',
        description: 'Pan canvas (hold and drag)',
        callback: () => console.log('[v0] Pan enabled'),
      },
    ],
  },
  {
    name: 'Editing',
    shortcuts: [
      {
        key: 'z',
        ctrlKey: true,
        description: 'Undo',
        callback: () => console.log('[v0] Undo triggered'),
      },
      {
        key: 'z',
        ctrlKey: true,
        shiftKey: true,
        description: 'Redo',
        callback: () => console.log('[v0] Redo triggered'),
      },
      {
        key: 'c',
        ctrlKey: true,
        description: 'Copy selected',
        callback: () => console.log('[v0] Copy triggered'),
      },
      {
        key: 'v',
        ctrlKey: true,
        description: 'Paste',
        callback: () => console.log('[v0] Paste triggered'),
      },
      {
        key: 'a',
        ctrlKey: true,
        description: 'Select all',
        callback: () => console.log('[v0] Select all triggered'),
      },
      {
        key: 'Delete',
        description: 'Delete selected',
        callback: () => console.log('[v0] Delete triggered'),
      },
      {
        key: 'Backspace',
        description: 'Delete selected',
        callback: () => console.log('[v0] Delete triggered'),
      },
    ],
  },
  {
    name: 'Search',
    shortcuts: [
      {
        key: 'f',
        ctrlKey: true,
        description: 'Search agents',
        callback: () => console.log('[v0] Search triggered'),
      },
      {
        key: '?',
        description: 'Show shortcuts help',
        callback: () => console.log('[v0] Help triggered'),
      },
    ],
  },
]

export function useKeyboardShortcuts(customShortcuts?: KeyboardShortcut[]) {
  useEffect(() => {
    const allShortcuts = [
      ...SHORTCUTS.flatMap((group) => group.shortcuts),
      ...(customShortcuts || []),
    ]

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of allShortcuts) {
        if (shortcut.enabled === false) continue

        const matchKey = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const matchCtrl = shortcut.ctrlKey ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey
        const matchShift = shortcut.shiftKey ? event.shiftKey : !event.shiftKey
        const matchAlt = shortcut.altKey ? event.altKey : !event.altKey

        if (matchKey && matchCtrl && matchShift && matchAlt) {
          event.preventDefault()
          shortcut.callback()
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [customShortcuts])
}

export function getShortcutDisplay(shortcut: KeyboardShortcut): string {
  let result = ''
  if (shortcut.ctrlKey) result += 'Ctrl+'
  if (shortcut.shiftKey) result += 'Shift+'
  if (shortcut.altKey) result += 'Alt+'
  result += shortcut.key

  return result.replace(/\+$/, '')
}
