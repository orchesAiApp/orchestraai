'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border/50 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="OrchestraAi Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="text-xl font-bold">
            Orchestra<span className="text-accent">Ai</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-muted-foreground hover:text-foreground transition">
            Features
          </Link>
          <Link href="#agents" className="text-muted-foreground hover:text-foreground transition">
            Agents
          </Link>
          <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition">
            Pricing
          </Link>
          <Link href="#faq" className="text-muted-foreground hover:text-foreground transition">
            FAQ
          </Link>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth/login" className="inline-block">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/auth/sign-up" className="inline-block">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 rounded-md px-4 bg-accent hover:bg-accent/90 text-background">
              Get Started
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border/50">
          <div className="flex flex-col gap-4 px-4 py-4">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="#agents" className="text-muted-foreground hover:text-foreground transition">
              Agents
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition">
              Pricing
            </Link>
            <Link href="#faq" className="text-muted-foreground hover:text-foreground transition">
              FAQ
            </Link>
            <div className="flex gap-2 pt-4 border-t border-border/50">
              <Link href="/auth/login" className="flex-1 inline-block">
                <Button variant="ghost" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up" className="flex-1 inline-block">
                <button className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 rounded-md px-4 bg-accent hover:bg-accent/90 text-background">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
