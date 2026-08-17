import { useState } from 'react'
import { MapPin } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'

import { Reveal } from '@/components/ui/Reveal'
import { comunas } from '@/lib/data/comunas'
import { track } from '@/lib/analytics'

export function MapaConcesionSection() {
  const [activa, setActiva] = useState<string | null>(null)
  const [seleccionada, setSeleccionada] = useState<string | null>(null)
  const reduce = useReducedMotion()

  const comunaActiva = comunas.find((comuna) => comuna.id === activa)

  return (
    <section id="mapa" className="relative overflow-hidden bg-[#f0eee6] py-14 md:py-20">
      {/* Fondo Cuadernillo Global */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: 'radial-gradient(rgba(10, 25, 47, 0.35) 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
        }}
      />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-5xl px-5 md:px-8"
        initial={reduce ? false : { opacity: 0, y: -100 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ type: 'spring', stiffness: 35, damping: 14, mass: 1.4 }}
      >
        <div className="flex flex-col items-center text-center">
          <Reveal className="mb-12 max-w-2xl">
            <p className="text-enel-red text-sm font-bold tracking-[0.2em] uppercase">
              Nuestra concesión
            </p>
            <h2 className="text-enel-navy mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              33 comunas que se encienden con nosotros
            </h2>
            <p className="mt-5 text-base leading-relaxed font-medium text-neutral-600">
              Cubrimos gran parte de la Región Metropolitana, incluyendo la zona de nuestra
              subsidiaria Enel Colina S.A. Las comunas iluminadas representan nuestra área de
              servicio.
            </p>

            <div className="text-enel-navy mx-auto mt-8 flex max-w-xs items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white/70 px-4 py-3 text-sm shadow-sm backdrop-blur-sm">
              <MapPin size={18} className="text-enel-red shrink-0" weight="fill" />
              {comunaActiva ? (
                <span className="text-enel-navy font-bold">{comunaActiva.nombre}</span>
              ) : (
                <span className="font-serif text-neutral-500 italic">Explora el mapa…</span>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-6 flex w-full justify-center">
            <svg
              viewBox="0 0 730 730"
              className="w-full max-w-4xl drop-shadow-2xl"
              role="img"
              aria-label="Mapa de la Región Metropolitana con las 33 comunas de Enel Distribución encendidas"
            >
              <defs>
                <radialGradient id="foco-encendido" cx="50%" cy="50%" r="75%">
                  <stop offset="0%" stopColor="#fef08a" /> {/* Amarillo centro ampolleta */}
                  <stop offset="40%" stopColor="#f59e0b" /> {/* Naranjo amarillento */}
                  <stop offset="100%" stopColor="#ea580c" /> {/* Naranjo oscuro bordes */}
                </radialGradient>
              </defs>

              {comunas.map((comuna) => {
                const isEnel = comuna.esEnel !== false
                const resaltada = (activa === comuna.id || seleccionada === comuna.id) && isEnel

                return (
                  <motion.path
                    key={comuna.id}
                    d={comuna.path}
                    fill={isEnel ? 'url(#foco-encendido)' : 'rgba(10,25,47,0.04)'}
                    stroke="rgba(10,25,47,0.15)"
                    strokeWidth={isEnel ? 2 : 1.5}
                    strokeLinejoin="round"
                    initial={false}
                    animate={{
                      fillOpacity: isEnel ? (resaltada ? 1 : 0.35) : 1,
                    }}
                    whileHover={
                      isEnel
                        ? {
                            fillOpacity: 1,
                            filter: 'drop-shadow(0 0 12px rgba(245,158,11,0.7))',
                          }
                        : {}
                    }
                    onHoverStart={() => {
                      if (!isEnel) return
                      setActiva(comuna.id)
                      track('mapa.comuna.hover', { comuna: comuna.id })
                    }}
                    onHoverEnd={() => {
                      if (!isEnel) return
                      setActiva((actual) => (actual === comuna.id ? null : actual))
                    }}
                    onTap={() => {
                      if (!isEnel) return
                      setSeleccionada((actual) => (actual === comuna.id ? null : comuna.id))
                      track('mapa.comuna.seleccion', { comuna: comuna.id })
                    }}
                    className={isEnel ? 'cursor-pointer' : ''}
                    style={{ pointerEvents: isEnel ? 'auto' : 'none' }}
                  />
                )
              })}

              {comunas.map((comuna) => {
                const isEnel = comuna.esEnel !== false

                // Nombres muy largos los acortamos para el hexágono
                const nombreCorto = comuna.nombre
                  .replace('San José de Maipo', 'S.J. Maipo')
                  .replace('Estación Central', 'Est. Central')
                  .replace('Pedro Aguirre Cerda', 'P.A.C.')

                return (
                  <text
                    key={`label-${comuna.id}`}
                    x={comuna.cx}
                    y={comuna.cy + 3} // +3 para centrar visualmente con la altura de la fuente
                    textAnchor="middle"
                    className={`pointer-events-none text-[10px] font-bold tracking-tight ${
                      isEnel ? 'fill-white' : 'fill-enel-navy/40'
                    }`}
                  >
                    {nombreCorto}
                  </text>
                )
              })}
            </svg>
          </Reveal>
        </div>
      </motion.div>
    </section>
  )
}
