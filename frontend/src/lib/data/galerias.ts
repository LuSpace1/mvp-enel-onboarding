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

const DESCRIPCIONES_EQUIPOS = [
  'El equipo que mantiene la red eléctrica en marcha, día y noche.',
  'Especialistas en la operación segura de la infraestructura crítica.',
  'Ingeniería y proyectos que anticipan las necesidades del futuro.',
  'La voz de nuestros clientes, convertida en mejoras concretas.',
  'Seguridad, salud y calidad como prioridad absoluta.',
  'Tecnología y datos para una operación más inteligente.',
  'Personas que hacen crecer la cultura Enel cada día.',
  'Logística y suministros que sostienen todas las áreas.',
  'El equipo comercial que acerca la energía a cada hogar.',
  'Nuevas ideas para un futuro eléctrico más limpio.',
]

export const fotosEquipos = Array.from({ length: 50 }, (_, i) => ({
  src: `https://picsum.photos/seed/equipo-${i + 1}/1600/1000`,
  titulo: `Equipo ${i + 1}`,
  descripcion: DESCRIPCIONES_EQUIPOS[i % DESCRIPCIONES_EQUIPOS.length]!,
}))

export const centroExcelencia = {
  titulo: 'Centro de Excelencia Operacional',
  subtitulo: 'Seguridad e innovación en acción',
  descripcion:
    'Un espacio de formación técnica de 8.000 m² diseñado para desarrollar y fortalecer las competencias de nuestros equipos y contratistas en la operación de redes eléctricas, con el compromiso de cero accidentes.',
  url: 'https://www.enel.cl/es/conoce-enel/ceo-centro-de-excelencia-operacional-enel-distribucion.html',
}
