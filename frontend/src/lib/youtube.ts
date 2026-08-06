const PATRONES = [/(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([\w-]{11})/]

export function obtenerIdYouTube(url: string): string | null {
  for (const patron of PATRONES) {
    const coincidencia = url.match(patron)
    if (coincidencia?.[1]) return coincidencia[1]
  }
  return null
}
