import { startTransition, useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Buildings,
  Image as ImageIcon,
  CaretLeft,
  CaretRight,
} from '@phosphor-icons/react'
import { motion, useInView, useReducedMotion } from 'motion/react'

import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { centroExcelencia, fotosEquipos, fotosMeOffice } from '@/lib/data/galerias'
import { track } from '@/lib/analytics'
import { clsx } from 'clsx'

import fotoCEO from '@/assets/images/centro_de_exelencia_enel.jpg'

const ORBIT_STEPS = 12
const ORBIT_PATHS = fotosMeOffice.map((_, indice) => {
  const offsetAngle = indice * (360 / fotosMeOffice.length)
  const xPath = []
  const yPath = []
  const rotatePath = []
  for (let i = 0; i <= ORBIT_STEPS; i++) {
    const a = (offsetAngle + i * (360 / ORBIT_STEPS)) * (Math.PI / 180)
    xPath.push(Math.cos(a) * 260)
    yPath.push(Math.sin(a) * 120)
    // Bamboleo suave para que parezcan flotar mientras orbitan
    rotatePath.push(Math.sin(a * 2) * 8)
  }
  return { x: xPath, y: yPath, rotate: rotatePath }
})

const VELOCIDAD = 40

const FOTOS_EQUIPOS_X3 = [...fotosEquipos, ...fotosEquipos, ...fotosEquipos]

