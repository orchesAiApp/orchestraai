'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, CheckCircle2, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import WorkflowVisualization from './workflow-visualization'
import DemoModal from '@/components/demo/demo-modal'

export default function Hero() {
  const [isDemoOpen, setIsDemoOpen] = useState(false)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const features = [
    'Advanced Workflow Builder',
    'Real-time Analytics',
    'Agent Library',
    'Webhook Integrations',
  ]

  return (
    <>
      <section className="pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={container}>
              <motion.h1
                variants={item}
                className="text-5xl md:text-6xl font-bold leading-tight text-balance mb-6"
              >
                Deploy and Manage
                <br />
                <span className="text-accent">Intelligent Agents</span>
              </motion.h1>

              <motion.p variants={item} className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Orchestrate Workflows. Scale Your Operations.
                <br />
                <span className="text-sm">CA : 2oDcXBSQNWhMiRNg5euSuTwgdr8trmcnhAXEh6Zj2kVE</span>
              </motion.p>

              <motion.p variants={item} className="text-muted-foreground mb-8">
                Build powerful AI workflows with drag-and-drop simplicity. Connect multiple agents to automate
                complex tasks.
              </motion.p>

              {/* Feature Badges */}
              <motion.div variants={item} className="flex flex-wrap gap-3 mb-8">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-lg border border-accent/20">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 relative z-10 items-start sm:items-center">
                <Link href="/auth/sign-up" className="inline-block w-full sm:w-auto">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 bg-accent hover:bg-accent/90 text-background w-full sm:w-auto">
                    Start Building Free
                  </button>
                </Link>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => setIsDemoOpen(true)}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 border border-accent/30 hover:border-accent/60 text-foreground hover:bg-accent/10 flex-1 sm:flex-none"
                  >
                    <Play className="w-4 h-4" />
                    Watch Demo
                  </button>
                  <Link href="https://x.com/OrchesA54937" target="_blank" rel="noopener noreferrer">
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-4 border border-accent/30 hover:border-accent/60 text-accent hover:bg-accent/10">
                      <Twitter className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Workflow Visualization */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <WorkflowVisualization />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </>
  )
}
