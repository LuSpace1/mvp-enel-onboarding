import type { PropsWithChildren } from 'react'
import { GameController, Trophy } from '@phosphor-icons/react'

export interface JuegoProps {
  gameId: number
  titulo: string
  instruccion: string
  completado?: boolean
  onFinalizar?: () => void
}

export function GameShell({
  titulo,
  instruccion,
  completado,
  children,
}: PropsWithChildren<JuegoProps>) {
  return (
    <div
      className="border-enel-fog shadow-enel-red/5 mx-auto w-full max-w-3xl rounded-3xl border bg-white p-6 shadow-xl md:p-8"
      data-analytics-component="juego"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="bg-enel-red/10 text-enel-red flex h-10 w-10 items-center justify-center rounded-xl">
            <GameController size={22} weight="duotone" />
          </span>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-neutral-400 uppercase">
              Mini-juego
            </p>
            <h3 className="text-enel-navy text-lg font-semibold tracking-tight">{titulo}</h3>
          </div>
        </div>
        {completado && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Trophy size={14} weight="fill" />
            Completado
          </span>
        )}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-neutral-600">{instruccion}</p>

      <div className="mt-6">{children}</div>
    </div>
  )
}
