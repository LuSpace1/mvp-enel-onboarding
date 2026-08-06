export interface ValorCultura {
  palabra: string
  descripcion: string
}

export const valoresCultura: ValorCultura[] = [
  {
    palabra: 'CONFIANZA',
    descripcion: 'Construimos relaciones sólidas basadas en la transparencia.',
  },
  {
    palabra: 'INNOVACION',
    descripcion: 'Buscamos nuevas formas de generar valor para la ciudad.',
  },
  {
    palabra: 'RESPETO',
    descripcion: 'Cuidamos a las personas, las comunidades y el entorno.',
  },
  {
    palabra: 'PROACTIVIDAD',
    descripcion: 'Anticipamos los desafíos y actuamos con iniciativa.',
  },
  {
    palabra: 'FLEXIBILIDAD',
    descripcion: 'Nos adaptamos con agilidad a un entorno en movimiento.',
  },
]

export const pilaresCultura = [
  {
    id: 'seguridad',
    titulo: 'La seguridad es nuestra prioridad',
    descripcion:
      'Cultura preventiva donde cada tarea considera los riesgos y las medidas para proteger a las personas, las comunidades y el entorno.',
    puntos: [
      'Reportamos condiciones inseguras',
      'Política Stop Work',
      'Aprendemos de los incidentes',
    ],
  },
  {
    id: 'equipo',
    titulo: 'Trabajamos como un solo equipo',
    descripcion:
      'La continuidad del servicio y el desarrollo de la red son el resultado del trabajo coordinado de múltiples equipos.',
    puntos: [
      'Compartimos conocimiento',
      'Escuchamos distintas perspectivas',
      'Colaboramos entre áreas',
    ],
  },
  {
    id: 'mejora',
    titulo: 'Mejora continua',
    descripcion:
      'Cuestionamos procesos, identificamos oportunidades y promovemos cambios que generen valor para clientes y equipos.',
    puntos: ['Proponemos nuevas ideas', 'Simplificamos procesos', 'Aprendemos de los errores'],
  },
  {
    id: 'futuro',
    titulo: 'Pensamos en el futuro',
    descripcion:
      'Impulsamos una red más resiliente, eficiente y preparada para los desafíos energéticos y ambientales.',
    puntos: [
      'Recursos usados responsablemente',
      'Impactos ambientales considerados',
      'Apoyamos la electrificación',
    ],
  },
  {
    id: 'cliente',
    titulo: 'Cliente en el centro',
    descripcion:
      'Detrás de cada conexión existen hogares, comercios e industrias que dependen de una energía segura y confiable.',
    puntos: ['Soluciones oportunas', 'Cercanía y responsabilidad', 'Mejoramos su experiencia'],
  },
]
