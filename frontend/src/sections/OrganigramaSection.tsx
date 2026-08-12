import { useState } from 'react'
import { X } from '@phosphor-icons/react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
import { areasStaff, gerenteGeneral, subgerencias } from '@/lib/data/organizacion'
import { videoDeSeccion } from '@/lib/data/videos'

export function OrganigramaSection() {
  const [nodoAbierto, setNodoAbierto] = useState<string | null>(null)

  return (
    <SectionShell 
      id="organigrama" 
      className="bg-[#f0eee6] bg-[radial-gradient(rgba(10,25,47,0.09)_1.5px,transparent_1.5px)] bg-[size:16px_16px] pt-10 md:pt-14" 
      innerClassName="py-12"
    >
      <Reveal className="max-w-2xl mx-auto text-center mb-16">
        <h2 className="text-enel-navy text-3xl font-semibold tracking-tight md:text-5xl">
          Equipos y Gerencia
        </h2>
        <p className="mt-4 text-neutral-600">Conoce a quienes hacen posible la energía en nuestra red</p>
      </Reveal>

      {/* Árbol del Organigrama */}
      <div className="w-full pb-10 pt-4 flex flex-col items-center">
          
          {/* Nodo Raíz: Gerente General */}
          <Reveal delay={0.05} className="z-10">
            <div className="group relative w-80 rounded-[2rem] border-2 border-enel-red bg-white p-6 shadow-xl text-center">
              <span className="bg-enel-red absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[10px] font-bold tracking-[0.2em] text-white uppercase shadow-sm">
                Liderazgo
              </span>
              <img
                src={gerenteGeneral.foto}
                alt={`${gerenteGeneral.nombre}, ${gerenteGeneral.cargo}`}
                className="mx-auto h-28 w-28 rounded-full object-cover shadow-inner ring-4 ring-enel-fog/50 group-hover:ring-enel-red/30 transition-all duration-300"
                loading="lazy"
              />
              <p className="mt-5 text-xs font-bold tracking-[0.15em] text-enel-red uppercase">
                {gerenteGeneral.cargo}
              </p>
              <h3 className="mt-1 text-2xl font-bold text-enel-navy">
                {gerenteGeneral.nombre}
              </h3>
              <p className="mt-2 text-[11px] font-medium text-neutral-500">
                {gerenteGeneral.empresa}
              </p>
            </div>
          </Reveal>

          {/* Tronco Principal */}
          <div className="h-8 w-0.5 bg-enel-fog/80" />

          {/* Áreas Staff */}
          <Reveal delay={0.1} className="z-10 bg-white/70 backdrop-blur-sm border-2 border-dashed border-enel-fog rounded-3xl p-5 shadow-sm relative text-center max-w-2xl mt-8">
            <p className="mb-3 text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
              Áreas Staff
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {areasStaff.map((area) => (
                <span
                  key={area.id}
                  className="bg-white text-enel-navy border border-enel-fog/50 rounded-full px-3 py-1.5 text-[11px] font-medium shadow-sm transition hover:border-enel-red/50 hover:bg-enel-red/5"
                  title={area.detalle}
                >
                  {area.nombre}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs font-medium text-neutral-500">
              Las áreas staff dependen directamente de la Gerencia General y dan soporte transversal a todas las subgerencias.
            </p>
          </Reveal>

          {/* Tronco hacia abajo después de áreas staff */}
          <div className="hidden md:block h-10 w-0.5 bg-enel-fog/80 relative">
             {/* Línea Horizontal que conecta las subgerencias (ajustada para no desbordar) */}
             <div className="absolute bottom-0 left-1/2 w-[calc(100vw-4rem)] max-w-[850px] -translate-x-1/2 h-0.5 bg-enel-fog/80" />
          </div>

          {/* Ramas de Subgerencias */}
          <div className="flex flex-col md:flex-row w-full max-w-[1000px] justify-between items-center gap-8 md:gap-2 mt-8 md:mt-0 relative">
            {/* Tronco vertical central para móvil */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-enel-fog/80 -translate-x-1/2 block md:hidden -z-10" />

            {subgerencias.map((sub, idx) => (
              <Reveal key={sub.id} delay={0.15 + idx * 0.05} className={`relative flex flex-col items-center w-44 ${nodoAbierto === sub.id ? 'z-50' : 'z-10'}`}>
                {/* Tallo Vertical de cada Nodo (Desktop) */}
                <div className="hidden md:block h-8 w-0.5 bg-enel-fog/80" />
                
                {/* Nodo Subgerencia */}
                <div 
                  onClick={() => setNodoAbierto(nodoAbierto === sub.id ? null : sub.id)}
                  className={`relative w-full rounded-[1.5rem] border-2 bg-white p-5 text-center shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:border-enel-red hover:shadow-xl ${
                    nodoAbierto === sub.id ? '-translate-y-2 border-enel-red shadow-xl' : 'border-enel-fog/60'
                  }`}
                >
                  <img
                    src={sub.foto}
                    alt={sub.subgerente}
                    className={`mx-auto h-20 w-20 rounded-full object-cover shadow-sm ring-4 transition-all duration-300 ${
                      nodoAbierto === sub.id ? 'ring-enel-red/30' : 'ring-transparent hover:ring-enel-red/30'
                    }`}
                  />
                  <p className="mt-4 text-sm font-bold leading-tight text-enel-navy">
                    {sub.subgerente}
                  </p>
                  <p className="mt-1 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                    {sub.sigla}
                  </p>
                </div>

                {/* Popover Interactivo (Orientado hacia arriba) */}
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className={`absolute bottom-[110%] w-[340px] mb-4 origin-bottom transition-all duration-300 z-50 overflow-hidden rounded-[1.5rem] border-2 border-enel-fog/50 bg-white shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.25)] ${
                  idx === 0 ? 'left-0' : idx === subgerencias.length - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2'
                  } ${
                  nodoAbierto === sub.id ? 'opacity-100 visible scale-100 pointer-events-auto' : 'opacity-0 invisible scale-95 pointer-events-none'
                  }`}
                >
                  
                  {/* Encabezado del Popover */}
                  <div className="bg-enel-navy relative flex items-start gap-4 p-5 text-left">
                    <button
                      onClick={() => setNodoAbierto(null)}
                      className="absolute top-3 right-3 p-1.5 rounded-full text-white/50 hover:bg-white/10 hover:text-white transition"
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
                      <h4 className="mt-1 text-[13px] font-semibold text-white leading-tight">
                        {sub.nombre}
                      </h4>
                    </div>
                  </div>

                  {/* Cuerpo del Hover Modal */}
                  <div className="p-5 text-left bg-white">
                    {videoDeSeccion(sub.videoSection) && (
                      <div className="mb-4 overflow-hidden rounded-xl shadow-sm border border-enel-fog bg-enel-mist">
                        <VideoEmbed
                          youtubeUrl={videoDeSeccion(sub.videoSection)!.youtube_url}
                          titulo={videoDeSeccion(sub.videoSection)!.title}
                        />
                      </div>
                    )}
                    <p className="text-xs leading-relaxed text-neutral-600">
                      {sub.proposito}
                    </p>
                    
                    <div className="mt-5">
                      <p className="mb-2 flex items-center gap-1.5 text-[9px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                        <span className="bg-enel-red h-1.5 w-1.5 rounded-full" />
                        Principales procesos
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {sub.procesos.map((proc) => (
                          <span
                            key={proc}
                            className="bg-[#f0eee6] border border-enel-fog/70 text-enel-navy rounded-full px-2 py-1 text-[10px] font-medium"
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
    </SectionShell>
  )
}
