import { useEffect, useState } from 'react'
import { ArrowCounterClockwise } from '@phosphor-icons/react'
import { motion } from 'motion/react'

import { valoresCultura } from '@/lib/data/cultura'
import { GameShell } from './shared'
import { finalizarJuego, notificarVista } from './telemetria'
import { clsx } from 'clsx'

const PALABRAS = valoresCultura.filter((valor) =>
  ['CONFIANZA', 'INNOVACION', 'RESPETO'].includes(valor.palabra),
)

function desordenarLetras(palabra: string): string[] {
  const letras = [...palabra]
  for (let i = letras.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[letras[i], letras[j]] = [letras[j]!, letras[i]!]
  }
  return letras
}

interface EstadoLetra {
  letra: string
  usada: boolean
}

export function Acrostico() {
  const [palabraActual, setPalabraActual] = useState(0)
  const [letras, setLetras] = useState<EstadoLetra[]>(() =>
    desordenarLetras(PALABRAS[0]!.palabra).map((letra) => ({ letra, usada: false })),
  )
  const [casilleros, setCasilleros] = useState<string[]>([])
  const [fallo, setFallo] = useState(false)
  const [intentosPalabra, setIntentosPalabra] = useState(0)
  const [palabrasPrimerIntento, setPalabrasPrimerIntento] = useState(0)
  const [errores, setErrores] = useState(0)
  const [completado, setCompletado] = useState(false)

  const palabra = PALABRAS[palabraActual]

  useEffect(() => {
    notificarVista(3)
  }, [])

  function colocarLetra(indice: number) {
    const letra = letras[indice]
    if (!letra || letra.usada) return
    const nuevas = [...letras]
    nuevas[indice] = { ...letra, usada: true }
    setLetras(nuevas)
    const nuevoCasilleros = [...casilleros, letra.letra]

    if (nuevoCasilleros.length === palabra!.palabra.length) {
      const correcto = nuevoCasilleros.join('') === palabra!.palabra
      if (correcto) {
        if (intentosPalabra === 0) setPalabrasPrimerIntento((v) => v + 1)
        setTimeout(() => {
          if (palabraActual < PALABRAS.length - 1) {
            setPalabraActual((p) => p + 1)
            setLetras(
              desordenarLetras(PALABRAS[palabraActual + 1]!.palabra).map((l) => ({
                letra: l,
                usada: false,
              })),
            )
            setCasilleros([])
            setIntentosPalabra(0)
          } else {
            setCompletado(true)
            finalizarJuego({
              game_id: 3,
              score: Math.round(
                ((palabrasPrimerIntento + (intentosPalabra === 0 ? 1 : 0)) / PALABRAS.length) * 100,
              ),
              attempts: errores + PALABRAS.length,
              completed: true,
            })
          }
        }, 700)
      } else {
        setFallo(true)
        setErrores((e) => e + 1)
        setIntentosPalabra((i) => i + 1)
        setTimeout(() => {
          setFallo(false)
          setCasilleros([])
          setLetras(
            desordenarLetras(PALABRAS[palabraActual]!.palabra).map((l) => ({
              letra: l,
              usada: false,
            })),
          )
        }, 800)
      }
    } else {
      setCasilleros(nuevoCasilleros)
    }
  }

  function devolverLetra(indice: number) {
    if (fallo || completado) return
    const letraDevuelta = casilleros[indice]
    if (letraDevuelta === undefined) return
    const nuevas = [...casilleros]
    nuevas.splice(indice, 1)
    setCasilleros(nuevas)
    setLetras((actuales) => {
      const copia = actuales.map((l) => ({ ...l }))
      const disponible = copia.find((l) => l.letra === letraDevuelta && l.usada)
      if (disponible) disponible.usada = false
      return copia
    })
  }

  if (!palabra) return null

  return (
    <GameShell
      gameId={3}
      titulo="Acróstico de valores"
      instruccion={`Forma el valor oculto de ${palabra.palabra.length} letras tocando las letras del tablero. Pista: ${palabra.descripcion}`}
      completado={completado}
    >
      <motion.div
        className={clsx(
          'rounded-2xl border p-6 transition-colors',
          fallo ? 'border-red-300 bg-red-50' : 'border-enel-fog bg-enel-mist',
        )}
        animate={fallo ? { x: [0, -8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <p className="text-center text-sm font-semibold tracking-[0.18em] text-neutral-500 uppercase">
          {palabra.palabra.length} letras · Valor {palabraActual + 1} de {PALABRAS.length}
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {palabra.palabra.split('').map((_, indice) => (
            <button
              key={indice}
              type="button"
              onClick={() => devolverLetra(indice)}
              disabled={casilleros[indice] === undefined}
              className={clsx(
                'flex h-11 w-9 items-center justify-center rounded-lg border-2 text-lg font-bold uppercase transition md:h-12 md:w-10',
                casilleros[indice]
                  ? 'border-enel-navy text-enel-navy bg-white'
                  : 'border-dashed border-neutral-300 bg-white/50 text-transparent',
                completado && 'border-emerald-400 bg-emerald-50',
              )}
              aria-label={`Casillero ${indice + 1}`}
            >
              {casilleros[indice] ?? '·'}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {letras.map((letra, indice) => (
            <button
              key={indice}
              type="button"
              onClick={() => colocarLetra(indice)}
              disabled={letra.usada || completado}
              className={clsx(
                'flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold uppercase transition',
                letra.usada
                  ? 'cursor-default bg-neutral-200 text-transparent'
                  : 'bg-enel-navy hover:bg-enel-red text-white hover:-translate-y-0.5',
                fallo && 'bg-red-200 text-red-300',
              )}
              aria-label={`Letra ${letra.letra}`}
            >
              {letra.letra}
            </button>
          ))}
        </div>

        <p className="mt-5 text-center text-sm text-neutral-500">
          {casilleros.length} de {palabra.palabra.length} letras colocadas
          {errores > 0 && (
            <span className="text-red-500">
              {' '}
              · {errores} intento{errores === 1 ? '' : 's'} fallido{errores === 1 ? '' : 's'}
            </span>
          )}
        </p>
      </motion.div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          Resueltos al primer intento:{' '}
          <span className="text-enel-red font-semibold">
            {palabrasPrimerIntento} de {PALABRAS.length}
          </span>
        </p>
        <button
          type="button"
          onClick={() => {
            setLetras(desordenarLetras(palabra.palabra).map((l) => ({ letra: l, usada: false })))
            setCasilleros([])
          }}
          className="border-enel-fog text-enel-navy hover:border-enel-red/40 hover:text-enel-red inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition"
        >
          <ArrowCounterClockwise size={14} weight="bold" />
          Limpiar palabra
        </button>
      </div>
    </GameShell>
  )
}
