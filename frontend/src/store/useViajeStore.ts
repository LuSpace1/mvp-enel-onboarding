import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { PASO_INICIAL, PASOS_VIAJE, indiceDePaso } from '@/lib/data/viaje'

interface EstadoViaje {
  pasoActual: string
  visitados: string[]
  superados: number[]
  navegar: (paso: string) => void
  irSiguiente: () => void
  irAnterior: () => void
  marcarVisitado: (paso: string) => void
  marcarSuperado: (juegoId: number) => void
}

function pasoEntre(indice: number): string | null {
  return PASOS_VIAJE[indice]?.id ?? null
}

export const useViajeStore = create<EstadoViaje>()(
  persist(
    (set, get) => ({
      pasoActual: PASO_INICIAL,
      visitados: [],
      superados: [],
      navegar: (paso) =>
        set((estado) => ({
          pasoActual: paso,
          visitados: estado.visitados.includes(paso)
            ? estado.visitados
            : [...estado.visitados, paso],
        })),
      irSiguiente: () => {
        const indice = indiceDePaso(get().pasoActual)
        if (indice < 0 || indice >= PASOS_VIAJE.length - 1) return
        const siguiente = pasoEntre(indice + 1)
        if (!siguiente) return
        get().navegar(siguiente)
      },
      irAnterior: () => {
        const indice = indiceDePaso(get().pasoActual)
        if (indice <= 0) {
          get().navegar(PASO_INICIAL)
          return
        }
        const anterior = pasoEntre(indice - 1)
        if (!anterior) return
        get().navegar(anterior)
      },
      marcarVisitado: (paso) =>
        set((estado) =>
          estado.visitados.includes(paso) ? estado : { visitados: [...estado.visitados, paso] },
        ),
      marcarSuperado: (juegoId) =>
        set((estado) =>
          estado.superados.includes(juegoId)
            ? estado
            : { superados: [...estado.superados, juegoId] },
        ),
    }),
    { name: 'enel-viaje' },
  ),
)
