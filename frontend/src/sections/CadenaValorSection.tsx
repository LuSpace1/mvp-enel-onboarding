import { ArrowRight } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'

import { etapasCadena } from '@/lib/data/organizacion'

const ETIQUETAS_ETAPA: Record<string, string> = {
  customer: 'Relación con el cliente',
  strategy: 'Estrategia',
  supply: 'Abastecimiento',
  engineering: 'Ingeniería',
  construction: 'Construcción y operación',
  cash: 'Servicio a cliente',
}

const ETAPAS_CADENA_DOBLES = [...etapasCadena, ...etapasCadena]

function EtapaCard({ indice }: { indice: number }) {
  const etapa = etapasCadena[indice]
  if (!etapa) return null
  return (
    <article
      className="group border-enel-fog hover:border-enel-red/40 hover:shadow-enel-red/10 relative flex h-64 w-full flex-col justify-between overflow-hidden rounded-2xl border bg-white p-6 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      style={{ animation: 'float-subtle 4s ease-in-out infinite' }}
      data-analytics-component="cadena-valor"
      data-analytics-etapa={etapa.id}
    >
      <div>
        <h3 className="text-enel-navy text-lg leading-snug font-semibold tracking-tight md:text-2xl">
          {etapa.titulo}
        </h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-600">
          {etapa.descripcion}
        </p>
      </div>
      <span className="text-enel-red flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] uppercase">
        {ETIQUETAS_ETAPA[etapa.id] ?? `Etapa ${indice + 1}`}
        <ArrowRight
          size={14}
          weight="bold"
          className="transition-transform group-hover:translate-x-1"
        />
      </span>
    </article>
  )
}

export function CadenaValorSection() {
  const reduce = useReducedMotion()

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
        initial={reduce ? false : { opacity: 0, x: 250 }}
        whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ type: 'spring', stiffness: 40, damping: 16, mass: 1.3 }}
      >
        <div className="max-w-2xl">
          <h2 className="text-enel-navy text-3xl font-semibold tracking-tight md:text-5xl">
            Cómo creamos valor, de punta a punta
          </h2>
          <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-neutral-600 md:text-lg">
            Seis etapas que llevan la energía desde la estrategia hasta el cliente, en un recorrido
            continuo de creación de valor.
          </p>
        </div>
      </motion.div>

      {/* Carrusel Horizontal Infinito (Marquee) */}
      <motion.div
        className="relative z-10 mx-auto mt-16 w-full max-w-[80vw] overflow-hidden pt-10 pb-28"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        }}
        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
        whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
      >
        <div className="animate-cadena-scroll flex w-max gap-8 px-4 hover:[animation-play-state:paused]">
          {ETAPAS_CADENA_DOBLES.map((etapa, idx) => (
            <div
              key={`${etapa.id}-${idx}`}
              className="animate-float-card w-[320px] shrink-0 md:w-[380px]"
              style={{ animationDelay: `${(idx % 2) * 1.5}s` }}
            >
              <EtapaCard indice={idx % etapasCadena.length} />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
