'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const pricingPlans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: ['100 workflow runs/month', '5 agents', 'Basic analytics', 'Community support'],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 29,
    description: 'For growing teams',
    features: ['Unlimited workflows', 'All agents', 'Advanced analytics', 'Priority support', 'Custom integrations'],
    cta: 'Start 14-Day Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: ['Everything + custom agents', 'Dedicated support', 'SLA guarantee', 'On-premise deployment'],
    cta: 'Contact Sales',
    highlighted: false,
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

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section id="pricing" className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-xl text-muted-foreground mb-8">Choose the perfect plan for your needs</p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isYearly ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-secondary"
            >
              <motion.span
                className="inline-block h-6 w-6 transform rounded-full bg-accent"
                animate={{ x: isYearly ? 28 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            </button>
            <span className={`text-sm ${isYearly ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
              Yearly <span className="text-accent">(Save 20%)</span>
            </span>
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={item}
              whileHover={{ y: -8 }}
              className={`relative border rounded-2xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? 'border-accent bg-gradient-to-br from-accent/10 to-accent/5 ring-1 ring-accent'
                  : 'border-accent/20 bg-secondary/30'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-accent text-background text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-5xl font-bold">${plan.price}</span>
                {typeof plan.price === 'number' && <span className="text-muted-foreground">/month</span>}
              </div>

              <Link href="/auth/sign-up" className="block mb-6">
                <Button
                  className="w-full"
                  variant={plan.highlighted ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
