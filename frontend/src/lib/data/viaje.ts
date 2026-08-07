export type TipoPaso = 'editorial' | 'reto'

export interface PasoViaje {
  id: string
  tipo: TipoPaso
  nombre: string
  descripcion: string
  juegoId?: number
}

export const PASOS_VIAJE: PasoViaje[] = [
  {
    id: 'historia',
    tipo: 'editorial',
    nombre: 'Historia del grupo',
    descripcion: 'Cómo nació y creció Enel Distribución Chile.',
  },
  {
    id: 'reto-memorama',
    tipo: 'reto',
    nombre: 'Memorama de historia',
    descripcion: 'Pon a prueba lo aprendido sobre el grupo.',
    juegoId: 1,
  },
  {
    id: 'cultura',
    tipo: 'editorial',
    nombre: 'Cultura organizacional',
    descripcion: 'Valores, propósito y forma de trabajar.',
  },
  {
    id: 'organigrama',
    tipo: 'editorial',
    nombre: 'Equipos y gerencias',
    descripcion: 'Quién lidera cada área y qué hace cada equipo.',
  },
  {
    id: 'reto-match',
    tipo: 'reto',
    nombre: 'Relaciona las áreas',
    descripcion: 'Une cada subgerencia con su propósito.',
    juegoId: 4,
  },
  {
    id: 'mapa',
    tipo: 'editorial',
    nombre: 'Mapa de concesión',
    descripcion: 'Las 33 comunas que se encienden con nosotros.',
  },
  {
    id: 'cadena',
    tipo: 'editorial',
    nombre: 'Cadena de valor',
    descripcion: 'Cómo creamos valor de punta a punta.',
  },
  {
    id: 'reto-cadena',
    tipo: 'reto',
    nombre: 'Ordena la cadena',
    descripcion: 'Arma el orden correcto de la cadena de valor.',
    juegoId: 2,
  },
  {
    id: 'politicas',
    tipo: 'editorial',
    nombre: 'Políticas del negocio',
    descripcion: 'El marco que guía nuestro trabajo diario.',
  },
  {
    id: 'reto-acrostico',
    tipo: 'reto',
    nombre: 'Acróstico de valores',
    descripcion: 'Descubre los valores ocultos en el acróstico.',
    juegoId: 3,
  },
  {
    id: 'galerias',
    tipo: 'editorial',
    nombre: 'Espacios y equipos',
    descripcion: 'Conoce las oficinas y a las personas del negocio.',
  },
  {
    id: 'reto-timeline',
    tipo: 'reto',
    nombre: 'Línea de tiempo',
    descripcion: 'Ordena los hitos históricos de la empresa.',
    juegoId: 5,
  },
  {
    id: 'cierre',
    tipo: 'editorial',
    nombre: 'Cierre',
    descripcion: 'El propósito que nos une cada día.',
  },
]

export const PASO_INICIAL = 'portada'

export function indiceDePaso(id: string): number {
  return PASOS_VIAJE.findIndex((paso) => paso.id === id)
}
