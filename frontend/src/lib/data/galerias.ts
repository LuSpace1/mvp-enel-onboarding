import placeholderHombre from '@/assets/images/placeholder_hombre.webp'
import placeholderMujer from '@/assets/images/placeholder_mujer.jpg'

export const numerosClave = [
  { valor: '14,5', unidad: 'TWh', etiqueta: 'Energía distribuida al año' },
  { valor: '2', unidad: 'M', etiqueta: 'Clientes en la Región Metropolitana' },
  { valor: '18.248', unidad: 'km', etiqueta: 'Red de distribución eléctrica' },
  { valor: '538', unidad: '', etiqueta: 'Personas que hacen posible el servicio' },
  { valor: '33', unidad: '', etiqueta: 'Comunas en nuestra zona de concesión' },
]

export const fotosMeOffice = [
  { src: 'https://picsum.photos/seed/meoffice-lobby/900/600', alt: 'Lobby de Me Office' },
  { src: 'https://picsum.photos/seed/meoffice-sala/900/600', alt: 'Sala de reuniones Me Office' },
  { src: 'https://picsum.photos/seed/meoffice-cocina/900/600', alt: 'Cocina Me Office' },
  { src: 'https://picsum.photos/seed/meoffice-terraza/900/600', alt: 'Terraza Me Office' },
  { src: 'https://picsum.photos/seed/meoffice-auditorio/900/600', alt: 'Auditorio Me Office' },
  {
    src: 'https://picsum.photos/seed/meoffice-trabajo/900/600',
    alt: 'Zona de trabajo colaborativo',
  },
]

export const fotosEquipos = [
  { src: placeholderMujer, alt: 'Integrante del equipo de operaciones' },
  { src: placeholderHombre, alt: 'Integrante del equipo de red' },
  { src: placeholderMujer, alt: 'Integrante del equipo de oficina' },
  { src: placeholderHombre, alt: 'Integrante del Centro de Excelencia Operacional' },
  { src: placeholderMujer, alt: 'Integrante del equipo HSEQ' },
  { src: placeholderHombre, alt: 'Integrante del equipo de atención a clientes' },
]

export const centroExcelencia = {
  titulo: 'Centro de Excelencia Operacional',
  subtitulo: 'Seguridad e innovación en acción',
  descripcion:
    'Un espacio de formación técnica de 8.000 m² diseñado para desarrollar y fortalecer las competencias de nuestros equipos y contratistas en la operación de redes eléctricas, con el compromiso de cero accidentes.',
  url: 'https://www.enel.cl/es/conoce-enel/ceo-centro-de-excelencia-operacional-enel-distribucion.html',
}
