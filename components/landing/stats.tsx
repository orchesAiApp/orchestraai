'use client'

import { motion } from 'framer-motion'
import Counter from './counter'

interface StatItem {
  target: number
  label: string
  suffix: string
}

const stats: StatItem[] = [
  { target: 10000, label: 'Active Users', suffix: '+' },
  { target: 500000, label: 'Workflows Created', suffix: '+' },
  { target: 50000000, label: 'Tasks Completed', suffix: '+' },
  { target: 99.9, label: 'Uptime', suffix: '%' },
]

export default function Stats() {
  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-accent/5 via-background to-accent/5 border-y border-accent/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                <Counter target={stat.target} suffix={stat.suffix} />
              </div>
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
