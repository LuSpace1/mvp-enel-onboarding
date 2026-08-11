import { useState } from 'react'
import { motion } from 'motion/react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { pilaresCultura, valoresCultura } from '@/lib/data/cultura'

export function CulturaSection() {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({})

  const toggleFlip = (palabra: string) => {
    setFlippedCards((prev) => ({ ...prev, [palabra]: !prev[palabra] }))
  }

  return (
    <SectionShell id="cultura" className="bg-[#f0eee6] relative overflow-hidden">
      {/* Fondo Cuadernillo Global */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(10, 25, 47, 0.35) 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
        }}
      />
      <Reveal className="max-w-2xl relative z-10">
        <h2 className="text-enel-navy text-3xl font-semibold tracking-tight md:text-5xl">
          Cómo trabajamos
        </h2>
        <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">
          Nuestra cultura se construye día a día a través de acciones, decisiones y comportamientos
          que compartimos como equipo.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-2 relative z-10">
        {pilaresCultura.map((pilar, indice) => (
          <Reveal
            key={pilar.id}
            delay={indice * 0.06}
            className={indice === pilaresCultura.length - 1 ? 'lg:col-span-2' : ''}
          >
            <article className="group relative h-full overflow-hidden rounded-2xl bg-enel-fog/40 p-[2px] shadow-sm transition-shadow hover:shadow-xl">
              {/* Capa giratoria del borde eléctrico (Chispa) */}
              <div 
                className="absolute inset-[-100%] z-0 animate-[spin_2s_linear_infinite] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ 
                  backgroundImage: 'conic-gradient(from 0deg, transparent 35%, rgba(251, 191, 36, 1) 48%, rgba(255, 255, 255, 1) 50%, transparent 50%, transparent 85%, rgba(251, 191, 36, 1) 98%, rgba(255, 255, 255, 1) 100%)' 
                }} 
              />
              
              {/* Contenedor Interior (La Máscara) */}
              <div className="relative z-10 flex h-full flex-col rounded-[14px] bg-white p-7">
                <span className="bg-enel-red block h-1 w-8 rounded-full transition-all group-hover:w-12" />
                <h3 className="text-enel-navy mt-3 text-xl font-semibold tracking-tight">
                  {pilar.titulo}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{pilar.descripcion}</p>
                <ul className="mt-auto pt-5 flex flex-wrap gap-2">
                  {pilar.puntos.map((punto) => (
                    <li
                      key={punto}
                      className="bg-enel-mist text-enel-navy group-hover:bg-enel-red/10 group-hover:text-enel-red-dark rounded-full px-3 py-1 text-xs font-medium transition"
                    >
                      {punto}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className="mt-16 relative z-10">
        <div className="bg-enel-navy flex flex-col items-center justify-center rounded-3xl px-8 py-10 text-center">
          <h3 className="text-2xl font-semibold tracking-tight text-white md:text-3xl max-w-2xl">
            Construir el futuro a través de la energía sustentable
          </h3>
        </div>
      </Reveal>

      {/* Tarjetas Interactivas Volteables (Valores) */}
      <Reveal delay={0.2} className="mt-12 mb-10 relative z-10">
        <div className="flex flex-col items-center">
          <p className="mb-8 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Construimos el futuro a base de
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            {valoresCultura.map((valor) => {
              const isFlipped = flippedCards[valor.palabra]
              return (
                <div 
                  key={valor.palabra} 
                  className="relative h-32 w-32 cursor-pointer [perspective:1000px]" 
                  onClick={() => toggleFlip(valor.palabra)}
                >
                  <motion.div 
                    className="relative h-full w-full rounded-2xl shadow-sm transition-shadow hover:shadow-lg [transform-style:preserve-3d]"
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 220, damping: 20 }}
                  >
                    {/* Frente (Signo de interrogación) */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-enel-fog/70 bg-white [backface-visibility:hidden]">
                      <span className="text-5xl font-extrabold text-enel-red drop-shadow-sm">?</span>
                    </div>
                    {/* Dorso (Palabra) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-enel-navy bg-enel-navy p-3 [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-inner">
                      <span className="text-center text-sm font-bold uppercase tracking-wide text-white drop-shadow-md">
                        {valor.palabra}
                      </span>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </Reveal>
    </SectionShell>
  )
}
