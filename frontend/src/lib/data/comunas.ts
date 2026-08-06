import type { Comuna } from '@/types/api'

export interface ComunaBase {
  id: string
  nombre: string
  x: number
  y: number
  w: number
  h: number
}

export const comunasBase: ComunaBase[] = [
  { id: 'colina', nombre: 'Colina', x: 250, y: 55, w: 160, h: 80 },
  { id: 'lo-barnechea', nombre: 'Lo Barnechea', x: 490, y: 55, w: 130, h: 55 },
  { id: 'quilicura', nombre: 'Quilicura', x: 110, y: 130, w: 100, h: 60 },
  { id: 'huechuraba', nombre: 'Huechuraba', x: 250, y: 125, w: 95, h: 70 },
  { id: 'pudahuel', nombre: 'Pudahuel', x: 55, y: 220, w: 115, h: 80 },
  { id: 'renca', nombre: 'Renca', x: 160, y: 215, w: 80, h: 65 },
  { id: 'conchali', nombre: 'Conchalí', x: 240, y: 215, w: 80, h: 60 },
  { id: 'independencia', nombre: 'Independencia', x: 320, y: 205, w: 75, h: 60 },
  { id: 'recoleta', nombre: 'Recoleta', x: 395, y: 210, w: 70, h: 60 },
  { id: 'vitacura', nombre: 'Vitacura', x: 480, y: 200, w: 120, h: 60 },
  { id: 'cerro-navias', nombre: 'Cerro Navia', x: 65, y: 310, w: 95, h: 70 },
  { id: 'quinta-normal', nombre: 'Quinta Normal', x: 150, y: 310, w: 95, h: 65 },
  { id: 'estacion-central', nombre: 'Estación Central', x: 255, y: 325, w: 85, h: 75 },
  { id: 'santiago', nombre: 'Santiago', x: 340, y: 320, w: 110, h: 75 },
  { id: 'providencia', nombre: 'Providencia', x: 440, y: 295, w: 95, h: 70 },
  { id: 'las-condes', nombre: 'Las Condes', x: 515, y: 255, w: 100, h: 65 },
  { id: 'lo-prado', nombre: 'Lo Prado', x: 95, y: 390, w: 100, h: 85 },
  { id: 'cerrillos', nombre: 'Cerrillos', x: 215, y: 400, w: 95, h: 80 },
  { id: 'nunoa', nombre: 'Ñuñoa', x: 430, y: 385, w: 90, h: 70 },
  { id: 'la-reina', nombre: 'La Reina', x: 500, y: 380, w: 90, h: 65 },
  { id: 'macul', nombre: 'Macul', x: 355, y: 455, w: 85, h: 65 },
  { id: 'penalolen', nombre: 'Peñalolén', x: 515, y: 460, w: 100, h: 80 },
  { id: 'san-joaquin', nombre: 'San Joaquín', x: 295, y: 475, w: 85, h: 65 },
  { id: 'pa-c', nombre: 'Pedro Aguirre Cerda', x: 210, y: 520, w: 90, h: 65 },
  { id: 'san-miguel', nombre: 'San Miguel', x: 390, y: 530, w: 85, h: 65 },
  { id: 'maipu', nombre: 'Maipú', x: 95, y: 570, w: 140, h: 85 },
  { id: 'la-cisterna', nombre: 'La Cisterna', x: 235, y: 585, w: 90, h: 70 },
  { id: 'san-ramon', nombre: 'San Ramón', x: 330, y: 585, w: 80, h: 60 },
  { id: 'la-granja', nombre: 'La Granja', x: 420, y: 590, w: 85, h: 60 },
  { id: 'la-florida', nombre: 'La Florida', x: 520, y: 545, w: 100, h: 95 },
  { id: 'el-bosque', nombre: 'El Bosque', x: 265, y: 650, w: 90, h: 60 },
  { id: 'lo-espejo', nombre: 'Lo Espejo', x: 170, y: 650, w: 85, h: 55 },
  { id: 'la-pintana', nombre: 'La Pintana', x: 420, y: 665, w: 105, h: 70 },
]

export function generarPathComuna(comuna: { x: number; y: number; w: number; h: number }): string {
  const { x, y, w, h } = comuna
  const cx = x + w / 2
  const cy = y + h / 2
  const rx = w / 2
  const ry = h / 2
  const pasos = 7
  let d = 'M'
  for (let i = 0; i <= pasos; i++) {
    const angulo = (i / pasos) * Math.PI * 2
    const variacion = 0.86 + 0.22 * Math.sin(i * 3.7 + x * 0.013 + y * 0.007)
    const px = cx + Math.cos(angulo) * rx * variacion
    const py = cy + Math.sin(angulo) * ry * variacion
    d += `${i === 0 ? '' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`
  }
  return `${d}Z`
}

export const comunas: Comuna[] = comunasBase.map((comuna) => ({
  id: comuna.id,
  nombre: comuna.nombre,
  path: generarPathComuna(comuna),
}))
