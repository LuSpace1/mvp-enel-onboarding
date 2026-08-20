import { Fragment, useCallback, useState } from 'react'
import {
  ArrowRight,
  Compass,
  HandCoins,
  HardHat,
  Headset,
  Package,
  Wrench,
  type Icon,
} from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'

import { etapasCadena } from '@/lib/data/organizacion'
import type { EtapaCadena } from '@/types/api'
import { clsx } from 'clsx'

const ICONOS_ETAPA: Record<string, Icon> = {
  customer: Headset,
  strategy: Compass,
  supply: Package,
  engineering: Wrench,
  construction: HardHat,
  cash: HandCoins,
}

/* Colores del gradiente oficial de la marca Enel, un color por etapa.
   Se usan con moderación: solo en el nodo del ícono y en los detalles. */
const COLORES_ETAPA: Record<string, { icono: string; dot: string; nodo: string }> = {
  customer: {
    icono: 'bg-enel-rojo/10 text-enel-rojo group-hover:bg-enel-rojo group-hover:text-white',
    dot: 'bg-enel-rojo/60',
    nodo: 'bg-enel-rojo',
  },
  strategy: {
    icono:
      'bg-enel-naranja/10 text-enel-naranja group-hover:bg-enel-naranja group-hover:text-white',
    dot: 'bg-enel-naranja/60',
    nodo: 'bg-enel-naranja',
  },
  supply: {
    icono: 'bg-enel-blue/10 text-enel-blue group-hover:bg-enel-blue group-hover:text-white',
    dot: 'bg-enel-blue/60',
    nodo: 'bg-enel-blue',
  },
  engineering: {
    icono:
      'bg-enel-celeste/10 text-enel-celeste group-hover:bg-enel-celeste group-hover:text-white',
    dot: 'bg-enel-celeste/60',
    nodo: 'bg-enel-celeste',
  },
  construction: {
    icono: 'bg-enel-verde/10 text-enel-verde group-hover:bg-enel-verde group-hover:text-white',
    dot: 'bg-enel-verde/60',
    nodo: 'bg-enel-verde',
  },
  cash: {
    icono: 'bg-enel-pink/10 text-enel-pink group-hover:bg-enel-pink group-hover:text-white',
    dot: 'bg-enel-pink/60',
    nodo: 'bg-enel-pink',
  },
}

const ESTILO_DEFAULT: { icono: string; dot: string; nodo: string } = {
  icono: 'bg-enel-blue/10 text-enel-blue group-hover:bg-enel-blue group-hover:text-white',
  dot: 'bg-enel-blue/60',
  nodo: 'bg-enel-blue',
}

function EtapaFila({
  etapa,
  indice,
  abierta,
  ultima,
  onToggle,
}: {
  etapa: EtapaCadena
  indice: number
  abierta: boolean
  ultima: boolean
  onToggle: () => void
}) {
  const Icono = ICONOS_ETAPA[etapa.id] ?? ArrowRight
  const estilo = COLORES_ETAPA[etapa.id] ?? ESTILO_DEFAULT
  return (
    <article
      className={clsx(
        'group rounded-2xl px-3 transition-colors duration-300 ease-out md:px-5',
        !ultima && 'border-enel-navy/10 border-b',
        abierta ? 'bg-white' : 'hover:bg-white/60',
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={abierta}
        aria-controls={`cadena-detalle-${etapa.id}`}
        data-analytics-component="cadena-valor"
        data-analytics-etapa={etapa.id}
        className="grid w-full cursor-pointer grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-4 py-6 text-left md:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1fr)_auto] md:gap-x-8 md:py-8"
      >
        <span className="text-sm font-medium tracking-tight text-neutral-400 tabular-nums">
          {String(indice + 1).padStart(2, '0')}
        </span>

        <span className="min-w-0">
          <h3 className="text-enel-navy text-2xl font-medium tracking-tight md:text-3xl">
            {etapa.titulo}
          </h3>
          <p className="mt-1 text-sm leading-snug text-neutral-500 md:hidden">
            {etapa.descripcion}
          </p>
        </span>

        <p className="hidden max-w-sm text-[15px] leading-snug text-neutral-500 md:block">
          {etapa.descripcion}
        </p>

        <span
          className={clsx(
            'border-enel-navy/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-white transition-transform duration-300 ease-out group-hover:translate-x-1',
            abierta && 'rotate-90',
          )}
        >
          <ArrowRight size={16} weight="bold" className="text-enel-navy" />
        </span>
      </button>

      <div
        id={`cadena-detalle-${etapa.id}`}
        className={clsx(
          'grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          abierta ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0 overflow-hidden" aria-hidden={!abierta}>
          <div className="pr-2 pb-8 pl-10 md:pb-12 md:pl-[5.5rem]">
            <div className="flex items-start gap-4">
              <span
                className={clsx(
                  'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                  estilo.icono,
                )}
              >
                <Icono size={18} weight="regular" />
              </span>
              <div>
                <p className="max-w-2xl text-[15px] leading-relaxed text-neutral-600">
                  {etapa.detalle}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2.5">
                  {etapa.actividades.map((actividad) => (
                    <li
                      key={actividad}
                      className="border-enel-navy/10 flex items-center gap-2 rounded-full border bg-white px-4 py-1.5 text-[13px] font-medium text-neutral-600"
                    >
                      <span className={clsx('h-1.5 w-1.5 shrink-0 rounded-full', estilo.dot)} />
                      {actividad}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export function CadenaValorSection() {
  const reduce = useReducedMotion()
  const [activa, setActiva] = useState<string | null>('customer')

  const toggle = useCallback((id: string) => {
    setActiva((prev) => (prev === id ? null : id))
  }, [])

  return (
    <section id="cadena" className="relative overflow-hidden bg-[#f0eee6]">
      <motion.div
        className="relative z-10 mx-auto w-full max-w-5xl px-5 pt-12 md:px-8 md:pt-16"
        initial={reduce ? false : { opacity: 0, y: 32 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-enel-navy text-3xl font-semibold tracking-tight md:text-5xl">
              Cómo creamos valor, de punta a punta
            </h2>
            <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-neutral-600 md:text-lg">
              Seis etapas que llevan la energía desde la estrategia hasta el cliente.
            </p>
          </div>
        </div>

        {/* Línea de cadena: nodos clickeables conectados por flujo animado */}
        <div className="mt-12 hidden items-center md:flex">
          {etapasCadena.map((etapa, indice) => {
            const siguiente = etapasCadena[indice + 1]
            return (
              <Fragment key={etapa.id}>
                <button
                  type="button"
                  onClick={() => toggle(etapa.id)}
                  aria-label={`Ir a ${etapa.titulo}`}
                  aria-pressed={activa === etapa.id}
                  className={clsx(
                    'h-3.5 w-3.5 shrink-0 cursor-pointer rounded-full transition-all duration-300 ease-out',
                    COLORES_ETAPA[etapa.id]?.nodo ?? 'bg-enel-blue',
                    activa === etapa.id
                      ? 'scale-125 ring-4 ring-white'
                      : 'opacity-60 hover:scale-125 hover:opacity-100',
                  )}
                />
                {siguiente && <div className="cadena-flujo mx-3 h-[3px] flex-1 opacity-40" />}
              </Fragment>
            )
          })}
        </div>

        <div className="mt-6 md:mt-4">
          {etapasCadena.map((etapa, indice) => (
            <motion.div
              key={etapa.id}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: indice * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <EtapaFila
                etapa={etapa}
                indice={indice}
                abierta={activa === etapa.id}
                ultima={indice === etapasCadena.length - 1}
                onToggle={() => toggle(etapa.id)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
