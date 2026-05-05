'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Play, Pause, User, LogOut } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  onRunAll: () => void
  onPauseAll: () => void
  onNewWorkflow: () => void
}

export default function Header({ onRunAll, onPauseAll, onNewWorkflow }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Get current user email
  useEffect(() => {
    const getUserEmail = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
    }
    getUserEmail()
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const handleRunAll = () => {
    console.log('[v0] Run All button clicked')
    onRunAll()
  }

  const handlePauseAll = () => {
    console.log('[v0] Pause All button clicked')
    onPauseAll()
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    console.log('[v0] Logout initiated')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      console.log('[v0] Logout successful')
      router.push('/auth/login')
    } catch (error) {
      console.error('[v0] Logout error:', error)
      alert('Failed to logout')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center justify-between h-16 px-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <Image
              src="/logo.png"
              alt="AI Agent Orchestration Logo"
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-cyan-400 bg-clip-text text-transparent">
            AI Agent Orchestration
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleRunAll}
            variant="default"
            size="sm"
            className="gap-2 bg-accent hover:bg-accent/90 text-background font-semibold"
          >
            <Play className="w-4 h-4" />
            Run All
          </Button>
          <Button
            onClick={handlePauseAll}
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent hover:bg-accent/10 border-accent text-accent"
          >
            <Pause className="w-4 h-4" />
            Pause All
          </Button>
          <Button
            onClick={onNewWorkflow}
            variant="default"
            size="sm"
            className="gap-2 bg-accent hover:bg-accent/90 text-background font-semibold"
          >
            {/* Icon for New Workflow */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14m-6-7h12"></path>
            </svg>
            New Workflow
          </Button>
        </div>

        <div className="flex items-center gap-3 border-l border-border/50 pl-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-muted-foreground">All Systems Operational</span>
          </div>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <Button
              onClick={() => setShowUserMenu(!showUserMenu)}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-accent/10"
            >
              <User className="w-4 h-4" />
            </Button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-card/95 border border-border/50 rounded-lg shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/60 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                {/* User Info */}
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {userEmail || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground">Authenticated</p>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-accent/10 transition-colors text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-4 h-4" />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
