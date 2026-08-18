import { MapTrifold } from '@phosphor-icons/react'
import { motion } from 'motion/react'

import type { PasoViaje } from '@/lib/data/viaje'
import { PASOS_VIAJE } from '@/lib/data/viaje'
import { useViajeStore } from '@/store/useViajeStore'
import { track } from '@/lib/analytics'
import { clsx } from 'clsx'

function ProgressDots({ className }: { className?: string }) {
  const pasoActual = useViajeStore((estado) => estado.pasoActual)
  const visitados = useViajeStore((estado) => estado.visitados)

  return (
    <div className={clsx('flex items-center justify-center gap-1.5', className)} aria-hidden="true">
      {PASOS_VIAJE.map((item) => {
        const actual = item.id === pasoActual
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
  )
}

export function PasoHeader({ paso }: { paso: PasoViaje }) {
  return (
    <div className="sticky top-16 z-20 border-b border-white/60 bg-[#f0eee6]/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl">
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
          <span className="bg-enel-blue/10 text-enel-blue shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.14em] uppercase">
            Capítulo
          </span>
          <h1 className="text-enel-navy truncate text-sm font-semibold tracking-tight md:text-base">
            {paso.nombre}
          </h1>
        </div>

        <ProgressDots className="hidden md:flex" />

        <button
          type="button"
          onClick={() => {
            track('paso.abrir.mapa', { paso: paso.id })
            useViajeStore.getState().abrirRuta()
            setTimeout(() => {
              const el = document.getElementById('mapa-del-viaje')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }, 100)
          }}
          className="hover:bg-enel-mist inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-neutral-600 transition"
        >
          <MapTrifold size={15} weight="duotone" />
          Mapa del viaje
        </button>
      </div>
      <ProgressDots className="relative z-10 flex pb-2 md:hidden" />
    </div>
  )
}
