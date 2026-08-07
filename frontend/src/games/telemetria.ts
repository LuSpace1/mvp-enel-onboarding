import { track } from '@/lib/analytics'
import type { GameSubmitPayload } from '@/types/api'
import { submitirJuego } from '@/services/games'
import { useViajeStore } from '@/store/useViajeStore'

export function finalizarJuego(payload: GameSubmitPayload) {
  void submitirJuego(payload)
  track('juego.finalizado', payload)
  if (payload.completed) {
    useViajeStore.getState().marcarSuperado(payload.game_id)
  }
}

export function notificarVista(id: number) {
  track('juego.visto', { game_id: id })
}
