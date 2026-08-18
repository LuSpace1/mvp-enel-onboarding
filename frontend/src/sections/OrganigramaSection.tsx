import { useState } from 'react'
import { X } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
import { areasStaff, gerenteGeneral, subgerencias } from '@/lib/data/organizacion'
import { videoDeSeccion } from '@/lib/data/videos'

function VideoSubgerencia({ videoSection }: { videoSection: string }) {
  const video = videoDeSeccion(videoSection)
  if (!video) return null
  return (
    <div className="border-enel-fog bg-enel-mist mb-4 overflow-hidden rounded-xl border shadow-sm">
      <VideoEmbed youtubeUrl={video.youtube_url} titulo={video.title} />
    </div>
  )
}

export function OrganigramaSection() {
  const [nodoAbierto, setNodoAbierto] = useState<string | null>(null)
  const reduce = useReducedMotion()

  return (
    <SectionShell
      id="organigrama"
      className="bg-[#f0eee6] bg-[radial-gradient(rgba(10,25,47,0.09)_1.5px,transparent_1.5px)] bg-[size:16px_16px] pt-10 md:pt-14"
      innerClassName="py-12"
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, clipPath: 'inset(8% 8% 8% 8%)' }}
        whileInView={reduce ? undefined : { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.0, ease: [0.23, 1, 0.32, 1] }}
      >
      <Reveal className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className="text-enel-navy text-3xl font-semibold tracking-tight md:text-5xl">
          Equipos y Gerencia
        </h2>
        <p className="mt-4 text-neutral-600">
          Conoce a quienes hacen posible la energía en nuestra red
        </p>
      </Reveal>

      {/* Árbol del Organigrama */}
      <div className="flex w-full flex-col items-center pt-4 pb-10">
        {/* Nodo Raíz: Gerente General */}
        <Reveal delay={0.05} className="z-10">
          <div className="group border-enel-red relative w-80 rounded-[2rem] border-2 bg-white p-6 text-center shadow-xl" style={{ animation: 'float-subtle 4s ease-in-out infinite' }}>
            <span className="bg-enel-red absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[10px] font-bold tracking-[0.2em] text-white uppercase shadow-sm">
              Liderazgo
            </span>
            <img
              src={gerenteGeneral.foto}
              alt={`${gerenteGeneral.nombre}, ${gerenteGeneral.cargo}`}
              className="ring-enel-fog/50 group-hover:ring-enel-red/30 mx-auto h-28 w-28 rounded-full object-cover shadow-inner ring-4 transition-all duration-300"
              loading="lazy"
            />
            <p className="text-enel-red mt-5 text-xs font-bold tracking-[0.15em] uppercase">
              {gerenteGeneral.cargo}
            </p>
            <h3 className="text-enel-navy mt-1 text-2xl font-bold">{gerenteGeneral.nombre}</h3>
            <p className="mt-2 text-[11px] font-medium text-neutral-500">
              {gerenteGeneral.empresa}
            </p>
          </div>
        </Reveal>

        {/* Tronco Principal */}
        <div className="bg-enel-fog/80 h-8 w-0.5" />

        {/* Áreas Staff */}
        <Reveal
          delay={0.1}
          className="border-enel-fog relative z-10 mt-8 max-w-2xl rounded-3xl border-2 border-dashed bg-white/70 p-5 text-center shadow-sm backdrop-blur-sm"
          style={{ animation: 'float-subtle 4s ease-in-out infinite' }}
        >
          <p className="mb-3 text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
            Áreas Staff
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {areasStaff.map((area) => (
              <span
                key={area.id}
                className="text-enel-navy border-enel-fog/50 hover:border-enel-red/50 hover:bg-enel-red/5 rounded-full border bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm transition"
                title={area.detalle}
              >
                {area.nombre}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs font-medium text-neutral-500">
            Las áreas staff dependen directamente de la Gerencia General y dan soporte transversal a
            todas las subgerencias.
          </p>
        </Reveal>

        {/* Tronco hacia abajo después de áreas staff */}
        <div className="bg-enel-fog/80 relative hidden h-10 w-0.5 md:block">
          {/* Línea Horizontal que conecta las subgerencias (ajustada para no desbordar) */}
          <div className="bg-enel-fog/80 absolute bottom-0 left-1/2 h-0.5 w-[calc(100vw-4rem)] max-w-[850px] -translate-x-1/2" />
        </div>

        {/* Ramas de Subgerencias */}
        <div className="relative mt-8 flex w-full max-w-[1000px] flex-col items-center justify-between gap-8 md:mt-0 md:flex-row md:gap-2">
          {/* Tronco vertical central para móvil */}
          <div className="bg-enel-fog/80 absolute top-0 bottom-0 left-1/2 -z-10 block w-0.5 -translate-x-1/2 md:hidden" />

          {subgerencias.map((sub, idx) => (
            <Reveal
              key={sub.id}
              delay={0.15 + idx * 0.05}
              className={`relative flex w-44 flex-col items-center ${nodoAbierto === sub.id ? 'z-50' : 'z-10'}`}
            >
              {/* Tallo Vertical de cada Nodo (Desktop) */}
              <div className="bg-enel-fog/80 hidden h-8 w-0.5 md:block" />

              {/* Nodo Subgerencia */}
              <div
                onClick={() => setNodoAbierto(nodoAbierto === sub.id ? null : sub.id)}
                className={`hover:border-enel-red relative w-full cursor-pointer rounded-[1.5rem] border-2 bg-white p-5 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                  nodoAbierto === sub.id
                    ? 'border-enel-red -translate-y-2 shadow-xl'
                    : 'border-enel-fog/60'
                }`}
                style={{ animation: 'float-subtle 4s ease-in-out infinite' }}
              >
                <img
                  src={sub.foto}
                  alt={sub.subgerente}
                  className={`mx-auto h-20 w-20 rounded-full object-cover shadow-sm ring-4 transition-all duration-300 ${
                    nodoAbierto === sub.id
                      ? 'ring-enel-red/30'
                      : 'hover:ring-enel-red/30 ring-transparent'
                  }`}
                />
                <p className="text-enel-navy mt-4 text-sm leading-tight font-bold">
                  {sub.subgerente}
                </p>
                <p className="mt-1 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                  {sub.sigla}
                </p>
              </div>

              {/* Popover Interactivo (Orientado hacia arriba) */}
              <div
                onClick={(e) => e.stopPropagation()}
                className={`border-enel-fog/50 absolute bottom-[110%] z-50 mb-4 w-[340px] origin-bottom overflow-hidden rounded-[1.5rem] border-2 bg-white shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 ${
                  idx === 0
                    ? 'left-0'
                    : idx === subgerencias.length - 1
                      ? 'right-0'
                      : 'left-1/2 -translate-x-1/2'
                } ${
                  nodoAbierto === sub.id
                    ? 'pointer-events-auto visible scale-100 opacity-100'
                    : 'pointer-events-none invisible scale-95 opacity-0'
                }`}
              >
                {/* Encabezado del Popover */}
                <div className="bg-enel-navy relative flex items-start gap-4 p-5 text-left">
                  <button
                    onClick={() => setNodoAbierto(null)}
                    className="absolute top-3 right-3 rounded-full p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                  <img
                    src={sub.foto}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-white/20"
                    alt=""
                  />
                  <div>
                    <p className="text-enel-red text-[10px] font-bold tracking-[0.2em] uppercase">
                      Subgerencia {sub.sigla}
                    </p>
                    <h4 className="mt-1 text-[13px] leading-tight font-semibold text-white">
                      {sub.nombre}
                    </h4>
                  </div>
                </div>

                {/* Cuerpo del Hover Modal */}
                <div className="bg-white p-5 text-left">
                  <VideoSubgerencia videoSection={sub.videoSection} />
                  <p className="text-xs leading-relaxed text-neutral-600">{sub.proposito}</p>

                  <div className="mt-5">
                    <p className="mb-2 flex items-center gap-1.5 text-[9px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                      <span className="bg-enel-red h-1.5 w-1.5 rounded-full" />
                      Principales procesos
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {sub.procesos.map((proc) => (
                        <span
                          key={proc}
                          className="border-enel-fog/70 text-enel-navy rounded-full border bg-[#f0eee6] px-2 py-1 text-[10px] font-medium"
                        >
                          {proc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      </motion.div>
    </SectionShell>
  )
}
