import { useEffect, useState } from 'react'
import { CheckCircle, XCircle } from '@phosphor-icons/react'
import { motion } from 'motion/react'

import { subgerencias } from '@/lib/data/organizacion'
import { GameShell } from './shared'
import { finalizarJuego, notificarVista } from './telemetria'
import { clsx } from 'clsx'

interface Funcion {
  id: string
  texto: string
  emparejada: boolean
}

const FUNCIONES: Record<string, string> = {
  pc: 'Abastecimiento y compras estratégicas',
  hseq: 'Seguridad, salud, medio ambiente y calidad',
  rco: 'Operaciones comerciales y experiencia del cliente',
  com: 'Operación, mantenimiento y proyectos en red',
  nd: 'Planificación y desarrollo de la red eléctrica',
}

function shuffle<T>(elementos: T[]): T[] {
  const copia = [...elementos]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j]!, copia[i]!]
  }
  return copia
}

export function MatchAreas() {
  const [funciones, setFunciones] = useState<Funcion[]>(() =>
    shuffle(
      subgerencias.map((sub) => ({
        id: sub.id,
        texto: FUNCIONES[sub.id] ?? '',
        emparejada: false,
      })),
    ),
  )
  const [seleccion, setSeleccion] = useState<string | null>(null)
  const [fallo, setFallo] = useState<string | null>(null)
  const [errores, setErrores] = useState(0)
  const [erroresPorPar, setErroresPorPar] = useState<Record<string, boolean>>({})
  const [primerIntento, setPrimerIntento] = useState(0)
  const [completado, setCompletado] = useState(false)

  const emparejados = funciones.filter((funcion) => funcion.emparejada).length

  useEffect(() => {
    notificarVista(4)
  }, [])

  useEffect(() => {
    if (emparejados === subgerencias.length && !completado) {
      setCompletado(true)
      finalizarJuego({
        game_id: 4,
        score: Math.round((primerIntento / subgerencias.length) * 100),
        attempts: errores + subgerencias.length,
        completed: true,
      })
    }
  }, [emparejados, completado, errores, primerIntento])

  function elegirArea(id: string) {
    if (fallo || completado) return
    setSeleccion((actual) => (actual === id ? null : id))
  }

  function elegirFuncion(id: string) {
    if (fallo || completado || seleccion === null) return
    const areaSeleccionada = seleccion
    setSeleccion(null)

    const funcion = funciones.find((f) => f.id === areaSeleccionada)
    const correcto = funcion?.id === id
    if (correcto && funcion) {
      const tuvoError = erroresPorPar[id]
      if (!tuvoError) setPrimerIntento((v) => v + 1)
      setFunciones((actuales) =>
        actuales.map((f) => (f.id === id ? { ...f, emparejada: true } : f)),
      )
    } else {
      setErrores((e) => e + 1)
      setErroresPorPar((actuales) => ({ ...actuales, [id]: true }))
      setFallo(id)
      setTimeout(() => setFallo(null), 900)
    }
  }

  return (
    <GameShell
      gameId={4}
      titulo="Match de áreas y funciones"
      instruccion="Conecta cada subgerencia con su función principal: toca un área y luego su función."
      completado={completado}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-neutral-400 uppercase">
            Subgerencias
          </p>
          <ul className="space-y-2">
            {subgerencias.map((sub) => {
              const conectada = funciones.find((f) => f.id === sub.id)?.emparejada
              return (
                <li key={sub.id}>
                  <button
                    type="button"
                    onClick={() => elegirArea(sub.id)}
                    disabled={conectada}
                    className={clsx(
                      'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition',
                      conectada
                        ? 'border-emerald-200 bg-emerald-50'
                        : seleccion === sub.id
                          ? 'border-enel-red bg-enel-red/5'
                          : 'border-enel-fog hover:border-enel-red/40 bg-white',
                    )}
                  >
                    <span className="bg-enel-navy flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white">
                      {sub.sigla}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-enel-navy block truncate text-sm font-semibold">
                        {sub.nombre}
                      </span>
                      <span className="block text-xs text-neutral-500">{sub.subgerente}</span>
                    </span>
                    {conectada && (
                      <CheckCircle size={20} weight="fill" className="shrink-0 text-emerald-600" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-neutral-400 uppercase">
            Funciones
          </p>
          <ul className="space-y-2">
            {funciones.map((funcion) => (
              <li key={funcion.id}>
                <motion.button
                  type="button"
                  onClick={() => elegirFuncion(funcion.id)}
                  disabled={funcion.emparejada}
                  animate={
                    fallo === funcion.id
                      ? { x: [0, -8, 8, -6, 6, 0], backgroundColor: 'rgba(254,226,226,1)' }
                      : {}
                  }
                  transition={{ duration: 0.4 }}
                  className={clsx(
                    'flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition',
                    funcion.emparejada
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-enel-fog hover:border-enel-red/40 bg-white',
                  )}
                >
                  <span className="text-enel-navy text-sm font-medium">{funcion.texto}</span>
                  {funcion.emparejada ? (
                    <CheckCircle size={20} weight="fill" className="shrink-0 text-emerald-600" />
                  ) : (
                    fallo === funcion.id && (
                      <XCircle size={20} weight="fill" className="shrink-0 text-red-500" />
                    )
                  )}
                </motion.button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-enel-fog mt-6 border-t pt-4">
        <p className="text-sm text-neutral-600">
          Pares: <span className="text-enel-navy font-semibold">{emparejados}</span> de{' '}
          {subgerencias.length} · Fallos:{' '}
          <span className="text-enel-red font-semibold">{errores}</span> · Al primer intento:{' '}
          <span className="font-semibold text-emerald-700">{primerIntento}</span>
        </p>
      </div>
    </GameShell>
  )
}
