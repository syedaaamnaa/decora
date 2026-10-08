import Reveal from './Reveal'

/**
 * Consistent section header: bronze eyebrow + display title + lead text.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
  children,
}) {
  const centered = align === 'center'
  // Respect caller overrides instead of fighting Tailwind's stylesheet order.
  const spacing = /\bmb-/.test(className) ? '' : 'mb-12 md:mb-16'
  const width = /\bmax-w-/.test(className) ? '' : 'max-w-3xl'

  return (
    <div className={`${width} ${centered ? 'mx-auto text-center' : ''} ${spacing} ${className}`}>
      {eyebrow && (
        <Reveal>
          <span className={`eyebrow ${centered ? 'eyebrow-center' : ''}`}>{eyebrow}</span>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2 className="heading-lg mt-5 text-balance">{title}</h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p className={`lead mt-5 ${centered ? 'mx-auto' : ''} max-w-2xl`}>{description}</p>
        </Reveal>
      )}
      {children && <Reveal delay={0.24}>{children}</Reveal>}
    </div>
  )
}
