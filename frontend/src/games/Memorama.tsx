import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowCounterClockwise } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'

import { hitosEnel } from '@/lib/data/historia'
import { GameShell } from './shared'
import { finalizarJuego, notificarVista } from './telemetria'
import { clsx } from 'clsx'

interface Carta {
  id: number
  parejaId: number
  ladoA: string
  ladoB: string
  volteada: boolean
  emparejada: boolean
}

function barajar<T>(elementos: T[]): T[] {
  const copia = [...elementos]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j]!, copia[i]!]
  }
  return copia
}

function crearCartas() {
  const pares = hitosEnel.slice(0, 8).map((hito) => ({
    parejaId: hito.id,
    ladoA: `${hito.anio} · ${hito.titulo}`,
    ladoB: hito.descripcion,
  }))
  return barajar(
    pares.flatMap((par) => [
      {
        id: par.parejaId * 2,
        parejaId: par.parejaId,
        ladoA: par.ladoA,
        ladoB: par.ladoB,
        volteada: false,
        emparejada: false,
      },
      {
        id: par.parejaId * 2 + 1,
        parejaId: par.parejaId,
        ladoA: par.ladoA,
        ladoB: par.ladoB,
        volteada: false,
        emparejada: false,
      },
    ]),
  )
}

const OPTIMOS = 8

export function Memorama() {
  const reduce = useReducedMotion()
  const [cartas, setCartas] = useState<Carta[]>(() => crearCartas())
  const [volteadas, setVolteadas] = useState<number[]>([])
  const [turnos, setTurnos] = useState(0)
  const [completado, setCompletado] = useState(false)
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null)

  const todasEmparejadas = cartas.length > 0 && cartas.every((carta) => carta.emparejada)

  useEffect(() => {
    notificarVista(1)
  }, [])

  useEffect(() => {
    if (!todasEmparejadas || completado) return
    setCompletado(true)
    finalizarJuego({
      game_id: 1,
      score: Math.max(0, 100 * (1 - turnos / OPTIMOS)),
      attempts: turnos,
      completed: true,
    })
  }, [todasEmparejadas, completado, turnos])

  useEffect(
    () => () => {
      if (temporizador.current) clearTimeout(temporizador.current)
    },
    [],
  )

  function voltearCarta(id: number) {
    if (volteadas.length === 2) return
    const carta = cartas.find((c) => c.id === id)
    if (!carta || carta.emparejada || carta.volteada) return

    const nuevas = cartas.map((c) => (c.id === id ? { ...c, volteada: true } : c))
    setCartas(nuevas)
    const nuevasVolteadas = [...volteadas, id]

    if (nuevasVolteadas.length === 2) {
      setVolteadas([])
      setTurnos((t) => t + 1)
      const [primeraId, segundaId] = nuevasVolteadas
      const primera = nuevas.find((c) => c.id === primeraId)
      const segunda = nuevas.find((c) => c.id === segundaId)

      temporizador.current = setTimeout(() => {
        if (!primera || !segunda) return
        if (primera.parejaId === segunda.parejaId) {
          setCartas((actuales) =>
            actuales.map((c) => (c.parejaId === primera.parejaId ? { ...c, emparejada: true } : c)),
          )
        } else {
          setCartas((actuales) =>
            actuales.map((c) => (nuevasVolteadas.includes(c.id) ? { ...c, volteada: false } : c)),
          )
        }
      }, 850)
    } else {
      setVolteadas(nuevasVolteadas)
    }
  }

  function reiniciar() {
    if (temporizador.current) clearTimeout(temporizador.current)
    setCartas(crearCartas())
    setVolteadas([])
    setTurnos(0)
    setCompletado(false)
  }

  const puntaje = useMemo(() => Math.max(0, Math.round(100 * (1 - turnos / OPTIMOS))), [turnos])

  return (
    <GameShell
      gameId={1}
      titulo="Memorama de hitos"
      instruccion="Encuentra los pares: junta cada hito con su descripción. Entre menos movimientos uses, mejor puntaje."
      completado={completado}
    >
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {cartas.map((carta) => (
          <button
            key={carta.id}
            type="button"
            onClick={() => voltearCarta(carta.id)}
            disabled={carta.emparejada || volteadas.length === 2}
            className="h-24 md:h-28"
            aria-label={carta.emparejada ? 'Par encontrado' : 'Voltear carta'}
            data-analytics-component="juego-memorama"
            data-analytics-accion={carta.emparejada ? 'par-encontrado' : 'voltear'}
          >
            <div className="relative h-full w-full" style={{ perspective: 800 }}>
              <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: 'preserve-3d' }}
                animate={reduce ? {} : { rotateY: carta.volteada || carta.emparejada ? 180 : 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className="border-enel-fog bg-enel-navy absolute inset-0 flex items-center justify-center rounded-xl border text-xl font-bold text-white"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {carta.emparejada ? (
                    <span className="text-enel-red text-2xl">✓</span>
                  ) : (
                    <span className="text-lg">E</span>
                  )}
                </span>
                <span
                  className={clsx(
                    'absolute inset-0 flex items-center justify-center rounded-xl border p-2 text-center text-[11px] leading-snug font-medium md:text-xs',
                    carta.emparejada
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border-enel-fog text-enel-navy bg-white',
                  )}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  {carta.volteada || carta.emparejada
                    ? carta.volteada
                      ? carta.ladoA
                      : carta.ladoB
                    : ''}
                </span>
              </motion.div>
            </div>
          </button>
        ))}
      </div>

      <div className="border-enel-fog mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <p className="text-sm text-neutral-600">
          Movimientos: <span className="text-enel-navy font-semibold">{turnos}</span> · Puntaje
          actual: <span className="text-enel-red font-semibold">{puntaje}</span>
        </p>
        <button
          type="button"
          onClick={reiniciar}
          className="border-enel-fog text-enel-navy hover:border-enel-red/40 hover:text-enel-red inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition"
        >
          <ArrowCounterClockwise size={14} weight="bold" />
          Reiniciar
        </button>
      </div>
    </GameShell>
  )
}
