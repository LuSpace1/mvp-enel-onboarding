import { create } from 'zustand'

import { obtenerVideos } from '@/services/videos'
import type { VideoLink } from '@/types/api'

type VideosStatus = 'idle' | 'loading' | 'loaded' | 'error'

interface VideosState {
  videos: VideoLink[]
  status: VideosStatus
  cargar: () => Promise<void>
}

export const useVideosStore = create<VideosState>((set, get) => ({
  videos: [],
  status: 'idle',

  cargar: async () => {
    if (get().status === 'loaded' || get().status === 'loading') return
    set({ status: 'loading' })
    try {
      const videos = await obtenerVideos()
      set({ videos, status: 'loaded' })
    } catch {
      set({ status: 'error' })
    }
  },
}))