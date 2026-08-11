import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Buildings, Image as ImageIcon, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { motion, useAnimationFrame, useInView, useReducedMotion } from 'motion/react'

import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { centroExcelencia, fotosEquipos, fotosMeOffice } from '@/lib/data/galerias'
import { track } from '@/lib/analytics'
import { clsx } from 'clsx'

import fotoCEO from '@/assets/images/centro_de_exelencia_enel.jpg'

const ROTATIONS = ['-rotate-3', 'rotate-2', '-rotate-6', 'rotate-6', '-rotate-2', 'rotate-3']

export function GaleriasSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const bannerRef = useRef<HTMLDivElement>(null)
  const resumeTimeout = useRef<number | undefined>(undefined)
  const [pausado, setPausado] = useState(false)
  const reduce = useReducedMotion()
  const bannerInView = useInView(bannerRef, { once: true, amount: 0.15 })

  useAnimationFrame((_, delta) => {
    const el = scrollRef.current
    if (!el || reduce || pausado || document.hidden) return
    const velocidad = 0.04
    el.scrollLeft += delta * velocidad
    const mitad = el.scrollWidth / 2
    if (el.scrollLeft >= mitad) el.scrollLeft -= mitad
  })

  useEffect(() => () => window.clearTimeout(resumeTimeout.current), [])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    setPausado(true)
    const amount = 300
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
    window.clearTimeout(resumeTimeout.current)
    resumeTimeout.current = window.setTimeout(() => setPausado(false), 2500)
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
          
          {/* Carrusel Horizontal de Polaroids (infinito) */}
          <div 
            ref={scrollRef}
            onMouseEnter={() => setPausado(true)}
            onMouseLeave={() => setPausado(false)}
            className="flex gap-8 overflow-x-auto pb-20 px-6 md:px-12 pt-6"
            style={{ scrollbarWidth: 'none' }}
          >
            <style>{`::-webkit-scrollbar { display: none; }`}</style>
            {[...fotosEquipos, ...fotosEquipos].map((foto, idx) => (
              <motion.figure 
                key={`${foto.src}-${idx}`} 
                className="w-[min(65vw,260px)] shrink-0 relative bg-white p-3 pb-12 shadow-[0_15px_40px_rgba(0,0,0,0.12)] rounded-md origin-bottom border border-neutral-200"
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
          </div>
        </Reveal>

        {/* Banner CEO */}
        <motion.div
          ref={bannerRef}
          className="mt-32"
          initial={reduce ? false : { opacity: 0, scaleY: 0.55, y: 48 }}
          animate={reduce || !bannerInView ? {} : { opacity: 1, scaleY: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 70, damping: 18 }}
          style={{ transformOrigin: 'bottom center' }}
        >
          <div className="relative overflow-visible rounded-[2rem] border-4 border-white/70 bg-gradient-to-br from-[#eef5fc] to-[#d3e3f4] px-8 py-12 shadow-[0_24px_60px_rgba(20,50,90,0.18)] md:px-16 md:py-16">
            <div className="bg-[#f3d9de]/60 pointer-events-none absolute -top-32 -right-32 h-[30rem] w-[30rem] rounded-full blur-[120px]" />
            <div className="relative grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div className="relative z-10">
                <h3 className="text-enel-navy text-3xl font-bold tracking-tight leading-tight md:text-5xl">
                  {centroExcelencia.titulo}
                </h3>
                <p className="text-enel-red-dark mt-4 text-xl font-semibold">{centroExcelencia.subtitulo}</p>
                <p className="text-enel-navy/75 mt-6 max-w-xl text-base leading-relaxed">
                  {centroExcelencia.descripcion}
                </p>
                <a
                  href={centroExcelencia.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track('ceo.abrir')}
                  className="bg-enel-navy hover:bg-enel-red-dark text-white mt-10 inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm uppercase tracking-wide font-bold transition-all duration-300 shadow-xl hover:shadow-enel-red/40 hover:-translate-y-1"
                >
                  <Buildings size={20} weight="fill" />
                  Centro de Excelencia
                  <ArrowUpRight size={18} weight="bold" />
                </a>
              </div>
              <motion.div
                className="group relative z-20 md:-mr-24 md:-my-24"
                initial={reduce ? false : { opacity: 0, scale: 0.85, y: 28 }}
                animate={reduce || !bannerInView ? {} : { opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="bg-[#f3d9de]/50 absolute inset-0 rounded-3xl opacity-60 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
                <motion.img
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  src={fotoCEO}
                  alt="Centro de Excelencia Operacional"
                  loading="lazy"
                  className="relative aspect-[4/3] w-full rounded-2xl border-4 border-white object-cover shadow-[0_25px_60px_rgba(20,50,90,0.35)]"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  )
}
