import { useEffect, useState } from 'react'
import { CheckCircle } from '@phosphor-icons/react'
import { motion } from 'motion/react'

import { hitosTimeline } from '@/lib/data/historia'
import { GameShell } from './shared'
import { finalizarJuego, notificarVista } from './telemetria'
import { clsx } from 'clsx'

interface HitoDesordenado {
  id: number
  anio: number
  titulo: string
  ubicado: boolean
}

function shuffle<T>(elementos: T[]): T[] {
  const copia = [...elementos]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j]!, copia[i]!]
  }
  return copia
}

export function TimelineHistorico() {
  const [hitos, setHitos] = useState<HitoDesordenado[]>(() =>
    shuffle(
      hitosTimeline.map((hito) => ({
        id: hito.id,
        anio: parseInt(hito.anio, 10),
        titulo: hito.titulo,
        ubicado: false,
      })),
    ),
  )
  const [ubicados, setUbicados] = useState<HitoDesordenado[]>([])
  const [errores, setErrores] = useState(0)
  const [fallo, setFallo] = useState<number | null>(null)
  const [completado, setCompletado] = useState(false)

  useEffect(() => {
    notificarVista(5)
  }, [])

  function elegir(id: number) {
    if (completado || fallo !== null) return
    const hito = hitos.find((h) => h.id === id)
    if (!hito || hito.ubicado) return

    const pendientes = hitos.filter((h) => !h.ubicado)
    const menorAnio = Math.min(...pendientes.map((h) => h.anio))

    if (hito.anio === menorAnio) {
      const actualizados = hitos.map((h) => (h.id === id ? { ...h, ubicado: true } : h))
      setHitos(actualizados)
      setUbicados((u) => [...u, hito])

      if (actualizados.every((h) => h.ubicado)) {
        setCompletado(true)
        finalizarJuego({
          game_id: 5,
          score: Math.max(0, Math.round(((hitos.length - errores) / hitos.length) * 100)),
          attempts: errores + hitos.length,
          completed: true,
        })
      }
    } else {
      setErrores((e) => e + 1)
      setFallo(id)
      setTimeout(() => setFallo(null), 900)
    }
  }

  return (
    <GameShell
      gameId={5}
      titulo="Timeline histórico"
      instruccion="Ubica los hitos en orden cronológico: toca primero el más antiguo y sigue hasta completar la línea de tiempo."
      completado={completado}
    >
      <div className="relative mb-8 pl-8">
        <span className="bg-enel-fog absolute top-1 bottom-1 left-3 w-0.5 rounded" />
        <ul className="space-y-3">
          {ubicados.map((hito) => (
            <motion.li
              key={hito.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="relative"
            >
              <span className="border-enel-red absolute top-1/2 -left-[26px] h-3 w-3 -translate-y-1/2 rounded-full border-2 bg-white" />
              <div className="flex items-baseline gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <span className="text-lg font-bold text-emerald-700">{hito.anio}</span>
                <span className="text-enel-navy text-sm font-semibold">{hito.titulo}</span>
                <CheckCircle
                  size={18}
                  weight="fill"
                  className="ml-auto shrink-0 text-emerald-600"
                />
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      <p className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-neutral-400 uppercase">
        Hitos pendientes — toca el más antiguo
      </p>
      <div className="flex flex-wrap gap-2">
        {hitos
          .filter((h) => !h.ubicado)
          .map((hito) => (
            <motion.button
              key={hito.id}
              type="button"
              onClick={() => elegir(hito.id)}
              animate={fallo === hito.id ? { x: [0, -8, 8, -6, 6, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={clsx(
                'rounded-xl border px-4 py-2.5 text-left transition',
                fallo === hito.id
                  ? 'border-red-300 bg-red-50'
                  : 'border-enel-fog hover:border-enel-red/40 bg-white hover:shadow-md',
              )}
              data-analytics-component="juego-timeline"
            >
              <span className="text-enel-navy block text-sm font-bold">{hito.anio}</span>
              <span className="block max-w-[180px] truncate text-xs text-neutral-500">
                {hito.titulo}
              </span>
            </motion.button>
          ))}
      </div>

      <div className="border-enel-fog mt-6 border-t pt-4">
        <p className="text-sm text-neutral-600">
          Ubicados: <span className="text-enel-navy font-semibold">{ubicados.length}</span> de{' '}
          {hitos.length} · Errores:{' '}
          <span
            className={clsx('font-semibold', errores > 0 ? 'text-red-500' : 'text-neutral-400')}
          >
            {errores}
          </span>
        </p>
      </div>
    </GameShell>
  )
}