export function GaleriasSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const bannerRef = useRef<HTMLDivElement>(null)
  const [activePhoto, setActivePhoto] = useState(0)
  const reduce = useReducedMotion()
  const bannerInView = useInView(bannerRef, { once: true, amount: 0.15 })

  useEffect(() => {
    if (reduce) return
    const trackEl = trackRef.current
    if (!trackEl) return
    trackEl.style.animationDuration = `${VELOCIDAD}s`
  }, [reduce])

  const nextPhoto = () => {
    startTransition(() => {
      setActivePhoto((prev) => (prev + 1) % fotosMeOffice.length)
    })
  }

  const prevPhoto = () => {
    startTransition(() => {
      setActivePhoto((prev) => (prev - 1 + fotosMeOffice.length) % fotosMeOffice.length)
    })
  }

  return (
    <SectionShell id="galerias" className="relative overflow-hidden bg-[#f0eee6]">
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
        className="relative z-10 w-full"
        initial={reduce ? false : { opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
        whileInView={reduce ? undefined : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }}
      >
        <Reveal className="max-w-2xl">
          <div className="border-enel-red bg-enel-red/10 text-enel-red mb-6 inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-sm font-bold tracking-wider uppercase shadow-sm">
            <ImageIcon size={18} weight="bold" /> Galería Visual
          </div>
          <h2 className="text-enel-navy text-4xl font-bold tracking-tight md:text-6xl">
            Un espacio pensado para el equipo
          </h2>
          <p className="mt-6 text-base leading-relaxed font-medium text-neutral-600 md:text-xl">
            Conoce las oficinas donde el equipo construye el día a día del negocio.
          </p>
        </Reveal>

        {/* Mazo Flotante - Me Office */}
        <div className="mt-16 w-full flex flex-col items-center">
          <div className="relative w-full max-w-4xl h-[450px] md:h-[550px] flex items-center justify-center overflow-visible">
            {fotosMeOffice.map((foto, indice) => {
              const isActive = indice === activePhoto
              const orbita = ORBIT_PATHS[indice]!

              return (
                <motion.figure
                  key={foto.src}
                  className="absolute origin-center rounded-md border border-neutral-200 bg-white p-4 pb-16 shadow-[0_20px_40px_rgba(0,0,0,0.12)] cursor-pointer"
                  style={{ width: 'min(75vw, 320px)', zIndex: isActive ? 50 : 10 + indice }}
                  onClick={() => !isActive && setActivePhoto(indice)}
                  animate={
                    isActive
                      ? { x: 0, y: 0, rotate: 0, scale: 1.15, opacity: 1 }
                      : {
                          x: reduce ? orbita.x[0] : orbita.x,
                          y: reduce ? orbita.y[0] : orbita.y,
                          rotate: reduce ? 0 : orbita.rotate,
                          scale: 0.7,
                          opacity: 0.65
                        }
                  }
                  transition={
                    isActive || reduce
                      ? { type: 'spring', stiffness: 220, damping: 22 }
                      : {
                          duration: 12,
                          repeat: Infinity,
                          ease: 'linear',
                        }
                  }
                  whileHover={!isActive ? { scale: 0.75, opacity: 0.95 } : {}}
                >
                  <div className="bg-enel-mist relative aspect-[4/3] overflow-hidden rounded-sm shadow-inner">
                    <img
                      src={foto.src}
                      alt={foto.alt}
                      loading="lazy"
                      className={clsx(
                        "h-full w-full object-cover transition duration-700",
                        isActive ? "grayscale-0" : "grayscale-[40%]"
                      )}
                    />
                  </div>
                  <figcaption className="text-enel-navy absolute bottom-5 left-0 w-full px-4 text-center font-serif text-lg font-medium italic">
                    {foto.alt}
                  </figcaption>
                </motion.figure>
              )
            })}
          </div>

          {/* Controles del Mazo Flotante */}
          <div className="flex items-center gap-4 mt-8 md:mt-2">
            <button
              onClick={prevPhoto}
              className="border-enel-fog/50 text-enel-navy hover:text-enel-red hover:border-enel-red hover:bg-white rounded-full border bg-white/50 backdrop-blur-sm p-3 shadow-sm transition-all"
              aria-label="Foto anterior"
            >
              <CaretLeft size={20} weight="bold" />
            </button>
            <span className="text-sm font-bold text-neutral-500 tracking-widest uppercase">
              {activePhoto + 1} / {fotosMeOffice.length}
            </span>
            <button
              onClick={nextPhoto}
              className="border-enel-fog/50 text-enel-navy hover:text-enel-red hover:border-enel-red hover:bg-white rounded-full border bg-white/50 backdrop-blur-sm p-3 shadow-sm transition-all"
              aria-label="Siguiente foto"
            >
              <CaretRight size={20} weight="bold" />
            </button>
          </div>
        </div>

        <Reveal delay={0.1} className="relative mt-36">
          <div className="mb-10 flex flex-col justify-between gap-6 px-6 md:flex-row md:items-end md:px-12">
            <div>
              <h2 className="text-enel-navy text-3xl font-bold tracking-tight md:text-5xl">
                Descubre al equipo
              </h2>
              <p className="mt-4 font-medium text-neutral-600 md:text-lg">
                La energía que mueve a Chile tiene rostros e historias.
              </p>
            </div>

            {/* Controles del Carrusel */}
          </div>

          {/* Carrusel Horizontal de Polaroids (infinito) */}
          <div className="overflow-hidden px-6 pt-6 pb-20 md:px-12">
            <div
              ref={trackRef}
              className="flex gap-8"
              style={{
                width: 'max-content',
                animation: reduce ? 'none' : `marquee-equipo ${VELOCIDAD}s linear infinite`,
              }}
            >
              {FOTOS_EQUIPOS_X3.map((foto, idx) => (
                <motion.figure
                  key={`${foto.src}-${idx}`}
                  className="cv-auto relative w-[min(65vw,260px)] shrink-0 origin-bottom rounded-md border border-neutral-200 bg-white p-3 pb-12 shadow-[0_15px_40px_rgba(0,0,0,0.12)]"
                  whileHover={{ scale: 1.08, y: -10, rotate: idx % 2 === 0 ? 3 : -3, zIndex: 40 }}
                  initial={{ rotate: idx % 2 === 0 ? -4 : 4 }}
                >
                  <div className="bg-enel-mist relative aspect-4/5 overflow-hidden rounded-sm shadow-inner">
                    <img
                      src={foto.src}
                      alt={foto.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 hover:scale-105"
                    />
                  </div>
                  <figcaption className="absolute bottom-4 left-0 w-full px-3 text-center font-serif text-base font-medium text-neutral-700 italic">
                    {foto.alt}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
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
            <div className="pointer-events-none absolute -top-32 -right-32 h-[30rem] w-[30rem] rounded-full bg-[#f3d9de]/60 blur-[120px]" />
            <div className="relative grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div className="relative z-10">
                <h3 className="text-enel-navy text-3xl leading-tight font-bold tracking-tight md:text-5xl">
                  {centroExcelencia.titulo}
                </h3>
                <p className="text-enel-red-dark mt-4 text-xl font-semibold">
                  {centroExcelencia.subtitulo}
                </p>
                <p className="text-enel-navy/75 mt-6 max-w-xl text-base leading-relaxed">
                  {centroExcelencia.descripcion}
                </p>
                <a
                  href={centroExcelencia.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track('ceo.abrir')}
                  className="bg-enel-navy hover:bg-enel-red-dark hover:shadow-enel-red/40 mt-10 inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-bold tracking-wide text-white uppercase shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <Buildings size={20} weight="fill" />
                  Centro de Excelencia
                  <ArrowUpRight size={18} weight="bold" />
                </a>
              </div>
              <motion.div
                className="group relative z-20 md:-my-24 md:-mr-24"
                initial={reduce ? false : { opacity: 0, scale: 0.85, y: 28 }}
                animate={reduce || !bannerInView ? {} : { opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="absolute inset-0 rounded-3xl bg-[#f3d9de]/50 opacity-60 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
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
      </motion.div>
    </SectionShell>
  )
}
