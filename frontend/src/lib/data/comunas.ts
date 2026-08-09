import type { Comuna as ApiComuna } from '@/types/api'

// Extendemos la interfaz base para nuestro frontend
export interface Comuna extends ApiComuna {
  cx: number
  cy: number
}

interface ComunaGrid {
  id: string
  nombre: string
  col: number
  row: number
  esEnel?: boolean
}

// Mapa estructurado en grilla hexagonal (Cartograma de Santiago)
// 52 comunas de la RM, ordenadas geográficamente
export const comunasGrid: ComunaGrid[] = [
  { id: 'til-til', nombre: 'Til Til', col: 1, row: 0, esEnel: false },
  { id: 'colina', nombre: 'Colina', col: 2, row: 0 },
  { id: 'lo-barnechea', nombre: 'Lo Barnechea', col: 4, row: 0 },

  { id: 'lampa', nombre: 'Lampa', col: 1, row: 1, esEnel: false },
  { id: 'quilicura', nombre: 'Quilicura', col: 2, row: 1 },
  { id: 'huechuraba', nombre: 'Huechuraba', col: 3, row: 1 },
  { id: 'vitacura', nombre: 'Vitacura', col: 4, row: 1 },
  { id: 'las-condes', nombre: 'Las Condes', col: 5, row: 1 },

  { id: 'pudahuel', nombre: 'Pudahuel', col: 1, row: 2 },
  { id: 'renca', nombre: 'Renca', col: 2, row: 2 },
  { id: 'conchali', nombre: 'Conchalí', col: 3, row: 2 },
  { id: 'recoleta', nombre: 'Recoleta', col: 4, row: 2 },
  { id: 'providencia', nombre: 'Providencia', col: 5, row: 2 },
  { id: 'la-reina', nombre: 'La Reina', col: 6, row: 2 },

  { id: 'curacavi', nombre: 'Curacaví', col: 0, row: 3, esEnel: false },
  { id: 'cerro-navias', nombre: 'Cerro Navia', col: 1, row: 3 },
  { id: 'quinta-normal', nombre: 'Quinta Normal', col: 2, row: 3 },
  { id: 'independencia', nombre: 'Independencia', col: 3, row: 3 },
  { id: 'santiago', nombre: 'Santiago', col: 4, row: 3 },
  { id: 'nunoa', nombre: 'Ñuñoa', col: 5, row: 3 },
  { id: 'penalolen', nombre: 'Peñalolén', col: 6, row: 3 },
  { id: 'san-jose-de-maipo', nombre: 'San José de Maipo', col: 7, row: 3, esEnel: false },

  { id: 'maria-pinto', nombre: 'María Pinto', col: 0, row: 4, esEnel: false },
  { id: 'lo-prado', nombre: 'Lo Prado', col: 1, row: 4 },
  { id: 'estacion-central', nombre: 'Estación Central', col: 2, row: 4 },
  { id: 'pa-c', nombre: 'P. Aguirre Cerda', col: 3, row: 4 },
  { id: 'san-miguel', nombre: 'San Miguel', col: 4, row: 4 },
  { id: 'san-joaquin', nombre: 'San Joaquín', col: 5, row: 4 },
  { id: 'macul', nombre: 'Macul', col: 6, row: 4 },

  { id: 'melipilla', nombre: 'Melipilla', col: 0, row: 5, esEnel: false },
  { id: 'padre-hurtado', nombre: 'Padre Hurtado', col: 1, row: 5, esEnel: false },
  { id: 'maipu', nombre: 'Maipú', col: 2, row: 5 },
  { id: 'cerrillos', nombre: 'Cerrillos', col: 3, row: 5 },
  { id: 'lo-espejo', nombre: 'Lo Espejo', col: 4, row: 5 },
  { id: 'san-ramon', nombre: 'San Ramón', col: 5, row: 5 },
  { id: 'la-granja', nombre: 'La Granja', col: 6, row: 5 },
  { id: 'la-florida', nombre: 'La Florida', col: 7, row: 5 },

  { id: 'san-pedro', nombre: 'San Pedro', col: 0, row: 6, esEnel: false },
  { id: 'penaflor', nombre: 'Peñaflor', col: 1, row: 6, esEnel: false },
  { id: 'calera-de-tango', nombre: 'Calera de Tango', col: 2, row: 6, esEnel: false },
  { id: 'san-bernardo', nombre: 'San Bernardo', col: 3, row: 6, esEnel: false },
  { id: 'la-cisterna', nombre: 'La Cisterna', col: 4, row: 6 },
  { id: 'el-bosque', nombre: 'El Bosque', col: 5, row: 6 },
  { id: 'la-pintana', nombre: 'La Pintana', col: 6, row: 6 },
  { id: 'puente-alto', nombre: 'Puente Alto', col: 7, row: 6, esEnel: false },

  { id: 'alhue', nombre: 'Alhué', col: 0, row: 7, esEnel: false },
  { id: 'el-monte', nombre: 'El Monte', col: 1, row: 7, esEnel: false },
  { id: 'talagante', nombre: 'Talagante', col: 2, row: 7, esEnel: false },
  { id: 'buin', nombre: 'Buin', col: 3, row: 7, esEnel: false },
  { id: 'pirque', nombre: 'Pirque', col: 7, row: 7, esEnel: false },

  { id: 'isla-de-maipo', nombre: 'Isla de Maipo', col: 2, row: 8, esEnel: false },
  { id: 'paine', nombre: 'Paine', col: 3, row: 8, esEnel: false },
]

export function generarPathHexagono(col: number, row: number): { path: string; cx: number; cy: number } {
  const R = 44 // Radio del hexágono
  const w = Math.sqrt(3) * R
  const h = 2 * R
  const offsetX = row % 2 === 1 ? w / 2 : 0
  const cx = 80 + col * (w + 4) + offsetX
  const cy = 80 + row * (h * 0.75 + 4)

  let d = ''
  for (let i = 0; i < 6; i++) {
    const angle_deg = 60 * i - 30
    const angle_rad = (Math.PI / 180) * angle_deg
    const px = cx + R * Math.cos(angle_rad)
    const py = cy + R * Math.sin(angle_rad)
    d += `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)} `
  }
  return { path: d + 'Z', cx, cy }
}

export const comunas: Comuna[] = comunasGrid.map((comuna) => {
  const geom = generarPathHexagono(comuna.col, comuna.row)
  return {
    id: comuna.id,
    nombre: comuna.nombre,
    esEnel: comuna.esEnel ?? true,
    path: geom.path,
    cx: geom.cx,
    cy: geom.cy,
  }
})
