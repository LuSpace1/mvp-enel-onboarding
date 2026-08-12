import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { PASO_INICIAL, PASOS_VIAJE } from '@/lib/data/viaje'

interface EstadoViaje {
  pasoActual: string
  visitados: string[]
  navegar: (paso: string) => void
}

const IDS_VALIDOS = new Set<string>([PASO_INICIAL, ...PASOS_VIAJE.map((paso) => paso.id)])

export const useViajeStore = create<EstadoViaje>()(
  persist(
    (set) => ({
      pasoActual: PASO_INICIAL,
      visitados: [],
      navegar: (paso) =>
        set((estado) => ({
          pasoActual: paso,
          visitados: estado.visitados.includes(paso)
            ? estado.visitados
            : [...estado.visitados, paso],
        })),
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
