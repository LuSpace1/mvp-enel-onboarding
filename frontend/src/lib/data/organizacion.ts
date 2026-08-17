import type { EtapaCadena, Subgerencia } from '@/types/api'

import fotoHombre from '@/assets/images/placeholder_hombre.webp'
import fotoMujer from '@/assets/images/placeholder_mujer.jpg'

export const gerenteGeneral = {
  id: 'gerente',
  nombre: 'Mónica Hodor',
  cargo: 'Gerente General',
  empresa: 'Enel Distribución Chile',
  foto: fotoMujer,
}

export const subgerencias: Subgerencia[] = [
  {
    id: 'pc',
    sigla: 'P&C',
    nombre: 'Industrial P&C',
    subgerente: 'Francisco Evans',
    foto: fotoHombre,
    proposito:
      'Gestionar de manera estratégica la cadena de suministro, el abastecimiento y las contrataciones de servicios y materiales del negocio.',
    procesos: ['Compras estratégicas', 'Abastecimiento', 'Contratos'],
    videoSection: 'subgerencia_pc',
  },
  {
    id: 'hseq',
    sigla: 'HSEQ',
    nombre: 'Health, Safety, Environment and Quality',
    subgerente: 'Ximena León',
    foto: fotoMujer,
    proposito:
      'Garantizar la gestión integral en salud, seguridad, medio ambiente y calidad (HSEQ), asegurando el cumplimiento de estándares globales y normativas locales, promoviendo una cultura preventiva y de mejora continua.',
    procesos: ['SIG', 'Cumplimiento normativo', 'Inspección', 'Capacitación técnica'],
    videoSection: 'subgerencia_hseq',
  },
  {
    id: 'rco',
    sigla: 'RCO',
    nombre: 'Regulated Customer Operations',
    subgerente: 'Giovanni Zanchetta',
    foto: fotoHombre,
    proposito:
      'Gestionar eficientemente las operaciones comerciales reguladas, optimizando el balance energético, el ciclo de ingresos y la experiencia del cliente.',
    procesos: ['Activaciones', 'Meter to cash', 'Gestión de pérdidas', 'Atención a clientes'],
    videoSection: 'subgerencia_rco',
  },
  {
    id: 'com',
    sigla: 'COM',
    nombre: 'Construction Operation and Maintenance',
    subgerente: 'Francisco Messen',
    foto: fotoHombre,
    proposito:
      'Asegurar la continuidad y calidad del servicio eléctrico mediante la operación, mantenimiento y ejecución de proyectos en la red.',
    procesos: ['Operación de red', 'Mantenimiento', 'Gestión de fallas', 'Planes de emergencia'],
    videoSection: 'subgerencia_com',
  },
  {
    id: 'nd',
    sigla: 'ND',
    nombre: 'Network Development',
    subgerente: 'Marco Castro',
    foto: fotoHombre,
    proposito:
      'Planificar y desarrollar la red eléctrica asegurando eficiencia en inversiones, sostenibilidad y alineamiento con la regulación y estándares globales.',
    procesos: [
      'Planificación de red',
      'Gestión de activos',
      'Evaluación de proyectos',
      'Nuevos negocios',
    ],
    videoSection: 'subgerencia_nd',
  },
]

export const areasStaff = [
  {
    id: 'finanzas',
    nombre: 'Finanzas',
    detalle: 'Gestión financiera y presupuestaria del negocio.',
  },
  { id: 'auditoria', nombre: 'Auditoría', detalle: 'Aseguramiento y control interno.' },
  {
    id: 'personas',
    nombre: 'Personas y Organizacionales',
    detalle: 'Talento, cultura y desarrollo organizacional.',
  },
  { id: 'legal', nombre: 'Legal', detalle: 'Asesoría jurídica y cumplimiento.' },
  {
    id: 'comunicaciones',
    nombre: 'Comunicaciones Externas y Sostenibilidad',
    detalle: 'Vínculo con comunidades y grupos de interés.',
  },
]

export const etapasCadena: EtapaCadena[] = [
  {
    id: 'customer',
    titulo: 'Customer Management',
    descripcion: 'Gestionamos la relación con el cliente y su experiencia.',
  },
  {
    id: 'strategy',
    titulo: 'Strategy and Development',
    descripcion: 'Definimos la dirección del negocio y su crecimiento.',
  },
  {
    id: 'supply',
    titulo: 'Supply Chain',
    descripcion: 'Abastecemos con eficiencia los insumos y servicios.',
  },
  {
    id: 'engineering',
    titulo: 'Engineering',
    descripcion: 'Diseñamos las soluciones técnicas de la red.',
  },
  {
    id: 'construction',
    titulo: 'Construction and Operation',
    descripcion: 'Construimos y operamos la infraestructura eléctrica.',
  },
  {
    id: 'cash',
    titulo: 'Service to Cash',
    descripcion: 'Convertimos el servicio en valor sostenible.',
  },
]
