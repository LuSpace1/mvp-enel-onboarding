import { motion, useReducedMotion } from 'motion/react'

import { track } from '@/lib/analytics'
import { clsx } from 'clsx'

import { useViajeStore } from '@/store/useViajeStore'
import { PASOS_VIAJE } from '@/lib/data/viaje'

import logoEnel from '@/assets/icons/Enel_Group_logo.svg'

interface NavItem {
  id: string
  etiqueta: string
}

const ITEMS: NavItem[] = [
  { id: 'portada', etiqueta: 'Inicio' },
  { id: 'historia', etiqueta: 'Historia' },
  { id: 'cultura', etiqueta: 'Cultura' },
  { id: 'organigrama', etiqueta: 'Equipos' },
  { id: 'mapa', etiqueta: 'Concesión' },
  { id: 'cadena', etiqueta: 'Cadena' },
  { id: 'politicas', etiqueta: 'Políticas' },
  { id: 'galerias', etiqueta: 'Galerías' },
  { id: 'cierre', etiqueta: 'Cierre' },
]

export function Nav() {
  const reduce = useReducedMotion()
  const pasoActual = useViajeStore((estado) => estado.pasoActual)
  const navegar = useViajeStore((estado) => estado.navegar)

  const indiceActual = PASOS_VIAJE.findIndex((paso) => paso.id === pasoActual)
  const progreso = pasoActual === 'portada' ? 0 : (indiceActual + 1) / PASOS_VIAJE.length

  return (
    <header className="border-enel-fog/70 fixed inset-x-0 top-0 z-40 h-16 border-b bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-5 md:px-8">
        <button
          type="button"
          onClick={() => {
            navegar('portada')
            track('nav.inicio')
          }}
          className="flex items-center gap-2"
          aria-label="Volver al inicio"
        >
          <img src={logoEnel} alt="Logo Enel" className="mr-1 h-8 w-auto" />
          <span className="flex flex-col leading-tight">
            <span className="text-enel-navy text-sm font-semibold tracking-tight">
              Enel Distribución
            </span>
            <span className="text-[10px] font-medium tracking-[0.18em] text-neutral-500 uppercase">
              Portal Interactivo
            </span>
          </span>
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {ITEMS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  navegar(item.id)
                  track('nav.clic', { paso: item.id })
                }}
                className={clsx(
                  'rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                  pasoActual === item.id
                    ? 'bg-enel-red/10 text-enel-red'
                    : 'hover:text-enel-navy text-neutral-600',
                )}
                aria-current={pasoActual === item.id ? 'page' : undefined}
              >
                {item.etiqueta}
              </button>
            </li>
          ))}
        </ul>

        <span className="border-enel-fog hidden items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-neutral-500 uppercase sm:flex">
          <span className="bg-enel-red h-1.5 w-1.5 rounded-full" />
          Experiencia interactiva
        </span>
      </nav>

      {!reduce && (
        <motion.div
          className="bg-enel-pink absolute inset-x-0 bottom-0 h-0.5 origin-left"
          initial={false}
          animate={{ scaleX: progreso }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
    </header>
  )
}
