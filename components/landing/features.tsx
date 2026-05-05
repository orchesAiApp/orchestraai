'use client'

import { motion } from 'framer-motion'
import { Zap, BarChart3, Layers, Cpu, Webhook, Settings } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Drag & Drop Builder',
    description: 'Intuitive visual interface for building complex workflows',
    color: 'from-accent/20 to-accent/5',
  },
  {
    icon: Cpu,
    title: 'Pre-built Agents',
    description: 'Library of ready-to-use AI agents for every task',
    color: 'from-orange-500/20 to-orange-500/5',
  },
  {
    icon: Zap,
    title: 'Real-time Execution',
    description: 'Watch your workflows execute in real-time with live monitoring',
    color: 'from-green-500/20 to-green-500/5',
  },
  {
    icon: Layers,
    title: 'Conditional Logic',
    description: 'Add smart routing, loops, and decision trees to workflows',
    color: 'from-purple-500/20 to-purple-500/5',
  },
  {
    icon: Webhook,
    title: 'Webhook Triggers',
    description: 'Connect with external services and APIs seamlessly',
    color: 'from-pink-500/20 to-pink-500/5',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track performance, monitor success rates, and optimize',
    color: 'from-blue-500/20 to-blue-500/5',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 md:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground">Everything you need to build and manage AI workflows</p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={item}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`group relative bg-gradient-to-br ${feature.color} border border-accent/20 hover:border-accent/40 rounded-2xl p-8 transition-all duration-300`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
                <div className="relative">
                  <Icon className="w-10 h-10 text-accent mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
