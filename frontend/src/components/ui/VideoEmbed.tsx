import { obtenerIdYouTube } from '@/lib/youtube'

interface VideoEmbedProps {
  youtubeUrl: string
  titulo: string
}

export function VideoEmbed({ youtubeUrl, titulo }: VideoEmbedProps) {
  const videoId = obtenerIdYouTube(youtubeUrl)

  if (!videoId) return null

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
        title={titulo}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
