import { track } from '@/lib/analytics'
import type { GameSubmitPayload } from '@/types/api'
import { submitirJuego } from '@/services/games'

export function finalizarJuego(payload: GameSubmitPayload) {
  void submitirJuego(payload)
  track('juego.finalizado', payload)
}

export function notificarVista(id: number) {
  track('juego.visto', { game_id: id })
}
