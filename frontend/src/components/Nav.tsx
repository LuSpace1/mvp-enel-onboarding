import { Lightning } from '@phosphor-icons/react'
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react'

import { track } from '@/lib/analytics'
import { clsx } from 'clsx'

import { useActiveSection } from '@/hooks/useActiveSection'

interface NavItem {
  id: string
  etiqueta: string
}

const ITEMS: NavItem[] = [
  { id: 'inicio', etiqueta: 'Inicio' },
  { id: 'historia', etiqueta: 'Historia' },
  { id: 'organigrama', etiqueta: 'Organización' },
  { id: 'mapa', etiqueta: 'Concesión' },
  { id: 'cadena', etiqueta: 'Cadena' },
  { id: 'politicas', etiqueta: 'Políticas' },
  { id: 'galerias', etiqueta: 'Galerías' },
  { id: 'cierre', etiqueta: 'Cierre' },
]

export function Nav() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progreso = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const activa = useActiveSection({ ids: ITEMS.map((item) => item.id) })

  return (
    <header className="border-enel-fog/70 fixed inset-x-0 top-0 z-40 h-16 border-b bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-5 md:px-8">
        <a
          href="#inicio"
          className="flex items-center gap-2"
          onClick={() => track('nav.inicio')}
          aria-label="Volver al inicio"
        >
          <span className="bg-enel-red flex h-8 w-8 items-center justify-center rounded-md text-white">
            <Lightning size={20} weight="fill" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-enel-navy text-sm font-semibold tracking-tight">
              Enel Distribución
            </span>
            <span className="text-[10px] font-medium tracking-[0.18em] text-neutral-500 uppercase">
              Portal Interactivo
            </span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => track('nav.clic', { seccion: item.id })}
                className={clsx(
                  'rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                  activa === `#${item.id}`
                    ? 'bg-enel-red/10 text-enel-red'
                    : 'hover:text-enel-navy text-neutral-600',
                )}
                aria-current={activa === `#${item.id}` ? 'page' : undefined}
              >
                {item.etiqueta}
              </a>
            </li>
          ))}
        </ul>

        <span className="border-enel-fog hidden items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-neutral-500 uppercase sm:flex">
          <span className="bg-enel-red h-1.5 w-1.5 rounded-full" />
          Máxima interactivo
        </span>
      </nav>

      {!reduce && (
        <motion.div
          className="bg-enel-red absolute inset-x-0 bottom-0 h-0.5 origin-left"
          style={{ scaleX: progreso }}
        />
      )}
    </header>
  )
}
