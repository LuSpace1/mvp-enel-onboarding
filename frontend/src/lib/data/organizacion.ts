import type { EtapaCadena, Subgerencia } from '@/types/api'

export const subgerencias: Subgerencia[] = [
  {
    id: 'pc',
    sigla: 'P&C',
    nombre: 'Industrial P&C',
    subgerente: 'Francisco Evans',
    proposito:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Gestionamos la cadena de suministro y las compras estratégicas del negocio.',
    procesos: ['Compras estratégicas', 'Abastecimiento', 'Contratos'],
    videoSection: 'subgerencia_pc',
  },
  {
    id: 'hseq',
    sigla: 'HSEQ',
    nombre: 'Health, Safety, Environment and Quality',
    subgerente: 'Ximena León',
    proposito:
      'Garantizar la gestión integral en salud, seguridad, medio ambiente y calidad, asegurando el cumplimiento de estándares globales y normativas locales, promoviendo una cultura preventiva y de mejora continua.',
    procesos: ['SIG', 'Cumplimiento normativo', 'Inspección', 'Capacitación técnica'],
    videoSection: 'subgerencia_hseq',
  },
  {
    id: 'rco',
    sigla: 'RCO',
    nombre: 'Regulated Customer Operations',
    subgerente: 'Giovanni Zanchetta',
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
    nombre: 'Personas y Organización',
    detalle: 'Talento, cultura y desarrollo organizacional.',
  },
  { id: 'legal', nombre: 'Legal', detalle: 'Asesoría jurídica y cumplimiento.' },
  {
    id: 'comunicaciones',
    nombre: 'Comunicaciones y Sostenibilidad',
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

export const cadenaEnergia = [
  {
    numero: '1',
    titulo: 'Se genera la energía',
    descripcion: 'Centrales de generación producen la electricidad.',
  },
  {
    numero: '2',
    titulo: 'Se transporta',
    descripcion: 'Líneas de transmisión llevan la energía por el país.',
  },
  {
    numero: '3',
    titulo: 'Nosotros la distribuimos',
    descripcion: 'Enel Distribución la hace llegar a hogares y empresas.',
  },
  {
    numero: '4',
    titulo: 'Los clientes la utilizan',
    descripcion: 'La energía impulsa la vida de la ciudad.',
  },
]
