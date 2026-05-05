'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function CTA() {
  return (
    <section className="py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-background to-accent/10 blur-3xl" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Build Your First Workflow?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start building intelligent AI workflows today. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Link href="/auth/sign-up" className="inline-block w-full sm:w-auto">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 bg-accent hover:bg-accent/90 text-background w-full">
                Get Started Free
              </button>
            </Link>
            <Button size="lg" variant="outline" className="border-accent/30 hover:border-accent/60 bg-transparent">
              View Documentation
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">No credit card required • Start for free today</p>
        </motion.div>
      </div>
    </section>
  )
}
