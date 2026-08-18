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

const ESTILOS_ETAPA: Record<string, { circulo: string; tag: string; glow: string }> = {
  customer: {
    circulo: 'bg-enel-blue text-white',
    tag: 'bg-enel-blue/10 text-enel-blue',
    glow: 'bg-enel-blue/25',
  },
  strategy: {
    circulo: 'bg-violet-600 text-white',
    tag: 'bg-violet-600/10 text-violet-700',
    glow: 'bg-violet-500/25',
  },
  supply: {
    circulo: 'bg-emerald-500 text-white',
    tag: 'bg-emerald-500/10 text-emerald-700',
    glow: 'bg-emerald-400/25',
  },
  engineering: {
    circulo: 'bg-sky-500 text-white',
    tag: 'bg-sky-500/10 text-sky-700',
    glow: 'bg-sky-400/25',
  },
  construction: {
    circulo: 'bg-amber-500 text-white',
    tag: 'bg-amber-500/10 text-amber-700',
    glow: 'bg-amber-400/30',
  },
  cash: {
    circulo: 'bg-enel-pink text-white',
    tag: 'bg-enel-pink/10 text-enel-pink',
    glow: 'bg-enel-pink/25',
  },
}

const ESTILO_DEFAULT: { circulo: string; tag: string; glow: string } = {
  circulo: 'bg-enel-blue text-white',
  tag: 'bg-enel-blue/10 text-enel-blue',
  glow: 'bg-enel-blue/25',
}

function EtapaCard({ etapa }: { etapa: EtapaCadena }) {
  const Icono = ICONOS_ETAPA[etapa.id] ?? ArrowRight
  const estilo = ESTILOS_ETAPA[etapa.id] ?? ESTILO_DEFAULT
  return (
    <article
      data-card
      data-analytics-component="cadena-valor"
      data-analytics-etapa={etapa.id}
      className="group border-enel-fog relative isolate flex h-full w-[300px] flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-[0_18px_40px_-28px_rgba(20,20,19,0.35)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_28px_56px_-30px_rgba(20,20,19,0.5)] active:scale-[0.98] md:w-[340px]"
    >
      <div
        aria-hidden="true"
        className={clsx(
          'pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl',
          estilo.glow,
        )}
      />
      <div className="relative flex h-14 items-center justify-between">
        <span
          className={clsx(
            'relative flex h-12 w-12 items-center justify-center rounded-full shadow-[0_10px_22px_-10px_rgba(20,20,19,0.5)]',
            estilo.circulo,
          )}
        >
          <Icono size={26} weight="fill" />
          <span
            aria-hidden="true"
            className={clsx(
              'absolute -inset-1.5 -z-10 rounded-full opacity-40 blur-md',
              estilo.glow,
            )}
          />
        </span>
        <span aria-hidden="true" className={clsx('h-3 w-3 rotate-45 rounded-[3px]', estilo.tag)} />
      </div>

      <h3 className="text-enel-navy mt-5 text-xl leading-snug font-semibold tracking-tight md:text-2xl">
        {etapa.titulo}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{etapa.descripcion}</p>

      <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
        {etapa.actividades.map((actividad) => (
          <li
            key={actividad}
            className={clsx(
              'rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-200',
              estilo.tag,
            )}
          >
            {actividad}
          </li>
        ))}
      </ul>
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
    el.scrollBy({ left: direccion * (ancho + 46), behavior: 'smooth' })
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
      <div
        ref={carruselRef}
        className="no-scrollbar relative z-10 mt-12 overflow-x-auto pt-6 pb-24"
      >
        <div className="animate-float-cadena relative flex w-max snap-x snap-proximity items-stretch px-5 md:px-[calc(max(0px,50vw-36rem)+2rem)]">
          {/* Línea de cadena que une los iconos de cada etapa */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-5 top-[3rem] h-[3px] md:inset-x-[calc(max(0px,50vw-36rem)+2rem)]"
          >
            <div className="cadena-dashes absolute inset-x-0 top-0 h-[2px]" />
            <div className="cadena-corriente absolute inset-x-0 -top-px h-[3px]" />
            <span className="cadena-chispa" />
            <span className="cadena-chispa" style={{ animationDelay: '0.73s' }} />
            <span className="cadena-chispa" style={{ animationDelay: '1.47s' }} />
          </div>
          {etapasCadena.map((etapa, indice) => {
            const siguiente = etapasCadena[indice + 1]
            return (
              <div key={etapa.id} className="flex items-stretch gap-4">
                <motion.div
                  className="shrink-0 snap-start"
                  initial={reduce ? false : { opacity: 0, y: 48, scale: 0.95 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
                  viewport={{ root: carruselRef, amount: 0.3, once: false }}
                  transition={{ type: 'spring', stiffness: 150, damping: 16, mass: 0.9 }}
                >
                  <EtapaCard etapa={etapa} />
                </motion.div>
                {siguiente && (
                  <span
                    aria-hidden="true"
                    className="mt-[2.6rem] flex shrink-0 items-start self-start"
                  >
                    <span
                      className={clsx(
                        'animate-nodo-pulso h-3.5 w-3.5 rounded-full border-2 border-white',
                        ESTILOS_ETAPA[siguiente.id]?.circulo ?? 'bg-enel-blue',
                      )}
                      style={{ animationDelay: `${indice * 0.3}s` }}
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
