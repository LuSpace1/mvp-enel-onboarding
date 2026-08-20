import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  CaretLeft,
  CaretRight,
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
    icono: 'bg-enel-naranja/10 text-enel-naranja group-hover:bg-enel-naranja group-hover:text-white',
    dot: 'bg-enel-naranja/60',
    nodo: 'bg-enel-naranja',
  },
  supply: {
    icono: 'bg-enel-blue/10 text-enel-blue group-hover:bg-enel-blue group-hover:text-white',
    dot: 'bg-enel-blue/60',
    nodo: 'bg-enel-blue',
  },
  engineering: {
    icono: 'bg-enel-celeste/10 text-enel-celeste group-hover:bg-enel-celeste group-hover:text-white',
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

function EtapaCard({ etapa }: { etapa: EtapaCadena }) {
  const Icono = ICONOS_ETAPA[etapa.id] ?? ArrowRight
  const estilo = COLORES_ETAPA[etapa.id] ?? ESTILO_DEFAULT
  return (
    <article
      data-card
      data-analytics-component="cadena-valor"
      data-analytics-etapa={etapa.id}
      className="group border-enel-fog/70 relative flex h-full w-[300px] flex-col rounded-2xl border bg-white p-6 shadow-[0_12px_28px_-24px_rgba(20,20,19,0.3)] transition-[border-color,box-shadow] duration-300 ease-out hover:border-enel-blue/40 hover:shadow-[0_20px_40px_-28px_rgba(20,20,19,0.35)] active:scale-[0.98] md:w-[340px]"
    >
      <span
        className={clsx(
          'flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300',
          estilo.icono,
        )}
      >
        <Icono size={20} weight="regular" />
      </span>

      <h3 className="text-enel-navy mt-5 text-xl leading-snug font-semibold tracking-tight md:text-2xl">
        {etapa.titulo}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{etapa.descripcion}</p>

      <div className="mt-auto pt-6">
        <div className="border-enel-fog/70 border-t" />
        <ul className="mt-4 space-y-2.5">
          {etapa.actividades.map((actividad) => (
            <li
              key={actividad}
              className="flex items-start gap-2.5 text-[13px] leading-snug text-neutral-600"
            >
              <span
                className={clsx('mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full', estilo.dot)}
              />
              {actividad}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export function CadenaValorSection() {
  const reduce = useReducedMotion()
  const carruselRef = useRef<HTMLDivElement>(null)
  const [puedeIzq, setPuedeIzq] = useState(false)
  const [puedeDer, setPuedeDer] = useState(true)

  const actualizarControles = useCallback(() => {
    const el = carruselRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setPuedeIzq(el.scrollLeft > 8)
    setPuedeDer(el.scrollLeft < maxScroll - 8)
  }, [])

  useEffect(() => {
    const el = carruselRef.current
    if (!el) return
    actualizarControles()
    const observador = new ResizeObserver(actualizarControles)
    observador.observe(el)
    el.addEventListener('scroll', actualizarControles, { passive: true })
    window.addEventListener('resize', actualizarControles)
    return () => {
      observador.disconnect()
      el.removeEventListener('scroll', actualizarControles)
      window.removeEventListener('resize', actualizarControles)
    }
  }, [actualizarControles])

  const desplazar = useCallback((direccion: 1 | -1) => {
    const el = carruselRef.current
    if (!el) return
    const ancho = el.querySelector<HTMLElement>('[data-card]')?.offsetWidth ?? 340
    el.scrollBy({ left: direccion * (ancho + 48), behavior: 'smooth' })
  }, [])

  return (
    <section id="cadena" className="relative overflow-hidden bg-[#f0eee6]">
      {/* Fondo Cuadernillo Global */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: 'radial-gradient(rgba(10, 25, 47, 0.35) 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
        }}
      />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-24 md:px-8 md:pt-32"
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

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => desplazar(-1)}
              disabled={!puedeIzq}
              aria-label="Etapa anterior"
              className="border-enel-fog hover:border-enel-blue hover:text-enel-blue disabled:border-enel-navy/10 disabled:text-enel-navy/25 text-enel-navy flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-white transition-[border-color,color,transform] duration-300 ease-out active:scale-90 disabled:cursor-not-allowed"
            >
              <CaretLeft size={16} weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => desplazar(1)}
              disabled={!puedeDer}
              aria-label="Siguiente etapa"
              className="border-enel-fog hover:border-enel-blue hover:text-enel-blue disabled:border-enel-navy/10 disabled:text-enel-navy/25 text-enel-navy flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-white transition-[border-color,color,transform] duration-300 ease-out active:scale-90 disabled:cursor-not-allowed"
            >
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Carrusel Horizontal de Navegación Manual */}
      <div ref={carruselRef} className="no-scrollbar relative z-10 mt-12 overflow-x-auto pb-24 pt-6">
        <div className="relative flex w-max snap-x snap-proximity items-stretch px-5 md:px-[calc(max(0px,50vw-36rem)+2rem)]">
          {/* Línea de cadena: base punteada + flujo animado hacia el cliente */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-5 top-[2.875rem] md:inset-x-[calc(max(0px,50vw-36rem)+2rem)]"
          >
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-neutral-300" />
            <div className="cadena-flujo absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2" />
          </div>
          {etapasCadena.map((etapa, indice) => {
            const siguiente = etapasCadena[indice + 1]
            return (
              <div key={etapa.id} className="flex items-stretch gap-8">
                <motion.div
                  className="shrink-0 snap-start"
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ root: carruselRef, amount: 0.25, once: true }}
                  transition={{ duration: 0.5, delay: indice * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <EtapaCard etapa={etapa} />
                </motion.div>
                {siguiente && (
                  <span
                    aria-hidden="true"
                    className="mt-[2.5rem] flex shrink-0 items-start self-start"
                  >
                    <span
                      className={clsx(
                        'h-3 w-3 rounded-full border-2 border-white shadow-sm',
                        COLORES_ETAPA[siguiente.id]?.nodo ?? 'bg-enel-blue',
                      )}
                    />
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}