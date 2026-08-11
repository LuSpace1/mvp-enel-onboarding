import { useState } from 'react'
import { MapPin } from '@phosphor-icons/react'
import { motion } from 'motion/react'

import { Reveal } from '@/components/ui/Reveal'
import { comunas } from '@/lib/data/comunas'
import { track } from '@/lib/analytics'

export function MapaConcesionSection() {
  const [activa, setActiva] = useState<string | null>(null)
  const [seleccionada, setSeleccionada] = useState<string | null>(null)

  const comunaActiva = comunas.find((comuna) => comuna.id === activa)

  return (
    <section id="mapa" className="bg-enel-navy relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.9) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-5 md:px-8">
        <div className="flex flex-col items-center text-center">
          <Reveal className="mb-12 max-w-2xl">
            <p className="text-enel-red text-sm font-semibold tracking-[0.2em] uppercase">
              Nuestra concesión
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
              33 comunas que se encienden con nosotros
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/70">
              Cubrimos gran parte de la Región Metropolitana, incluyendo la zona de nuestra
              subsidiaria Enel Colina S.A. Las comunas iluminadas en rojo representan nuestra área
              de servicio.
            </p>

            <div className="mx-auto mt-8 flex max-w-xs items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              <MapPin size={18} className="text-enel-red shrink-0" weight="duotone" />
              {comunaActiva ? (
                <span className="font-semibold text-white">{comunaActiva.nombre}</span>
              ) : (
                <span className="italic">Explora el mapa…</span>
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
                <linearGradient id="cordillera" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#12263f" />
                  <stop offset="100%" stopColor="#0b1b2f" />
                </linearGradient>
                <radialGradient id="foco-encendido" cx="50%" cy="50%" r="75%">
                  <stop offset="0%" stopColor="#fef08a" /> {/* Amarillo centro ampolleta */}
                  <stop offset="40%" stopColor="#f59e0b" /> {/* Naranjo amarillento */}
                  <stop offset="100%" stopColor="#1e3a8a" /> {/* Azul oscuro bordes */}
                </radialGradient>
              </defs>

              <path
                d="M440 0 L640 0 L640 700 L390 700 C 470 580 470 180 440 0 Z"
                fill="url(#cordillera)"
              />

              {comunas.map((comuna) => {
                const isEnel = comuna.esEnel !== false
                const resaltada = (activa === comuna.id || seleccionada === comuna.id) && isEnel

                return (
                  <motion.path
                    key={comuna.id}
                    d={comuna.path}
                    fill={isEnel ? 'url(#foco-encendido)' : 'rgba(255,255,255,0.03)'}
                    stroke="rgba(255,255,255,0.15)"
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
                // @ts-ignore - usamos cx/cy añadidos en comunas.ts
                const { cx, cy } = comuna

                // Nombres muy largos los acortamos para el hexágono
                const nombreCorto = comuna.nombre
                  .replace('San José de Maipo', 'S.J. Maipo')
                  .replace('Estación Central', 'Est. Central')
                  .replace('Pedro Aguirre Cerda', 'P.A.C.')

                return (
                  <text
                    key={`label-${comuna.id}`}
                    x={cx}
                    y={cy + 3} // +3 para centrar visualmente con la altura de la fuente
                    textAnchor="middle"
                    className={`pointer-events-none text-[10px] font-bold tracking-tight ${
                      isEnel ? 'fill-white/80' : 'fill-white/30'
                    }`}
                  >
                    {nombreCorto}
                  </text>
                )
              })}
            </svg>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
