'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqItems = [
  {
    question: 'What is OrchestraAi?',
    answer: 'OrchestraAi is an AI agent orchestration platform that lets you build, deploy, and manage intelligent workflows. Connect multiple AI agents to automate complex tasks with a visual, drag-and-drop interface.',
  },
  {
    question: 'How do I get started?',
    answer: 'Simply sign up for a free account, choose from our pre-built agents, and start creating workflows. Our interactive builder makes it easy even for non-technical users.',
  },
  {
    question: 'Can I integrate with my existing tools?',
    answer: 'Yes! OrchestraAi supports webhook integrations and has connectors for popular services. You can also build custom integrations using our API.',
  },
  {
    question: 'What are the pricing options?',
    answer: 'We offer a free tier with 100 workflow runs per month, a Pro plan at $29/month for unlimited workflows, and custom Enterprise plans.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we use enterprise-grade encryption and comply with GDPR, SOC 2, and other security standards. Your data is always protected.',
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'We offer email support for all plans, priority support for Pro users, and dedicated support for Enterprise customers.',
  },
  {
    question: 'Can I try OrchestraAi before paying?',
    answer: 'Absolutely! Our free tier gives you full access to the platform. Pro users also get a 14-day free trial.',
  },
  {
    question: 'How many agents can I use?',
    answer: 'Our free tier includes 5 pre-built agents. Pro and Enterprise plans include access to all available agents plus the ability to create custom ones.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground">Find answers to common questions</p>
        </motion.div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="border border-accent/20 rounded-lg overflow-hidden bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
              >
                <span className="font-semibold text-foreground">{item.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-accent" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-accent/20 px-6 py-4"
                  >
                    <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
