import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

interface Props {
  as?: ElementType
  delay?: number // ms, for staggering items in a list
  className?: string
  style?: CSSProperties
  children: ReactNode
  [key: string]: unknown
}

/** Fades and slides its content in when it scrolls into view. Without JavaScript or with reduced motion it is simply visible. */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }: Props) {
  const { ref, inView } = useInView<HTMLElement>()
  return (
    <Tag ref={ref} className={`reveal ${inView ? 'in' : ''} ${className}`} style={{ ...style, ['--d' as string]: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}
