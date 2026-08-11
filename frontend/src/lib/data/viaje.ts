export interface PasoViaje {
  id: string
  nombre: string
  descripcion: string
}

export const PASOS_VIAJE: PasoViaje[] = [
  {
    id: 'historia',
    nombre: 'Historia del grupo',
    descripcion: 'Cómo nació y creció Enel Distribución Chile.',
  },
  {
    id: 'cultura',
    nombre: 'Cultura organizacional',
    descripcion: 'Valores, propósito y forma de trabajar.',
  },
  {
    id: 'organigrama',
    nombre: 'Equipos y gerencias',
    descripcion: 'Quién lidera cada área y qué hace cada equipo.',
  },
  {
    id: 'mapa',
    nombre: 'Mapa de concesión',
    descripcion: 'Las 33 comunas que se encienden con nosotros.',
  },
  {
    id: 'cadena',
    nombre: 'Cadena de valor',
    descripcion: 'Cómo creamos valor de punta a punta.',
  },
  {
    id: 'politicas',
    nombre: 'Políticas del negocio',
    descripcion: 'El marco que guía nuestro trabajo diario.',
  },
  {
    id: 'galerias',
    nombre: 'Espacios y equipos',
    descripcion: 'Conoce las oficinas y a las personas del negocio.',
  },
  {
    id: 'cierre',
    nombre: 'Cierre',
    descripcion: 'El propósito que nos une cada día.',
  },
]

export const PASO_INICIAL = 'portada'

export function indiceDePaso(id: string): number {
  return PASOS_VIAJE.findIndex((paso) => paso.id === id)
}
