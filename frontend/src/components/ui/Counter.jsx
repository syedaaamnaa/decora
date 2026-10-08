import useCountUp from '@/hooks/useCountUp'

/**
 * Animated statistic number — counts up when scrolled into view.
 */
export default function Counter({ value, suffix = '', duration = 2200, className = '' }) {
  const { ref, value: current } = useCountUp(value, { duration })

  return (
    <span ref={ref} className={className}>
      {current}
      {suffix}
    </span>
  )
}
