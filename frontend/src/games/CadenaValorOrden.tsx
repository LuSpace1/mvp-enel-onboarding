import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, CheckCircle, DotsSixVertical, XCircle } from '@phosphor-icons/react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { etapasCadena } from '@/lib/data/organizacion'
import { GameShell } from './shared'
import { finalizarJuego, notificarVista } from './telemetria'
import { clsx } from 'clsx'

interface EtapaDesordenada {
  id: string
  titulo: string
}

const ORDEN_CORRECTO = etapasCadena.map((etapa) => etapa.id)

function shuffle<T>(elementos: T[]): T[] {
  const copia = [...elementos]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j]!, copia[i]!]
  }
  return copia
}

interface RowProps {
  id: string
  titulo: string
  indice: number
  correcta: boolean | null
  onMover: (id: string, direccion: 1 | -1) => void
}

function RowSortable({ id, titulo, indice, correcta, onMover }: RowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={clsx(
        'flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm',
        isDragging ? 'border-enel-red/60 shadow-lg' : 'border-enel-fog',
        correcta === true && 'bg-emerald-50/60',
        correcta === false && 'bg-red-50/60',
      )}
    >
      <span
        className={clsx(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold',
          correcta === false ? 'bg-red-100 text-red-700' : 'bg-enel-navy text-white',
        )}
      >
        {indice + 1}
      </span>
      <span className="text-enel-navy min-w-0 flex-1 truncate text-sm font-medium">{titulo}</span>

      {correcta === true && <CheckCircle size={18} weight="fill" className="text-emerald-600" />}
      {correcta === false && <XCircle size={18} weight="fill" className="text-red-500" />}

      <div className="flex shrink-0 items-center gap-1 md:hidden">
        <button
          type="button"
          onClick={() => onMover(id, -1)}
          disabled={indice === 0}
          className="border-enel-fog text-enel-navy rounded-md border p-1.5 disabled:opacity-30"
          aria-label={`Mover ${titulo} hacia arriba`}
        >
          <ArrowUp size={14} weight="bold" />
        </button>
        <button
          type="button"
          onClick={() => onMover(id, 1)}
          disabled={indice === etapasCadena.length - 1}
          className="border-enel-fog text-enel-navy rounded-md border p-1.5 disabled:opacity-30"
          aria-label={`Mover ${titulo} hacia abajo`}
        >
          <ArrowDown size={14} weight="bold" />
        </button>
      </div>

      <button
        type="button"
        {...attributes}
        {...listeners}
        className="hover:bg-enel-mist hover:text-enel-navy hidden shrink-0 cursor-grab rounded-md p-1.5 text-neutral-400 active:cursor-grabbing md:block"
        aria-label="Arrastrar para reordenar"
      >
        <DotsSixVertical size={18} weight="bold" />
      </button>
    </li>
  )
}

export function CadenaValorOrden() {
  const [cartas, setCartas] = useState<EtapaDesordenada[]>(() =>
    shuffle(etapasCadena.map((etapa) => ({ id: etapa.id, titulo: etapa.titulo }))),
  )
  const [verificada, setVerificada] = useState<boolean[] | null>(null)
  const [intentos, setIntentos] = useState(0)
  const [completado, setCompletado] = useState(false)

  const sensores = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  useEffect(() => {
    notificarVista(2)
  }, [])

  function onDragEnd(evento: DragEndEvent) {
    const { active, over } = evento
    if (!over || active.id === over.id) return
    setCartas((actuales) => {
      const antiguo = actuales.findIndex((c) => c.id === active.id)
      const nuevo = actuales.findIndex((c) => c.id === over.id)
      return arrayMove(actuales, antiguo, nuevo)
    })
  }

  function mover(id: string, direccion: 1 | -1) {
    setCartas((actuales) => {
      const indice = actuales.findIndex((c) => c.id === id)
      const destino = indice + direccion
      if (indice < 0 || destino < 0 || destino >= actuales.length) return actuales
      const copia = [...actuales]
      ;[copia[indice], copia[destino]] = [copia[destino]!, copia[indice]!]
      return copia
    })
  }

  function comprobar() {
    const resultado = cartas.map((carta) => carta.id === ORDEN_CORRECTO[cartas.indexOf(carta)])
    setVerificada(resultado)
    const nuevoIntentos = intentos + 1
    setIntentos(nuevoIntentos)

    const correcto = resultado.every(Boolean)
    if (correcto) {
      setCompletado(true)
      finalizarJuego({
        game_id: 2,
        score: Math.round(100 * (1 - Math.min(nuevoIntentos - 1, 4) * 0.15)),
        attempts: nuevoIntentos,
        completed: true,
      })
    }
  }

  return (
    <GameShell
      gameId={2}
      titulo="Cadena de valor en orden"
      instruccion="Acomoda las etapas en la secuencia correcta de la cadena de valor. Arrastra en escritorio o usa las flechas en móvil."
      completado={completado}
    >
      <DndContext sensors={sensores} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={cartas.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2">
            {cartas.map((carta, indice) => (
              <RowSortable
                key={carta.id}
                id={carta.id}
                titulo={carta.titulo}
                indice={indice}
                correcta={verificada?.[indice] ?? null}
                onMover={mover}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <div className="border-enel-fog mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <p className="text-sm text-neutral-600">
          Comprobaciones: <span className="text-enel-navy font-semibold">{intentos}</span>
        </p>
        <button
          type="button"
          onClick={comprobar}
          disabled={completado}
          className="bg-enel-pink hover:bg-enel-pink/80 border-enel-pink inline-flex h-10 items-center rounded-full border-2 px-5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          Comprobar orden
        </button>
      </div>
    </GameShell>
  )
}
