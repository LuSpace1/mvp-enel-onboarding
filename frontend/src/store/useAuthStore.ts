import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { http } from '@/lib/http'
import { track } from '@/lib/analytics'
import type { AnonymousAuthResponse } from '@/types/api'

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error'

interface AuthState {
  uuid: string | null
  access: string | null
  refresh: string | null
  status: AuthStatus
  initAnonymous: () => Promise<void>
  logout: () => void
}

function generarUuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (caracter) => {
    const aleatorio = (Math.random() * 16) | 0
    const valor = caracter === 'x' ? aleatorio : (aleatorio & 0x3) | 0x8
    return valor.toString(16)
  })
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      uuid: null,
      access: null,
      refresh: null,
      status: 'idle',

      initAnonymous: async () => {
        if (get().status === 'authenticated') return

        set({ status: 'loading' })

        try {
          const uuid = get().uuid ?? generarUuid()
          const { data } = await http.post<AnonymousAuthResponse>('/auth/anonymous/', { uuid })
          set({
            uuid,
            access: data.access,
            refresh: data.refresh,
            status: 'authenticated',
          })
          track('auth.anonyma.exitosa', { uuid })
        } catch {
          set({ status: 'error' })
          track('auth.anonyma.fallida')
        }
      },

      logout: () => set({ uuid: null, access: null, refresh: null, status: 'idle' }),
    }),
    {
      name: 'portal-enel-auth',
      partialize: (state) => ({
        uuid: state.uuid,
        access: state.access,
        refresh: state.refresh,
      }),
    },
  ),
)
