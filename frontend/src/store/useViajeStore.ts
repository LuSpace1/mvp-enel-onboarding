import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { PASO_INICIAL, PASOS_VIAJE, indiceDePaso } from '@/lib/data/viaje'

interface EstadoViaje {
  pasoActual: string
  visitados: string[]
  navegar: (paso: string) => void
  irSiguiente: () => void
  irAnterior: () => void
  marcarVisitado: (paso: string) => void
}

function pasoEntre(indice: number): string | null {
  return PASOS_VIAJE[indice]?.id ?? null
}

const IDS_VALIDOS = new Set<string>([PASO_INICIAL, ...PASOS_VIAJE.map((paso) => paso.id)])

export const useViajeStore = create<EstadoViaje>()(
  persist(
    (set, get) => ({
      pasoActual: PASO_INICIAL,
      visitados: [],
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
    }),
    {
      name: 'enel-viaje',
      version: 2,
      merge: (persistido, estadoActual) => {
        const datos = persistido as Partial<EstadoViaje> | undefined
        return {
          ...estadoActual,
          pasoActual:
            datos && datos.pasoActual && IDS_VALIDOS.has(datos.pasoActual)
              ? datos.pasoActual
              : PASO_INICIAL,
          visitados: (datos?.visitados ?? []).filter((id) => IDS_VALIDOS.has(id)),
        }
      },
    },
  ),
)
