"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const steps = [
  { id: "writer", label: "Writer", icon: "✍️" },
  { id: "code", label: "Code", icon: "💻" },
  { id: "research", label: "Research", icon: "🔍" },
  { id: "analyst", label: "Analyst", icon: "📊" },
]

export default function WorkflowAnimation() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % (steps.length + 1))
    }, 1800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full max-w-4xl mx-auto p-10 bg-gradient-to-br from-secondary/30 to-background rounded-2xl border border-accent/20">
      
      {/* SVG CONNECTIONS */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {steps.slice(0, -1).map((_, i) => (
          <motion.line
            key={i}
            x1="20%"
            y1={`${30 + i * 15}%`}
            x2="80%"
            y2={`${30 + i * 15}%`}
            stroke="#00d9ff"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: activeStep > i ? 1 : 0,
              opacity: activeStep > i ? 1 : 0.2,
            }}
            transition={{ duration: 0.8 }}
          />
        ))}
      </svg>

      {/* NODES */}
      <div className="grid grid-cols-1 gap-6 relative z-10">
        {steps.map((step, index) => {
          const status =
            activeStep > index
              ? "Complete"
              : activeStep === index
              ? "Working"
              : "Waiting"

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: activeStep === index ? 1.05 : 1,
              }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-between p-4 rounded-xl border border-accent/30 bg-gradient-to-b from-background to-secondary/40"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{step.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{status}</p>
                </div>
              </div>

              {status === "Working" && (
                <motion.div
                  className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent to-accent/50"
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 1.2 }}
                  />
                </motion.div>
              )}

              {status === "Complete" && (
                <span className="text-accent text-lg">✓</span>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* COMPLETE OVERLAY */}
      {activeStep === steps.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-2xl"
        >
          <p className="text-xl font-semibold text-accent">
            Workflow Complete 🚀
          </p>
        </motion.div>
      )}
    </div>
  )
}
