import { ArrowDown, BookOpen, CaretRight, PlayCircle } from '@phosphor-icons/react'

import { motion, useReducedMotion } from 'motion/react'
import { Reveal } from '@/components/ui/Reveal'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
import { track } from '@/lib/analytics'
import { useViajeStore } from '@/store/useViajeStore'
import { PASOS_VIAJE } from '@/lib/data/viaje'
import { videoDeSeccion } from '@/lib/data/videos'
import { clsx } from 'clsx'

import fotoMUT from '@/assets/images/MUT.jpg'

const PIEZAS = [
  { col: 'lg:col-span-4', start: 'lg:col-start-1', rot: 0.8, topo: 'lg:mt-0', grande: true },
  { col: 'lg:col-span-2', start: 'lg:col-start-5', rot: -4.5, topo: 'lg:mt-14' },
  { col: 'lg:col-span-3', start: 'lg:col-start-1', rot: -2.3, topo: 'lg:mt-8' },
  { col: 'lg:col-span-3', start: 'lg:col-start-4', rot: 1.8, topo: 'lg:mt-0' },
  { col: 'lg:col-span-3', start: 'lg:col-start-4', rot: -3.2, topo: 'lg:mt-12' },
  { col: 'lg:col-span-3', start: 'lg:col-start-1', rot: 2.4, topo: 'lg:mt-4' },
  { col: 'lg:col-span-4', start: 'lg:col-start-4', rot: -1.2, topo: 'lg:mt-16', grande: true },
  { col: 'lg:col-span-3', start: 'lg:col-start-1', rot: 2.6, topo: 'lg:mt-0' },
  { col: 'lg:col-span-3', start: 'lg:col-start-4', rot: -2.1, topo: 'lg:mt-20' },
  { col: 'lg:col-span-4', start: 'lg:col-start-1', rot: 1.1, topo: 'lg:mt-6', grande: true },
  { col: 'lg:col-span-2', start: 'lg:col-start-5', rot: -3.5, topo: 'lg:mt-0' },
  { col: 'lg:col-span-6', start: 'lg:col-start-1', rot: 0.6, topo: 'lg:mt-14' },
]

const STICKER_EDITORIAL = 'bg-amber-300 text-enel-navy'

const STAMPAS = [
  'border-enel-navy/80 bg-[#f0eee6] text-enel-navy',
  'border-enel-navy bg-enel-navy text-white',
  'border-enel-red bg-enel-red/10 text-enel-navy',
  'border-amber-400 bg-amber-100 text-enel-navy',
]

