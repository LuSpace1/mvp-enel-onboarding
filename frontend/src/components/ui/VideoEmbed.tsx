import { useState } from 'react'
import { Play } from '@phosphor-icons/react'
import { obtenerIdYouTube } from '@/lib/youtube'

interface VideoEmbedProps {
  youtubeUrl: string
  titulo: string
}

export function VideoEmbed({ youtubeUrl, titulo }: VideoEmbedProps) {
  const [reproducir, setReproducir] = useState(false)
  const videoId = obtenerIdYouTube(youtubeUrl)

  if (!videoId) return null

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
      {reproducir ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
          title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setReproducir(true)}
          aria-label={`Reproducir video: ${titulo}`}
          className="group absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center"
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-black shadow-xl transition duration-300 group-hover:scale-110 group-hover:bg-enel-blue group-hover:text-white">
            <Play size={26} weight="fill" className="ml-1" />
          </span>
        </button>
      )}
    </div>
  )
}
