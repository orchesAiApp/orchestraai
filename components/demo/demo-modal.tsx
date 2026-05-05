'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCcw, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react'
import CanvasAnimator from './canvas-animator'
import { demoSteps } from './demo-steps'
import { Button } from '@/components/ui/button'

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)

  const step = demoSteps[currentStep]

  useEffect(() => {
    if (!isPlaying || !step) return
    const duration = step.duration * 1000 / speed
    const timer = setTimeout(() => {
      if (currentStep < demoSteps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        setIsPlaying(false)
      }
    }, duration)
    return () => clearTimeout(timer)
  }, [currentStep, isPlaying, speed, step])

  const handleRestart = () => {
    setCurrentStep(0)
    setIsPlaying(true)
  }

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setIsPlaying(false)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setIsPlaying(false)
    }
  }

  const progress = ((currentStep + 1) / demoSteps.length) * 100

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-5xl h-[85vh] bg-background border border-border rounded-lg flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div>
                <h2 className="text-2xl font-bold">Interactive Demo</h2>
                <p className="text-sm text-muted-foreground">Step {currentStep + 1} of {demoSteps.length}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRestart}
                  className="p-2 hover:bg-secondary rounded-lg transition"
                  title="Restart"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-lg transition"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Canvas */}
              <div className="flex-1 p-6 flex items-center justify-center bg-gradient-to-b from-secondary/5 to-background">
                <CanvasAnimator currentStep={currentStep} />
              </div>

              {/* Narration */}
              <div className="w-80 p-6 border-l border-border/50 bg-secondary/30 flex flex-col justify-between">
                <div>
                  <div className="mb-4 p-4 bg-background/50 border border-accent/20 rounded-lg">
                    <motion.p
                      key={currentStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm leading-relaxed"
                    >
                      {step.narration}
                    </motion.p>
                  </div>
                </div>

                <div>
                  <Link href="/auth/sign-up" className="w-full">
                    <button className="w-full py-2 px-4 bg-accent hover:bg-accent/90 text-background rounded-lg font-medium transition mb-3">
                      Try It Yourself
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border/50 p-6 bg-secondary/20">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-accent to-accent/60"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="p-2 hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 hover:bg-secondary rounded-lg transition"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentStep === demoSteps.length - 1}
                    className="p-2 hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Speed:</span>
                  {[0.5, 1, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`px-3 py-1 rounded text-xs font-medium transition ${
                        speed === s
                          ? 'bg-accent text-background'
                          : 'bg-secondary hover:bg-secondary/80 text-foreground'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

import Link from 'next/link'