export function PortadaDelViaje() {
  const pasoActual = useViajeStore((estado) => estado.pasoActual)
  const video = videoDeSeccion('hero_main')
  const reduce = useReducedMotion()

  return (
    <>
      <section className="bg-enel-navy relative flex min-h-[72dvh] items-center overflow-hidden py-16 md:min-h-[80dvh] md:py-24">
        <div className="pointer-events-none absolute inset-0">
          <motion.img
            src={fotoMUT}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-[0.55]"
            initial={reduce ? false : { scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.55 }}
            transition={{ duration: 2.0, ease: [0.25, 1, 0.5, 1] }}
          />
          <motion.div
            className="from-enel-navy via-enel-navy/70 to-enel-navy-soft/30 absolute inset-0 bg-gradient-to-b"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
          />
        </div>

        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-5 text-center md:px-8">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <h1 className="w-full text-4xl leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4rem] xl:whitespace-nowrap">
              Bienvenido a <span className="text-enel-red">Enel Distribución</span>.
            </h1>
          </motion.div>

          {video && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 w-full"
            >
              <VideoEmbed youtubeUrl={video.youtube_url} titulo={video.title} />
            </motion.div>
          )}

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col items-center"
          >
            <p className="max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
              Bienvenido a Enel Distribución. En este sitio, encontrarás todo lo que necesitas saber
              sobre el negocio, nuestra cultura organizacional, quiénes somos y cómo trabajamos para
              ser la empresa de distribución de energía eléctrica más grande de Chile.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  track('portada.cta.iniciar')
                  const el = document.getElementById('historia')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className="bg-enel-pink hover:bg-enel-pink/80 shadow-enel-pink/30 border-enel-pink inline-flex h-12 items-center gap-2 rounded-full border-2 px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
                data-analytics-component="portada"
                data-analytics-accion="iniciar"
              >
                Comenzar el viaje
                <ArrowDown size={18} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => {
                  track('portada.cta.equipo')
                  const el = document.getElementById('organigrama')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                data-analytics-component="portada"
                data-analytics-accion="conocer-equipo"
              >
                <PlayCircle size={18} weight="duotone" />
                Conocer el equipo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="mapa-del-viaje" className="relative overflow-hidden bg-[#f0eee6] py-20 md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-multiply"
          style={{
            backgroundImage: 'radial-gradient(rgba(10, 25, 47, 0.35) 1.5px, transparent 1.5px)',
            backgroundSize: '16px 16px',
          }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="bg-enel-red/10 absolute -top-28 -left-28 h-96 w-96 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-32 h-[26rem] w-[26rem] rounded-full bg-emerald-300/25 blur-3xl" />
          <div className="absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-amber-200/60 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-5 md:px-8">
          <Reveal>
            <h2 className="text-enel-navy max-w-3xl text-4xl leading-[1.02] font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Elige tu ruta<span className="text-enel-red"> por el portal</span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-600 md:text-lg">
              No hay un único camino. Salta entre capítulos en el orden que se te antoje.
            </p>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {PASOS_VIAJE.map((paso, indice) => {
              const pieza = PIEZAS[indice % PIEZAS.length] ?? PIEZAS[0]!
              const esOscura = indice % STAMPAS.length === 1
              return (
                <motion.div
                  key={paso.id}
                  className={clsx(pieza.col, pieza.start, pieza.topo)}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={reduce ? undefined : { y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    type: 'spring',
                    bounce: 0,
                    duration: 0.6,
                    delay: (indice % 4) * 0.06,
                  }}
                >
                  <motion.button
                    type="button"
                    onClick={() => {
                      track('viaje.nodo', { paso: paso.id })
                      const el = document.getElementById(paso.id)
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}
                    initial={reduce ? false : { rotate: pieza.rot }}
                    whileHover={reduce ? undefined : { rotate: 0, scale: 1.02, y: -4 }}
                    whileTap={reduce ? undefined : { scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 360, damping: 24 }}
                    className={clsx(
                      'group relative flex h-full w-full flex-col rounded-[20px] border-2 text-left shadow-[6px_6px_0_0_rgba(10,25,47,0.07)] transition-shadow hover:shadow-[8px_8px_0_0_rgba(235,0,83,0.14)]',
                      pieza.grande ? 'p-6 md:p-7' : 'p-5',
                      STAMPAS[indice % STAMPAS.length],
                      pasoActual === paso.id && 'ring-enel-pink/70 ring-2 ring-offset-4',
                    )}
                    aria-current={pasoActual === paso.id ? 'page' : undefined}
                    data-analytics-component="mapa-viaje"
                    data-analytics-estado={paso.id}
                  >
                    <span
                      className={clsx(
                        'inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.14em] uppercase shadow-sm',
                        STICKER_EDITORIAL,
                      )}
                    >
                      <BookOpen size={11} weight="fill" />
                      Capítulo
                    </span>

                    <h3
                      className={clsx(
                        'mt-4 leading-snug font-semibold',
                        pieza.grande ? 'text-xl md:text-2xl' : 'text-[15px]',
                      )}
                    >
                      {paso.nombre}
                    </h3>
                    <p
                      className={clsx(
                        'mt-1.5 flex-1 text-[13px] leading-relaxed md:text-sm',
                        esOscura ? 'text-white/60' : 'text-neutral-500',
                      )}
                    >
                      {paso.descripcion}
                    </p>
                    <span className="text-enel-red mt-4 inline-flex items-center gap-1 text-xs font-bold tracking-wide uppercase">
                      {pasoActual === paso.id ? 'Estás aquí' : 'Ir'}
                      <CaretRight
                        size={12}
                        weight="bold"
                        className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </span>
                  </motion.button>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
