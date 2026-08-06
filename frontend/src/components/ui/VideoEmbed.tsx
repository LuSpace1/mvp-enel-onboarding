import { useState } from 'react'
import { Play } from '@phosphor-icons/react'

import { track } from '@/lib/analytics'
import { obtenerIdYouTube } from '@/lib/youtube'

interface VideoEmbedProps {
  youtubeUrl: string
  titulo: string
  posterSeed: string
  analiticaId?: string
}

export function VideoEmbed({ youtubeUrl, titulo, posterSeed, analiticaId }: VideoEmbedProps) {
  const [reproduciendo, setReproduciendo] = useState(false)
  const videoId = obtenerIdYouTube(youtubeUrl)

  if (!videoId) return null

  return (
    <div className="bg-enel-navy relative aspect-video w-full overflow-hidden rounded-2xl">
      {reproduciendo ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setReproduciendo(true)
            if (analiticaId) track('video.reproducido', { id: analiticaId })
          }}
          className="group absolute inset-0 flex h-full w-full items-center justify-center"
          aria-label={`Reproducir: ${titulo}`}
        >
          <img
            src={`https://picsum.photos/seed/${posterSeed}/1280/720`}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-700 group-hover:scale-105 group-hover:opacity-50"
            loading="lazy"
          />
          <span className="text-enel-red relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl transition duration-300 group-hover:scale-110">
            <Play size={32} weight="fill" />
          </span>
          <span className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/70 to-transparent px-5 pt-10 pb-4 text-left text-sm font-medium text-white md:text-base">
            {titulo}
          </span>
        </button>
      )}
    </div>
  )
}
