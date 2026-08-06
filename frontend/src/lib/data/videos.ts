import type { VideoLink } from '@/types/api'

import { useVideosStore } from '@/store/useVideosStore'

const VIDEO_MUESTRA = 'https://www.youtube.com/watch?v=aqz-KE-bpKQ'

export const videosMock: VideoLink[] = [
  {
    id: 1,
    title: 'Mensaje de bienvenida de la Gerente General Mónica Hodor',
    youtube_url: VIDEO_MUESTRA,
    section_identifier: 'hero_main',
    created_at: '',
    updated_at: '',
  },
  {
    id: 2,
    title: 'Bienvenida de Francisco Evans — Subgerencia Industrial P&C',
    youtube_url: VIDEO_MUESTRA,
    section_identifier: 'subgerencia_pc',
    created_at: '',
    updated_at: '',
  },
  {
    id: 3,
    title: 'Bienvenida de Ximena León — Subgerencia HSEQ',
    youtube_url: VIDEO_MUESTRA,
    section_identifier: 'subgerencia_hseq',
    created_at: '',
    updated_at: '',
  },
  {
    id: 4,
    title: 'Bienvenida de Giovanni Zanchetta — Subgerencia RCO',
    youtube_url: VIDEO_MUESTRA,
    section_identifier: 'subgerencia_rco',
    created_at: '',
    updated_at: '',
  },
  {
    id: 5,
    title: 'Bienvenida de Francisco Messen — Subgerencia COM',
    youtube_url: VIDEO_MUESTRA,
    section_identifier: 'subgerencia_com',
    created_at: '',
    updated_at: '',
  },
  {
    id: 6,
    title: 'Bienvenida de Marco Castro — Subgerencia Network Development',
    youtube_url: VIDEO_MUESTRA,
    section_identifier: 'subgerencia_nd',
    created_at: '',
    updated_at: '',
  },
]

export function videoDeSeccion(sectionIdentifier: string): VideoLink | undefined {
  const real = useVideosStore
    .getState()
    .videos.find((video) => video.section_identifier === sectionIdentifier)
  return real ?? videosMock.find((video) => video.section_identifier === sectionIdentifier)
}
