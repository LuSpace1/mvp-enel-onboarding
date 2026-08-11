import type { PropsWithChildren } from 'react'
import { ArrowLeft, ArrowRight, MapTrifold } from '@phosphor-icons/react'
import { motion } from 'motion/react'

import type { PasoViaje } from '@/lib/data/viaje'
import { PASOS_VIAJE } from '@/lib/data/viaje'
import { useViajeStore } from '@/store/useViajeStore'
import { track } from '@/lib/analytics'
import { clsx } from 'clsx'

export function PasoHeader({ paso }: { paso: PasoViaje }) {
  const navegar = useViajeStore((estado) => estado.navegar)
  const visitados = useViajeStore((estado) => estado.visitados)

  return (
    <div className="sticky top-0 z-20 border-b border-white/60 bg-[#f0eee6]/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: 'radial-gradient(rgba(10, 25, 47, 0.35) 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
        }}
      />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-3 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="bg-enel-red/10 text-enel-red shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.14em] uppercase">
            Capítulo
          </span>
          <h1 className="text-enel-navy truncate text-sm font-semibold tracking-tight md:text-base">
            {paso.nombre}
          </h1>
        </div>

        {/* Progress Dots */}
        <div className="hidden md:flex items-center justify-center gap-1.5" aria-hidden="true">
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
            track('paso.abrir.mapa', { paso: paso.id })
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="hover:bg-enel-mist inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-neutral-600 transition"
        >
          <MapTrifold size={15} weight="duotone" />
          Mapa del viaje
        </button>
      </div>
      {/* Progress Dots para Móvil */}
      <div className="flex md:hidden items-center justify-center gap-1.5 pb-2 relative z-10" aria-hidden="true">
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
    </div>
  )
}

