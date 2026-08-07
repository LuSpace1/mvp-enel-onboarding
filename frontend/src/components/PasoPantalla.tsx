import type { PropsWithChildren } from 'react'
import { ArrowLeft, ArrowRight, MapTrifold } from '@phosphor-icons/react'
import { motion } from 'motion/react'

import type { PasoViaje } from '@/lib/data/viaje'
import { PASOS_VIAJE } from '@/lib/data/viaje'
import { useViajeStore } from '@/store/useViajeStore'
import { track } from '@/lib/analytics'
import { clsx } from 'clsx'

const TIPO_LABEL: Record<PasoViaje['tipo'], string> = {
  editorial: 'Capítulo',
  reto: 'Reto',
}

export function PasoHeader({ paso }: { paso: PasoViaje }) {
  const navegar = useViajeStore((estado) => estado.navegar)

  return (
    <div className="border-enel-fog/70 sticky top-16 z-20 border-b bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-3 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={clsx(
              'shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.14em] uppercase',
              paso.tipo === 'reto'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-enel-red/10 text-enel-red',
            )}
          >
            {TIPO_LABEL[paso.tipo]}
          </span>
          <h1 className="text-enel-navy truncate text-sm font-semibold tracking-tight md:text-base">
            {paso.nombre}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => {
            navegar('portada')
            track('paso.abrir.mapa', { paso: paso.id })
          }}
          className="hover:bg-enel-mist inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-neutral-600 transition"
        >
          <MapTrifold size={15} weight="duotone" />
          Mapa del viaje
        </button>
      </div>
    </div>
  )
}

export function PasoPantalla({ paso, children }: PropsWithChildren<{ paso: PasoViaje }>) {
  const irAnterior = useViajeStore((estado) => estado.irAnterior)
  const irSiguiente = useViajeStore((estado) => estado.irSiguiente)
  const visitados = useViajeStore((estado) => estado.visitados)

  const indice = PASOS_VIAJE.findIndex((item) => item.id === paso.id)
  const esInicioDeViaje = indice === 0
  const esReto = paso.tipo === 'reto'

  return (
    <div data-analytics-paso={paso.id}>
      <div>{children}</div>

      <div className="border-enel-fog bg-enel-mist/60 border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <button
            type="button"
            onClick={() => {
              irAnterior()
              track('paso.anterior', { paso: paso.id })
            }}
            className="border-enel-fog text-enel-navy hover:border-enel-navy/30 inline-flex h-11 items-center gap-2 rounded-full border bg-white px-5 text-sm font-semibold transition-colors duration-150 will-change-transform active:scale-[0.97]"
          >
            <ArrowLeft size={16} weight="bold" />
            {esInicioDeViaje ? 'Mapa del viaje' : 'Anterior'}
          </button>

          <div className="flex items-center justify-center gap-1.5" aria-hidden="true">
            {PASOS_VIAJE.map((item) => {
              const actual = item.id === paso.id
              const visitadoActivo = visitados.includes(item.id) && !actual
              return (
                <motion.span
                  key={item.id}
                  className={clsx(
                    'h-1.5 rounded-full',
                    actual ? 'bg-enel-pink' : visitadoActivo ? 'bg-enel-pink/40' : 'bg-enel-fog',
                  )}
                  animate={{
                    width: actual ? 24 : 6,
                    opacity: actual ? 1 : visitadoActivo ? 0.7 : 0.5,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              irSiguiente()
              track('paso.siguiente', { paso: paso.id })
            }}
            className="bg-enel-pink hover:bg-enel-pink/80 border-enel-pink inline-flex h-11 items-center gap-2 rounded-full border-2 px-5 text-sm font-semibold text-white transition-colors duration-150 will-change-transform active:scale-[0.97]"
          >
            {esReto ? 'Continuar' : 'Siguiente'}
            <ArrowRight size={16} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  )
}