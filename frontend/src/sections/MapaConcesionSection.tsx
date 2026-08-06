import { useState } from 'react'
import { MapPin } from '@phosphor-icons/react'
import { motion } from 'motion/react'

import { Reveal } from '@/components/ui/Reveal'
import { comunas } from '@/lib/data/comunas'
import { track } from '@/lib/analytics'

const COMUNAS_CON_LABEL = new Set([
  'maipu',
  'las-condes',
  'santiago',
  'pudahuel',
  'la-florida',
  'colina',
  'lo-barnechea',
])

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

      <div className="relative mx-auto w-full max-w-6xl px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <p className="text-enel-red text-sm font-semibold tracking-[0.2em] uppercase">
              Nuestra concesión
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">
              33 comunas que se encienden con nosotros
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
              Cubrimos la Región Metropolitana, incluyendo la zona de nuestra subsidiaria Enel
              Colina S.A. Pasa sobre cada comuna para iluminarla.
            </p>

            <div className="mt-8 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              <MapPin size={18} className="text-enel-red shrink-0" weight="duotone" />
              {comunaActiva ? (
                <span className="font-semibold text-white">{comunaActiva.nombre}</span>
              ) : (
                <span className="italic">Explora el mapa…</span>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <svg
              viewBox="0 0 640 700"
              className="w-full max-w-xl"
              role="img"
              aria-label="Mapa de las 33 comunas de la zona de concesión de Enel Distribución Chile"
            >
              <defs>
                <linearGradient id="cordillera" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#12263f" />
                  <stop offset="100%" stopColor="#0b1b2f" />
                </linearGradient>
              </defs>

              <path
                d="M440 0 L640 0 L640 700 L390 700 C 470 580 470 180 440 0 Z"
                fill="url(#cordillera)"
              />

              {comunas.map((comuna) => {
                const resaltada = activa === comuna.id || seleccionada === comuna.id
                return (
                  <motion.path
                    key={comuna.id}
                    d={comuna.path}
                    fill={resaltada ? '#ef1e25' : 'rgba(255,255,255,0.10)'}
                    stroke="#0b1b2f"
                    strokeWidth={2}
                    strokeLinejoin="round"
                    initial={false}
                    animate={{
                      fill: resaltada ? '#ef1e25' : 'rgba(255,255,255,0.10)',
                    }}
                    whileHover={{
                      fill: '#ef1e25',
                      filter: 'drop-shadow(0 0 10px rgba(239,30,37,0.9))',
                    }}
                    onHoverStart={() => {
                      setActiva(comuna.id)
                      track('mapa.comuna.hover', { comuna: comuna.id })
                    }}
                    onHoverEnd={() => setActiva((actual) => (actual === comuna.id ? null : actual))}
                    onTap={() => {
                      setSeleccionada((actual) => (actual === comuna.id ? null : comuna.id))
                      track('mapa.comuna.seleccion', { comuna: comuna.id })
                    }}
                    className="cursor-pointer"
                  />
                )
              })}

              {comunas
                .filter((comuna) => COMUNAS_CON_LABEL.has(comuna.id))
                .map((comuna) => {
                  const centro = comuna.path.match(/M([\d.]+),([\d.]+)/)
                  return (
                    <text
                      key={`label-${comuna.id}`}
                      x={centro?.[1] ?? '0'}
                      y={centro?.[2] ?? '0'}
                      textAnchor="middle"
                      className="pointer-events-none fill-white/40 text-[9px] font-medium"
                    >
                      {comuna.nombre}
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
