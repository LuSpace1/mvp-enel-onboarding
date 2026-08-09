import { useRef } from 'react'
import { ArrowUpRight, Buildings, Image as ImageIcon, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { motion } from 'motion/react'

import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { centroExcelencia, fotosEquipos, fotosMeOffice } from '@/lib/data/galerias'
import { track } from '@/lib/analytics'
import { clsx } from 'clsx'

import fotoMUT2 from '@/assets/images/MUT-02.jpg'

const ROTATIONS = ['-rotate-3', 'rotate-2', '-rotate-6', 'rotate-6', '-rotate-2', 'rotate-3']

export function GaleriasSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 300
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
    }
  }

  return (
    <SectionShell id="galerias" className="bg-[#f0eee6] relative overflow-hidden">
      {/* Fondo Cuadernillo Global */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(10, 25, 47, 0.35) 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
        }}
      />

      <div className="relative z-10 w-full">
        <Reveal className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-enel-red bg-enel-red/10 px-4 py-1.5 text-sm font-bold text-enel-red uppercase tracking-wider mb-6 shadow-sm">
            <ImageIcon size={18} weight="bold" /> Galería Visual
          </div>
          <h2 className="text-enel-navy text-4xl font-bold tracking-tight md:text-6xl">
            Un espacio pensado para el equipo
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600 md:text-xl font-medium">
            Conoce las oficinas donde el equipo construye el día a día del negocio.
          </p>
        </Reveal>

        {/* Polaroids - Me Office */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 px-2 md:px-6">
          {fotosMeOffice.map((foto, indice) => {
            const rot = ROTATIONS[indice % ROTATIONS.length]
            return (
              <Reveal key={foto.src} delay={indice * 0.1}>
                <motion.figure 
                  whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
                  className={clsx(
                    "group relative bg-white p-4 pb-16 shadow-[0_15px_35px_rgba(0,0,0,0.08)] transition-all duration-300 rounded-md cursor-pointer origin-center border border-neutral-200",
                    rot
                  )}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-inner bg-enel-mist">
                    <img
                      src={foto.src}
                      alt={foto.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110 grayscale-[15%] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-enel-red/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <figcaption className="absolute bottom-5 left-0 w-full text-center font-serif italic text-lg font-medium text-enel-navy/80 px-4">
                    {foto.alt}
                  </figcaption>
                </motion.figure>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.1} className="mt-36 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between px-6 md:px-12 mb-10 gap-6">
            <div>
              <h2 className="text-enel-navy text-3xl font-bold tracking-tight md:text-5xl">
                Descubre al equipo
              </h2>
              <p className="mt-4 text-neutral-600 md:text-lg font-medium">
                La energía que mueve a Chile tiene rostros e historias.
              </p>
            </div>
            
            {/* Controles del Carrusel */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => scroll('left')}
                className="bg-white border border-enel-fog/50 text-enel-navy hover:text-enel-red hover:border-enel-red p-3 rounded-full shadow-sm transition-colors"
                aria-label="Anterior foto"
              >
                <CaretLeft size={20} weight="bold" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="bg-white border border-enel-fog/50 text-enel-navy hover:text-enel-red hover:border-enel-red p-3 rounded-full shadow-sm transition-colors"
                aria-label="Siguiente foto"
              >
                <CaretRight size={20} weight="bold" />
              </button>
            </div>
          </div>
          
          {/* Carrusel Horizontal de Polaroids */}
          <div 
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-8 overflow-x-auto pb-20 px-6 md:px-12 pt-6 scroll-smooth" 
            style={{ scrollbarWidth: 'none' }}
          >
            <style>{`::-webkit-scrollbar { display: none; }`}</style>
            {fotosEquipos.map((foto, idx) => (
              <motion.figure 
                key={foto.src} 
                className="w-[min(65vw,260px)] shrink-0 snap-center relative bg-white p-3 pb-12 shadow-[0_15px_40px_rgba(0,0,0,0.12)] rounded-md origin-bottom border border-neutral-200"
                whileHover={{ scale: 1.08, y: -10, rotate: idx % 2 === 0 ? 3 : -3, zIndex: 40 }}
                initial={{ rotate: idx % 2 === 0 ? -4 : 4 }}
              >
                <div className="relative aspect-4/5 overflow-hidden rounded-sm shadow-inner bg-enel-mist">
                  <img
                    src={foto.src}
                    alt={foto.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />
                </div>
                <figcaption className="absolute bottom-4 left-0 w-full text-center font-serif italic text-base font-medium text-neutral-700 px-3">
                  {foto.alt}
                </figcaption>
              </motion.figure>
            ))}
            {/* Spacer */}
            <div className="w-8 shrink-0" aria-hidden="true" />
          </div>
        </Reveal>

        {/* Banner CEO */}
        <Reveal delay={0.2} className="mt-32">
          <div className="bg-enel-navy relative overflow-visible rounded-[2rem] px-8 py-12 md:px-16 md:py-16 shadow-[0_30px_70px_rgba(10,25,47,0.4)] border-4 border-white/20">
            <div className="bg-enel-red/40 pointer-events-none absolute -top-32 -right-32 h-[30rem] w-[30rem] rounded-full blur-[120px]" />
            <div className="relative grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div className="relative z-10">
                <h3 className="text-3xl font-bold tracking-tight text-white md:text-5xl leading-tight">
                  {centroExcelencia.titulo}
                </h3>
                <p className="mt-4 text-xl font-semibold text-enel-pink">{centroExcelencia.subtitulo}</p>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80">
                  {centroExcelencia.descripcion}
                </p>
                <a
                  href={centroExcelencia.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track('ceo.abrir')}
                  className="bg-white hover:bg-enel-red hover:text-white text-enel-navy mt-10 inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm uppercase tracking-wide font-bold transition-all duration-300 shadow-xl hover:shadow-enel-red/50 hover:-translate-y-1"
                >
                  <Buildings size={20} weight="fill" />
                  Centro de Excelencia
                  <ArrowUpRight size={18} weight="bold" />
                </a>
              </div>
              <div className="relative z-20 md:-mr-24 md:-my-24 group">
                <div className="absolute inset-0 bg-enel-red/30 blur-3xl rounded-3xl transition-opacity group-hover:opacity-100 opacity-60" />
                <motion.img
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  src={fotoMUT2}
                  alt="Centro de Excelencia Operacional iluminado"
                  loading="lazy"
                  className="relative aspect-[4/3] w-full rounded-2xl object-cover shadow-[0_25px_60px_rgba(0,0,0,0.6)] border-4 border-white"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  )
}
