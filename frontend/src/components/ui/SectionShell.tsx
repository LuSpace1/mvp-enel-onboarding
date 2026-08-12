import type { PropsWithChildren } from 'react'

import { clsx } from 'clsx'

interface SectionShellProps {
  id?: string
  className?: string
  innerClassName?: string
}

export function SectionShell({
  id,
  className,
  innerClassName,
  children,
}: PropsWithChildren<SectionShellProps>) {
  return (
    <section id={id} className={clsx('relative overflow-hidden py-14 md:py-20', className)}>
      <div className={clsx('mx-auto w-full max-w-6xl px-5 md:px-8', innerClassName)}>
        {children}
      </div>
    </section>
  )
}
