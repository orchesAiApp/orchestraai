'use client'

interface CounterProps {
  target: number
  suffix?: string
}

export default function Counter({ target, suffix = '' }: CounterProps) {
  const formatted =
    suffix === '%'
      ? target.toFixed(1)
      : target.toLocaleString()

  return (
    <span>
      {formatted}
      {suffix}
    </span>
  )
}
