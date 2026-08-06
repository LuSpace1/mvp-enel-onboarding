import { http } from '@/lib/http'
import { track } from '@/lib/analytics'
import type { GameSubmitPayload } from '@/types/api'

export async function submitirJuego(payload: GameSubmitPayload) {
  track('juego.finalizado', payload)
  try {
    await http.post('/games/submit/', payload)
  } catch {
    track('juego.submit.fallido', payload)
  }
}
