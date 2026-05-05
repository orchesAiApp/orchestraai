'use client'

import { motion } from 'framer-motion'

const agents = [
  {
    icon: '🔍',
    name: 'Research Agent',
    color: 'from-accent/20 to-accent/5',
    badge: 'Most Popular',
  },
  {
    icon: '✍️',
    name: 'Writer Agent',
    color: 'from-orange-500/20 to-orange-500/5',
  },
  {
    icon: '💻',
    name: 'Code Agent',
    color: 'from-green-500/20 to-green-500/5',
  },
  {
    icon: '📊',
    name: 'Data Analyst',
    color: 'from-red-500/20 to-red-500/5',
  },
  {
    icon: '✅',
    name: 'QA Agent',
    color: 'from-yellow-500/20 to-yellow-500/5',
  },
  {
    icon: '📧',
    name: 'Email Agent',
    color: 'from-pink-500/20 to-pink-500/5',
  },
  {
    icon: '💬',
    name: 'Chat Agent',
    color: 'from-lime-500/20 to-lime-500/5',
  },
  {
    icon: '🎨',
    name: 'Image Agent',
    color: 'from-blue-500/20 to-blue-500/5',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Agents() {
  return (
    <section id="agents" className="py-20 px-4 md:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful AI Agents</h2>
          <p className="text-xl text-muted-foreground">At Your Fingertips</p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          {agents.map((agent) => (
            <motion.div
              key={agent.name}
              variants={item}
              whileHover={{ y: -8 }}
              className={`group relative bg-gradient-to-br ${agent.color} border border-accent/20 hover:border-accent/40 rounded-xl p-6 cursor-pointer transition-all duration-300`}
            >
              {agent.badge && (
                <div className="absolute top-2 right-2 text-xs font-semibold bg-accent/20 text-accent px-2 py-1 rounded-full">
                  {agent.badge}
                </div>
              )}
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{agent.icon}</div>
              <h3 className="font-semibold text-foreground">{agent.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">Specialized AI capabilities</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
