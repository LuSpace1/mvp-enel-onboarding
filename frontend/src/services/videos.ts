import { http } from '@/lib/http'
import type { VideoLink } from '@/types/api'

export async function obtenerVideos(): Promise<VideoLink[]> {
  const { data } = await http.get<VideoLink[]>('/videos/')
  return data
}