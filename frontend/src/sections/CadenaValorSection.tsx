import { useRef } from 'react'
import { ArrowRight } from '@phosphor-icons/react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

import { etapasCadena } from '@/lib/data/organizacion'

const ETIQUETAS_ETAPA: Record<string, string> = {
  customer: 'Relación con el cliente',
  strategy: 'Estrategia',
  supply: 'Abastecimiento',
  engineering: 'Ingeniería',
  construction: 'Construcción y operación',
  cash: 'Servicio a cliente',
}

function EtapaCard({ indice }: { indice: number }) {
  const etapa = etapasCadena[indice]
  if (!etapa) return null
  return (
    <article
      className="group border-enel-fog hover:border-enel-red/40 hover:shadow-enel-red/10 relative flex h-64 w-full flex-col justify-between overflow-hidden rounded-2xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl"
      data-analytics-component="cadena-valor"
      data-analytics-etapa={etapa.id}
    >
      <span className="text-enel-fog/70 group-hover:text-enel-red/15 absolute -top-5 -right-3 text-[88px] leading-none font-semibold transition-colors">
        {String(indice + 1).padStart(2, '0')}
      </span>
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
  const contenedor = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: contenedor })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-78%'])

  return (
    <section id="cadena" className="bg-white">
      <div className="mx-auto w-full max-w-6xl px-5 pt-20 md:px-8 md:pt-28">
        <div className="max-w-2xl">
          <h2 className="text-enel-navy text-3xl font-semibold tracking-tight md:text-5xl">
            Cómo creamos valor, de punta a punta
          </h2>
          <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-neutral-600 md:text-lg">
            Seis etapas que llevan la energía desde la estrategia hasta el cliente, en un recorrido
            continuo de creación de valor.
          </p>
        </div>
      </div>

      <div ref={contenedor} className="relative mt-10 h-[300vh]">
        <div className="sticky top-16 flex h-[calc(100dvh-4rem)] flex-col justify-center overflow-hidden">
          {reduce ? (
            <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 md:px-8">
              {etapasCadena.map((etapa, indice) => (
                <div key={etapa.id} className="w-[min(85vw,420px)] shrink-0 snap-start">
                  <EtapaCard indice={indice} />
                </div>
              ))}
            </div>
          ) : (
            <motion.div className="flex gap-5 px-5 will-change-transform md:px-8" style={{ x }}>
              {etapasCadena.map((etapa, indice) => (
                <div key={etapa.id} className="w-[min(85vw,420px)] shrink-0">
                  <EtapaCard indice={indice} />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
